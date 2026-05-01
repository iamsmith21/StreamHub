import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";
import mongoose, { mongo } from "mongoose";
import { Like } from "../models/like.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const videoId = req.params.videoId

    if (!videoId) {
        throw new ApiError(400, "Video not found")
    }

    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: req.user._id
    })

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id)

        return res
            .status(200)
            .json(new ApiResponse(200, existingLike, "Unliked Successfully"))
    } else {
        await Like.create({
            video: videoId,
            likedBy: req.user._id
        })

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Liked Successfully"))
    }

})

export {
    toggleVideoLike
}