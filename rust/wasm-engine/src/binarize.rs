//! Binarización a blanco y negro puro (mejora legibilidad + deja la
//! imagen en una sola banda para comprimir luego).

use image::{DynamicImage, GrayImage, ImageFormat, Luma};

/// Convierte la imagen a escala de grises y aplica un umbral:
/// cada píxel pasa a ser 0 (negro) o 255 (blanco).
/// Devuelve los bytes de un PNG de 8 bits por píxel.
pub fn binarize_png(input: &[u8], threshold: u8) -> Result<Vec<u8>, String> {
    let decoded = image::load_from_memory(input).map_err(|err| err.to_string())?;
    let gray = decoded.to_luma8();
    let binary: GrayImage = map_pixels(&gray, |pixel| {
        if pixel[0] >= threshold {
            Luma([255])
        } else {
            Luma([0])
        }
    });

    encode_png_bytes(&DynamicImage::ImageLuma8(binary))
}

/// Mapea píxel a píxel sin lógica de dominio cliente.
fn map_pixels(img: &GrayImage, f: impl Fn(&Luma<u8>) -> Luma<u8>) -> GrayImage {
    let (width, height) = img.dimensions();
    let mut out = GrayImage::new(width, height);
    for (x, y, pixel) in img.enumerate_pixels() {
        out.put_pixel(x, y, f(pixel));
    }
    out
}

/// Verifica que una imagen B/N solo contiene 0 o 255.
#[cfg(test)]
fn is_pure_binary(img: &GrayImage) -> bool {
    img.pixels().all(|pixel| pixel[0] == 0 || pixel[0] == 255)
}

fn encode_png_bytes(img: &DynamicImage) -> Result<Vec<u8>, String> {
    let mut bytes: Vec<u8> = Vec::new();
    let mut cursor = std::io::Cursor::new(&mut bytes);
    img.write_to(&mut cursor, ImageFormat::Png)
        .map_err(|err| err.to_string())?;
    Ok(bytes)
}

#[cfg(test)]
mod tests {
    use super::{binarize_png, is_pure_binary};
    use image::GrayImage;

    /// Genera una imagen en escala de grises con valores intermedios
    /// (55, 129, 200, 250) para que el umbral parta en B/N.
    fn make_gray_png() -> Vec<u8> {
        let mut img = GrayImage::new(2, 2);
        img.put_pixel(0, 0, image::Luma([55]));
        img.put_pixel(1, 0, image::Luma([129]));
        img.put_pixel(0, 1, image::Luma([200]));
        img.put_pixel(1, 1, image::Luma([250]));

        let mut bytes: Vec<u8> = Vec::new();
        let mut cursor = std::io::Cursor::new(&mut bytes);
        image::DynamicImage::ImageLuma8(img)
            .write_to(&mut cursor, image::ImageFormat::Png)
            .expect("encode png");
        bytes
    }

    #[test]
    fn la_binarizacion_es_puramente_blanco_y_negro() {
        let input = make_gray_png();
        let output = binarize_png(&input, 128).expect("binarize");
        let decoded = image::load_from_memory(&output).expect("decode");

        assert!(is_pure_binary(&decoded.to_luma8()));
    }

    #[test]
    fn la_binarizacion_con_umbral_128_particiona_correctamente() {
        let input = make_gray_png();
        let output = binarize_png(&input, 128).expect("binarize");
        let decoded = image::load_from_memory(&output).expect("decode").to_luma8();

        assert_eq!(decoded.get_pixel(0, 0), &image::Luma([0])); // 55  < 128 → negro
        assert_eq!(decoded.get_pixel(1, 0), &image::Luma([255])); // 129 >= 128 → blanco
        assert_eq!(decoded.get_pixel(0, 1), &image::Luma([255])); // 200 >= 128 → blanco
        assert_eq!(decoded.get_pixel(1, 1), &image::Luma([255])); // 250 >= 128 → blanco
    }

    #[test]
    fn rechaza_bytes_que_no_son_imagen() {
        let err = binarize_png(b"no-png", 128);
        assert!(err.is_err());
    }
}