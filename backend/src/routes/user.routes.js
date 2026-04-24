import { Router } from "express"
import { regiseterUser } from "../controllers/user.controller.js"

const router = Router()

router.route("/register").post(regiseterUser)
router.route("/login").post(regiseterUser)

export default router