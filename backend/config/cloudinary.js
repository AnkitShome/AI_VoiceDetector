import dotenv from "dotenv";
dotenv.config();

import { v2 as cloudinary } from 'cloudinary';


cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET
});

// This works with multer.memoryStorage()!
const uploadOnCloudinary = async (buffer) => {
   return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
         { resource_type: "auto" },
         (error, result) => {
            if (error) return reject(error);
            resolve(result);
         }
      );
      stream.end(buffer);
   });
};

<<<<<<< HEAD
export { uploadOnCloudinary };
=======
export { uploadOnCloudinary };
>>>>>>> 587950ddd6b1d81183998ee5a3b3c3c01bfc1aa5
