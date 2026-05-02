import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";
import mongoose, { mongo } from "mongoose";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    //we will be getting this from the frontend.
    const { content } = req.body

    if (!content) {
        throw new ApiError(400, "Content is missing")
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id
    })

    return res
        .status(200)
        .json(new ApiResponse(200, comment, "Commented Successfully"))
})

const getVideoComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const videoComment = await Comment.find({
        video: videoId
    }).populate("owner", "fullname avatar")
    // to get the details of owner 
    // (to loook into field, and what to get)

    return res
        .status(200)
        .json(new ApiResponse(200, videoComment, "Video Comment Fetched Successfully"))
})
export {
    addComment,
    getVideoComment
}