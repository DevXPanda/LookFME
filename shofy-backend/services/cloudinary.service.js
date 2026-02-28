const { secret } = require("../config/secret");
const cloudinary = require("../utils/cloudinary");
const { Readable } = require('stream');

// cloudinary Image Upload
// const cloudinaryImageUpload = async (image) => {
//   console.log('image service',image)
//   const uploadRes = await cloudinary.uploader.upload(image, {
//     upload_preset: secret.cloudinary_upload_preset,
//   });
//   return uploadRes;
// };

const cloudinaryImageUpload = (imageBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { upload_preset: 'LOOKFAME' },
      (error, result) => {
        if (error) {
          console.error('Error uploading to Cloudinary:', error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    const bufferStream = new Readable();
    bufferStream.push(imageBuffer);
    bufferStream.push(null);

    bufferStream.pipe(uploadStream);
  });
};


const cloudinaryFileUpload = (fileBuffer, originalname) => {
  return new Promise((resolve, reject) => {
    // Generate a unique ID that includes the original extension
    // Cloudinary raw uploads need the extension in the public_id to serve it with the right content-type
    const ext = originalname.split('.').pop();
    const uniqueId = `resumes/${Date.now()}_${originalname.replace(/\s+/g, '_')}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      { upload_preset: 'LOOKFAME', resource_type: 'auto', public_id: uniqueId },
      (error, result) => {
        if (error) {
          console.error('Error uploading file to Cloudinary:', error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    const bufferStream = new Readable();
    bufferStream.push(fileBuffer);
    bufferStream.push(null);

    bufferStream.pipe(uploadStream);
  });
};

// cloudinaryImageDelete
const cloudinaryImageDelete = async (public_id) => {
  const deletionResult = await cloudinary.uploader.destroy(public_id);
  return deletionResult;
};

exports.cloudinaryServices = {
  cloudinaryImageDelete,
  cloudinaryImageUpload,
  cloudinaryFileUpload,
};
