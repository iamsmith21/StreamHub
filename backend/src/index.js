import * as dotenv from "dotenv"
dotenv.config({ path: './.env'})
import mongoose from "mongoose";
// import { DB_NAME } from "./constants.js"
import express from "express"

const app = express();

( async () => {
    try {
       const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`)
       console.log(`\n MongoDB connected! DB HOST: ${connectionInstance.connection.host}`)
       
       const PORT = process.env.PORT || 8000
       app.listen(PORT, () => {
           console.log(`\n Server is running on port: ${PORT}`)
       })
    } catch (error) {
        console.error("ERROR: ", error)
        throw error
    }
})()