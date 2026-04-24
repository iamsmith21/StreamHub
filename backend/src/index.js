import * as dotenv from "dotenv"
dotenv.config({ path: './.env'})
import express from "express"
import connectDB from "./db/index.js";

const app = express();


connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000)
})
.catch((err) => {
    console.log("MONGO DB connection failed!", err)
});