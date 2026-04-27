import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

const uploadOnCloudinary = async (localFilePath) => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });

        if (!localFilePath) return null
        //upload the file on cn
        const uploadResult = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        //file has been successfully uploaded.
        //console.log("File is uploaded successfully on Cloudinary...", uploadResult.url);
        fs.unlinkSync(localFilePath);
        return uploadResult;

    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        //remove the locally saved temp file as the upload operation failed.
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return null;
    }
}

export { uploadOnCloudinary }