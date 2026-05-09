import { Router } from "express"
import { getAllVideos, publishAVideo, getVideoById, getTrendingHeroVideos, deleteVideo } from "../controllers/video.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"


const router = Router()

router.use(verifyJWT);

router.route("/").get(getAllVideos).post(upload.fields([
    {
        name: "videoFile",
        maxCount: 1
    },
    {
        name: "thumbnail",
        maxCount: 1
    }
]), publishAVideo)

router.route("/trending/hero").get(getTrendingHeroVideos)
router.route("/:videoId").get(getVideoById).delete(deleteVideo)


export default router