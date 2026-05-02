import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";
import mongoose, { mongo } from "mongoose";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";
import { Subscription } from "../models/subscription.model.js"

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    if (!channelId) {
        throw new ApiError(400, "Channel Not Found")
    }

    const subscription = await Subscription.findOne({
        subscriber: req.user._id,
        channel: channelId
    })

    if (subscription) {
        await Subscription.findByIdAndDelete(subscription._id)
        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Unsubscribed Successfully"))
    } else {
        await Subscription.create({
            subscriber: req.user._id,
            channel: channelId
        })
        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Subscribed Successfully"))
    }
})

export {
    toggleSubscription
}