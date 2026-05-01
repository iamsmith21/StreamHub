import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))



app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(cookieParser())

//routes

import userRouter from './routes/user.routes.js'
import videoRouter from './routes/video.routes.js'
import likeRouter from './routes/like.routes.js'
//routes declaration

//its outside app so we have to usethe middleware -> app.use
app.use("/api/v1/users", userRouter)
app.use('/api/v1/videos', videoRouter)
app.use('/api/v1/likes', likeRouter)
//http://localhost:8000/api/v1/users/login


export { app }