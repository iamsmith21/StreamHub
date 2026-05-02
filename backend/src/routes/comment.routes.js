import { Router } from "express";
import { addComment, getVideoComment } from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()
router.use(verifyJWT)
router.route("/:videoId").post(addComment)
router.route("/:videoId").get(getVideoComment)

export default router 