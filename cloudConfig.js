const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "HotelPro_DEV",
    allowedformats: ["png","jpg","jpeg","jfif"],
    public_id: (req , file) => {  
    const originalName = file.originalname.split(".")[0]; // to remove extension
    const timestamp = Date.now(); // to avoid conflicts
    return  `${originalName}-${timestamp}`; // Custom filename
    }
  },
});

module.exports = {
    cloudinary,
    storage,   
};