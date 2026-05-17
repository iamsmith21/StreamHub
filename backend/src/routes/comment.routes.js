import { Router } from "express";
import { addComment, getVideoComment } from "../controllers/comment.controller.js";
import { verifyJWT, optionalJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/:videoId").get(optionalJWT, getVideoComment).post(verifyJWT, addComment)

export default router 