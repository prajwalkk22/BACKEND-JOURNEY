import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

// configure cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCLoudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        console.log("✅ File uploaded to Cloudinary:", response.url);

        // delete local file after successful upload
        fs.unlink(localFilePath, (err) => {
            if (err) {
                console.error("❌ Error deleting local file after upload:", err);
            } else {
                console.log("🗑️ Local file deleted:", localFilePath);
            }
        });

        return response;
    } catch (error) {
        console.error("❌ Cloudinary upload failed:", error);

        // try to delete local file if exists even on error
        fs.unlink(localFilePath, (err) => {
            if (err) {
                console.error("❌ Error deleting local file in catch block:", err);
            }
        });

        return null;
    }
};

const deleteFromCloudinary = async (publicId) =>{
    try {
      const result =  await  cloudinary.uploader.destroy(publicId)
      console.log("deleted from cloudinary")
    } catch (error) {
        console.log("Error deleting from the cloudinary",error)
        return null;
        
    }
}

export { uploadOnCLoudinary ,deleteFromCloudinary};
