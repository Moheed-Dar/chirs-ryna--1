// import { v2 as cloudinary } from 'cloudinary';

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
//   secure: true,
// });

// // Upload image to Cloudinary
// export const uploadImage = async (file, folder = 'properties') => {
//   try {
//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);

//     return new Promise((resolve, reject) => {
//       cloudinary.uploader
//         .upload_stream(
//           {
//             folder: folder,
//             resource_type: 'auto',
//             allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
//             max_file_size: 5 * 1024 * 1024, // 5MB
//           },
//           (error, result) => {
//             if (error) {
//               reject(error);
//             } else {
//               resolve({
//                 url: result.secure_url,
//                 public_id: result.public_id,
//                 width: result.width,
//                 height: result.height,
//                 format: result.format,
//                 size: result.bytes,
//               });
//             }
//           }
//         )
//         .end(buffer);
//     });
//   } catch (error) {
//     throw error;
//   }
// };

// // Upload multiple images
// export const uploadMultipleImages = async (files, folder = 'properties') => {
//   try {
//     const uploadPromises = files.map((file) => uploadImage(file, folder));
//     const results = await Promise.all(uploadPromises);
//     return results;
//   } catch (error) {
//     throw error;
//   }
// };

// // Delete image from Cloudinary
// export const deleteImage = async (publicId) => {
//   try {
//     const result = await cloudinary.uploader.destroy(publicId);
//     return result;
//   } catch (error) {
//     throw error;
//   }
// };

// // Delete multiple images
// export const deleteMultipleImages = async (publicIds) => {
//   try {
//     const result = await cloudinary.api.delete_resources(publicIds);
//     return result;
//   } catch (error) {
//     throw error;
//   }
// };

// export default cloudinary;












import { v2 as cloudinary } from 'cloudinary';
import { compressImage } from '@/backend/utils/imageCompressor'; // ✅ Import kiya

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Upload image to Cloudinary
// ✅ compressOptions parameter add kiya
export const uploadImage = async (file, folder = 'properties', compressOptions = {}) => {
  try {
    // ✅ 1. PEHLE IMAGE COMPRESS KARO
    // Agar avatar hai toh 500px width rakhein, agar property hai toh 1920px
    const compressedBuffer = await compressImage(file, compressOptions);

    // ✅ 2. AB COMPRESSED BUFFER CLOUDINARY KO BHEJO
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: folder,
            resource_type: 'image', // auto ki jagah image likhein (kyunki ab yeh confirm hai)
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve({
                url: result.secure_url,
                public_id: result.public_id,
                width: result.width,
                height: result.height,
                format: result.format,
                size: result.bytes,
              });
            }
          }
        )
        .end(compressedBuffer); // ✅ Raw buffer ki jagah compressed buffer bheja
    });
  } catch (error) {
    throw error;
  }
};

// Upload multiple images
export const uploadMultipleImages = async (files, folder = 'properties', compressOptions = {}) => {
  try {
    const uploadPromises = files.map((file) => uploadImage(file, folder, compressOptions));
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    throw error;
  }
};

// Delete image from Cloudinary
export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw error;
  }
};

// Delete multiple images
export const deleteMultipleImages = async (publicIds) => {
  try {
    const result = await cloudinary.api.delete_resources(publicIds);
    return result;
  } catch (error) {
    throw error;
  }
};

export default cloudinary;