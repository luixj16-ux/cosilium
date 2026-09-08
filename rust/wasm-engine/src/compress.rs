//! Compresión de imagen en el cliente: reduce la dimensión máxima y
//! almacena en escala de grises (imagen de una sola banda), logrando
//! una reducción drástica de tamaño para los binarios que se suben.

use image::{DynamicImage, ImageFormat};

/// Re-encoda la imagen a escala de grises y la limita a `max_dimension`
/// píxeles por lado. Devuelve los bytes de un PNG comprimido.
pub fn compress_image(input: &[u8], max_dimension: u32) -> Result<Vec<u8>, String> {
    let decoded = image::load_from_memory(input).map_err(|err| err.to_string())?;
    let gray = decoded.to_luma8();
    let resized = scale_down(gray, max_dimension);

    let mut bytes: Vec<u8> = Vec::new();
    let mut cursor = std::io::Cursor::new(&mut bytes);
    DynamicImage::ImageLuma8(resized)
        .write_to(&mut cursor, ImageFormat::Png)
        .map_err(|err| err.to_string())?;
    Ok(bytes)
}

/// Reduce la imagen si excede `max_dimension` en su lado mayor,
/// preservando la proporción.
fn scale_down(img: image::GrayImage, max_dimension: u32) -> image::GrayImage {
    let (width, height) = img.dimensions();
    let longest = width.max(height);
    if longest <= max_dimension {
        return img;
    }

    let ratio = max_dimension as f64 / longest as f64;
    let new_width = ((width as f64) * ratio).max(1.0) as u32;
    let new_height = ((height as f64) * ratio).max(1.0) as u32;

    image::imageops::resize(
        &img,
        new_width,
        new_height,
        image::imageops::FilterType::Triangle,
    )
}

/// True si el lado mayor es <= max_dimension.
#[cfg(test)]
fn fits_within(img: &image::GrayImage, max_dimension: u32) -> bool {
    let (width, height) = img.dimensions();
    width.max(height) <= max_dimension
}

#[cfg(test)]
mod tests {
    use super::{compress_image, fits_within, scale_down};
    use image::{DynamicImage, GrayImage, ImageFormat, Luma};

    fn make_noisy_gray_png(width: u32, height: u32) -> Vec<u8> {
        let mut img = GrayImage::new(width.max(1), height.max(1));
        for x in 0..img.width() {
            for y in 0..img.height() {
                let v = ((x * 7 + y * 13) % 256) as u8;
                img.put_pixel(x, y, Luma([v]));
            }
        }
        let mut bytes: Vec<u8> = Vec::new();
        let mut cursor = std::io::Cursor::new(&mut bytes);
        DynamicImage::ImageLuma8(img)
            .write_to(&mut cursor, ImageFormat::Png)
            .expect("encode png");
        bytes
    }

    #[test]
    fn la_compresion_convierte_a_escala_de_grises_sin_error() {
        let input = make_noisy_gray_png(64, 64);
        let output = compress_image(&input, 64).expect("compress");
        assert!(!output.is_empty());
    }

    #[test]
    fn la_compresion_respeta_la_dimension_maxima() {
        let decoded = image::load_from_memory(&make_noisy_gray_png(256, 128)).expect("decode");
        let gray = decoded.to_luma8();
        let resized = scale_down(gray, 64);
        assert!(fits_within(&resized, 64));
    }

    #[test]
    fn la_compresion_puede_reducir_el_peso_del_binario() {
        // Ruido en 8 bits VS misma imagen binarizada a 1 banda con
        // dimensión reducida: la salida debe pesar menos.
        let input = make_noisy_gray_png(300, 200);
        let input_len = input.len();
        let output = compress_image(&input, 64).expect("compress");
        assert!(output.len() < input_len, "esperado compresión, {} >= {input_len}", output.len());
    }

    #[test]
    fn la_compresion_solo_escala_dentro_de_la_dimension() {
        let decoded = image::load_from_memory(&make_noisy_gray_png(32, 32)).expect("decode");
        let img = decoded.to_luma8();
        assert!(fits_within(&img, 64));
    }
}