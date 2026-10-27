//! Acceso seguro al filesystem local: listado de candidatos de un
//! Directorio de Ingesta y validación de extensiones admitidas.

use std::fs;
use std::path::Path;

/// Extensiones de documentos admitidas por el dominio (append-only).
pub const ALLOWED_EXTENSIONS: [&str; 3] = ["pdf", "jpeg", "png"];

/// True si el archivo tiene una extensión de documento admitida.
pub fn is_allowed_extension(path: &Path) -> bool {
    path.extension()
        .and_then(|ext| ext.to_str())
        .map(|ext| ALLOWED_EXTENSIONS.contains(&ext.to_ascii_lowercase().as_str()))
        .unwrap_or(false)
}

/// Enumera recursivamente los archivos de documento candidatos dentro
/// de `root`. No abre los binarios: solo detecta rutas (ingesta).
pub fn list_candidate_files(root: &str) -> Result<Vec<String>, std::io::Error> {
    let root_path = Path::new(root);
    if !root_path.is_dir() {
        return Err(std::io::Error::new(
            std::io::ErrorKind::NotFound,
            format!("Directorio de ingesta no encontrado: {root}"),
        ));
    }

    let mut candidates: Vec<String> = Vec::new();
    collect_candidates(root_path, &mut candidates)?;
    candidates.sort();
    Ok(candidates)
}

fn collect_candidates(dir: &Path, out: &mut Vec<String>) -> Result<(), std::io::Error> {
    for entry in fs::read_dir(dir)? {
        let entry = entry?;
        let path = entry.path();
        if path.is_dir() {
            collect_candidates(&path, out)?;
        } else if is_allowed_extension(&path) {
            out.push(path.to_string_lossy().into_owned());
        }
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::{is_allowed_extension, list_candidate_files, ALLOWED_EXTENSIONS};
    use std::fs;
    use std::path::Path;

    #[test]
    fn extensiones_admitidas_son_las_del_dominio() {
        assert_eq!(ALLOWED_EXTENSIONS, ["pdf", "jpeg", "png"]);
        assert!(is_allowed_extension(Path::new("a.PDF")));
        assert!(is_allowed_extension(Path::new("b.Jpeg")));
        assert!(is_allowed_extension(Path::new("c.png")));
        assert!(!is_allowed_extension(Path::new("d.exe")));
        assert!(!is_allowed_extension(Path::new("sin-extension")));
    }

    #[test]
    fn lista_candidatos_recursivamente_y_filtra_extensiones() {
        let dir = tempfile::tempdir().expect("tempdir");
        fs::create_dir_all(dir.path().join("sub")).expect("mkdir sub");
        fs::write(dir.path().join("uno.pdf"), b"x").expect("write 1");
        fs::write(dir.path().join("sub/dos.PNG"), b"x").expect("write 2");
        fs::write(dir.path().join("tres.txt"), b"x").expect("write 3");

        let candidates = list_candidate_files(dir.path().to_str().expect("path")).expect("list");
        assert!(candidates.iter().any(|c| c.ends_with("uno.pdf")));
        assert!(candidates.iter().any(|c| c.ends_with("dos.PNG")));
        assert!(candidates.iter().all(|c| !c.ends_with("tres.txt")));
    }

    #[test]
    fn directorio_inexistente_devuelve_error() {
        assert!(list_candidate_files("/ruta/que/no/existe/xyz").is_err());
    }
}