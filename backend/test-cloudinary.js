import * as dotenv from "dotenv"
dotenv.config({ path: './.env'})
import fs from "fs"
import { uploadOnCloudinary } from "./src/utils/cloudinary.js"

fs.writeFileSync("test.txt", "test file content")

uploadOnCloudinary("test.txt").then(res => {
    console.log("Result:", res)
}).catch(err => {
    console.error("Error:", err)
})
