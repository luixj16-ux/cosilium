//! Hash criptográfico SHA-256 (crate `sha2`).

use sha2::{Digest, Sha256};

/// Calcula el SHA-256 de `data` y lo devuelve en hexadecimal.
pub fn sha256_hex(data: &[u8]) -> String {
    let mut hasher = Sha256::new();
    hasher.update(data);
    let digest = hasher.finalize();
    hex_encode(&digest)
}

/// Codifica bytes a minúsculas hexadecimal.
fn hex_encode(bytes: &[u8]) -> String {
    bytes.iter().map(|byte| format!("{byte:02x}")).collect()
}

#[cfg(test)]
mod tests {
    use super::sha256_hex;

    #[test]
    fn sha256_de_abc_es_el_vector_conocido() {
        // Vector de prueba estándar del NIST.
        assert_eq!(
            sha256_hex(b"abc"),
            "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
        );
    }

    #[test]
    fn sha256_es_estable_y_determinista() {
        let data = b"expediente-digital.pdf";
        assert_eq!(sha256_hex(data), sha256_hex(data));
    }

    #[test]
    fn sha256_de_buffers_distintos_diffiere() {
        assert_ne!(sha256_hex(b"a"), sha256_hex(b"b"));
    }
}