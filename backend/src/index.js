import * as dotenv from "dotenv"
dotenv.config({ path: './.env' })
import { app } from "./app.js";
import connectDB from "./db/index.js";


connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000)
        console.log("Server Listening on Port 8000")
    })
    .catch((err) => {
        console.log("MONGO DB connection failed!", err)
    });