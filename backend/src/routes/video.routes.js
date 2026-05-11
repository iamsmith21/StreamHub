import { Router } from "express"
import { getAllVideos, publishAVideo, getVideoById, getTrendingHeroVideos, deleteVideo } from "../controllers/video.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"


const router = Router()

// ==============================
// PUBLIC ROUTES
// ==============================
router.route("/").get(getAllVideos)
router.route("/trending/hero").get(getTrendingHeroVideos)
router.route("/:videoId").get(getVideoById)

// ==============================
// PROTECTED ROUTES (Require Login)
// ==============================
router.use(verifyJWT);

router.route("/").post(upload.fields([
    {
        name: "videoFile",
        maxCount: 1
    },
    {
        name: "thumbnail",
        maxCount: 1
    }
]), publishAVideo)

router.route("/:videoId").delete(deleteVideo)

export default router