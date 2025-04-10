const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});// Configure Cloudinary
console.log(process.env.CLOUDINARY_CLOUD_NAME, process.env.CLOUDINARY_API_KEY, process.env.CLOUDINARY_API_SECRET);
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    console.log("🔄 Uploading File:", file.originalname);

    // Extract the format from the MIME type
    let format = file.mimetype.split("/")[1];

    // Manually set the format for MP3 files
    if (file.mimetype === "audio/mpeg") {
      format = "mp3";
    }

    return {
      folder: "ToyNest",
      format: format, // Use the extracted or manually set format
      resource_type: "auto", // Ensures correct handling of videos, PDFs, etc.
    };
  },
});
  const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file limit
    fileFilter: (req, file, cb) => {
      console.log("🧐 Checking File Type:", file.mimetype);
      if (["image/", "video/", "application/pdf","audio/"].some(type => file.mimetype.startsWith(type))) {
        cb(null, true);
      } else {
        cb(new Error("Invalid file type! Only images, videos, and PDFs are allowed."), false);
      }
    }
  });



module.exports = { upload, cloudinary }; 