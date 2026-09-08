use serde::Serialize;
use tauri::Manager;

/// Respuesta del comando nativo de ingesta (folder watching).
#[derive(Serialize)]
struct IngestResult {
    detected_files: usize,
    ingested_keys: Vec<String>,
}

/// Comando de ejemplo que expone la lógica nativa (folder watching)
/// a la capa TS. La implementación real delega en la crate
/// `consilium-tauri-native` (rust/tauri-native).
#[tauri::command]
async fn ingest_from_directory(path: String) -> Result<IngestResult, String> {
    let files = consilium_tauri_native::fs::list_candidate_files(&path)
        .map_err(|err| err.to_string())?;
    Ok(IngestResult {
        detected_files: files.len(),
        ingested_keys: files,
    })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![ingest_from_directory])
        .run(tauri::generate_context!())
        .expect("error al ejecutar CONSILIUM Desktop");
}