import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET// Click 'View API Keys' above to copy your API secret
    });

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cn
        const uploadResult = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        console.log("File is uploaded successfully on Cloudinary...", response.url);
        //file has been successfully uploaded.
        return response;

    } catch (error) {

        //remove the locally saved the temp file as the uploadOps got failed.
        fs.unlinkSync(localFilePath);
        return null;
    }
}