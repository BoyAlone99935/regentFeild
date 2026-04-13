const CloudinaryStorage = require("multer-storage-cloudinary").CloudinaryStorage;
const multer = require("multer");
const cloudinary = require("../config/cloudinary");

// configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "chat_images",  // optional folder in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

module.exports = upload;
