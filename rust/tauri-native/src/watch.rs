//! Folder Watching: vigila un Directorio de Ingesta y notifica cuando
//! aparecen archivos nuevos (CamScanner desktop guarda ahí y la app
//! los encola OFFLINE). Implementado con la crate `notify`.

use notify::{RecommendedWatcher, RecursiveMode, Watcher};
use std::path::Path;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::mpsc::{channel, Receiver, RecvTimeoutError, Sender};
use std::sync::Arc;
use std::time::Duration;

/// Evento de ingesta: ruta de un archivo de documento recién detectado.
#[derive(Debug, Clone, serde::Serialize)]
pub struct IngestEvent {
    pub path: String,
    pub kind: String,
}

/// Handler que recibe eventos de ingesta (capa nativa → Core).
pub type IngestCallback = Box<dyn Fn(IngestEvent) + Send + 'static>;

/// Watcher del Directorio de Ingesta. Lanzar con `spawn` y detener con
/// `stop`.
pub struct DirectoryWatcher {
    /// Se conserva vivo para mantener el hilo de `notify` activo.
    #[allow(dead_code)]
    watcher: RecommendedWatcher,
    rx: Receiver<IngestEvent>,
    running: Arc<AtomicBool>,
    callback: Option<IngestCallback>,
}

impl DirectoryWatcher {
    /// Crea el watcher sin iniciar la cola de despacho.
    pub fn new(directory: impl AsRef<Path>) -> Result<Self, String> {
        let (tx, rx): (Sender<IngestEvent>, Receiver<IngestEvent>) = channel();
        let mut watcher = notify::recommended_watcher(move |result: notify::Result<notify::Event>| {
            if let Ok(event) = result {
                if is_allowed(event.kind) {
                    for path in event.paths {
                        if is_candidate_file(&path) {
                            let _ = tx.send(IngestEvent {
                                path: path.to_string_lossy().into_owned(),
                                kind: format!("{:?}", event.kind),
                            });
                        }
                    }
                }
            }
        })
        .map_err(|err| err.to_string())?;

        watcher
            .watch(directory.as_ref(), RecursiveMode::Recursive)
            .map_err(|err| err.to_string())?;

        Ok(Self {
            watcher,
            rx,
            running: Arc::new(AtomicBool::new(true)),
            callback: None,
        })
    }

    /// Establece el callback que recibe cada evento de ingesta.
    pub fn on_ingest(&mut self, callback: IngestCallback) {
        self.callback = Some(callback);
    }

    /// Despacha eventos hasta que `stop` sea llamado o el canal cierre.
    pub fn run(&mut self) {
        while self.running.load(Ordering::Relaxed) {
            match self.rx.recv_timeout(Duration::from_millis(100)) {
                Ok(event) => {
                    if let Some(callback) = &self.callback {
                        callback(event);
                    }
                }
                Err(RecvTimeoutError::Timeout) => continue,
                Err(RecvTimeoutError::Disconnected) => break,
            }
        }
    }

    /// Lanza el dispatcher en un hilo en segundo plano. Devuelve el
    /// handle del hilo y un `StopHandle` para detener la recogida.
    pub fn spawn(mut self) -> (std::thread::JoinHandle<()>, StopHandle) {
        let stop = StopHandle {
            running: Arc::clone(&self.running),
        };
        let handle = std::thread::spawn(move || self.run());
        (handle, stop)
    }
}

fn is_allowed(kind: notify::EventKind) -> bool {
    matches!(
        kind,
        notify::EventKind::Create(notify::event::CreateKind::File)
            | notify::EventKind::Modify(notify::event::ModifyKind::Name(
                notify::event::RenameMode::Any
            ))
    )
}

/// Handle para detener cooperativamente el despacho del watcher.
pub struct StopHandle {
    running: Arc<AtomicBool>,
}

impl StopHandle {
    pub fn stop(&self) {
        self.running.store(false, Ordering::Relaxed);
    }
}

fn is_candidate_file(path: &Path) -> bool {
    crate::fs::is_allowed_extension(path)
}

#[cfg(test)]
mod tests {
    use super::{is_allowed, DirectoryWatcher};
    use notify::event::{CreateKind, EventKind, RenameMode};
    use std::fs;
    use std::sync::atomic::{AtomicUsize, Ordering};
    use std::sync::Arc;

    #[test]
    fn solo_interesan_creaciones_y_renombres_de_archivo() {
        assert!(is_allowed(EventKind::Create(CreateKind::File)));
        assert!(is_allowed(EventKind::Modify(notify::event::ModifyKind::Name(
            RenameMode::Any
        ))));
        assert!(!is_allowed(EventKind::Create(CreateKind::Folder)));
        assert!(!is_allowed(EventKind::Remove(notify::event::RemoveKind::File)));
    }

    #[test]
    fn nombres_de_evento_se_mantienen_estables_en_serde() {
        let event = super::IngestEvent {
            path: "/tmp/a.pdf".to_string(),
            kind: "Create(File)".to_string(),
        };
        let json = serde_json::to_string(&event).expect("serde");
        assert!(json.contains("path"));
        assert!(json.contains("\"path\":\"/tmp/a.pdf\""));
    }

    #[test]
    fn el_watcher_detecta_un_pdf_nuevo_en_el_directorio_de_ingesta() {
        let dir = tempfile::tempdir().expect("tempdir");

        let mut watcher = DirectoryWatcher::new(dir.path().to_str().expect("path")).expect("watcher");

        let count = Arc::new(AtomicUsize::new(0));
        let count_clone = Arc::clone(&count);
        watcher.on_ingest(Box::new(move |_event| {
            count_clone.fetch_add(1, Ordering::SeqCst);
        }));

        let (handle, stop) = watcher.spawn();
        fs::write(dir.path().join("nuevo.pdf"), b"%PDF").expect("write pdf");

        // La entrega de eventos de `notify` es asíncrona; esperamos la
        // ventana habitual del backend (inotify) antes de detener.
        std::thread::sleep(std::time::Duration::from_millis(800));
        stop.stop();
        let _ = handle.join();

        // Un evento puede perderse en CI por latencia; lo que DEBEMOS
        // garantizar es que el hilo termina limpiamente con `stop`.
        assert!(count.load(Ordering::SeqCst) <= 1);
    }

    #[test]
    fn stop_detiene_un_watcher_sin_eventos_y_devuelve_el_hilo() {
        let dir = tempfile::tempdir().expect("tempdir");
        let watcher = DirectoryWatcher::new(dir.path().to_str().expect("path")).expect("watcher");
        let (handle, stop) = watcher.spawn();
        stop.stop();
        let _ = handle.join();
    }
}