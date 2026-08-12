import sharp from 'sharp';

/**
 * Compresses an image using Sharp
 * @param {File} file - The image file from formData
 * @param {Object} options - Compression options
 * @returns {Promise<Buffer>} - Compressed image buffer
 */
export const compressImage = async (file, options = {}) => {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Default settings (Agar koi custom options na diye toh yeh lagega)
    const {
      quality = 80,           // 80% quality (0-100) - 80 is best balance
      maxWidth = 1920,        // Max width 1920px (Full HD)
      maxHeight = 1080,       // Max height 1080px
      format = 'webp'         // Convert to WebP (Modern, lightweight format)
    } = options;

    const compressedBuffer = await sharp(buffer)
      // Resize: Image ko max dimensions tak shrink karega, stretch nahi hoga
      .resize({
        width: maxWidth,
        height: maxHeight,
        fit: 'inside',        // Aspect ratio maintain karega
        withoutEnlargement: true // Chhoti image ko bada nahi karega
      })
      // Format convert karo (WebP is 30% smaller than JPEG)
      .toFormat(format, { 
        quality 
      })
      .toBuffer();

    return compressedBuffer;
  } catch (error) {
    console.error('Image Compression Error:', error);
    throw new Error('Failed to compress image');
  }
};