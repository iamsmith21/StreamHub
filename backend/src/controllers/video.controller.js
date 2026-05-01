import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";
import mongoose, { mongo } from "mongoose";

const publishAVideo = asyncHandler(async (req, res) => {
    //title, desc, and select a video file and thumbnail picture'
    const { title, description } = req.body

    if (!title?.trim() || !description?.trim()) {
        throw new ApiError(400, "Title or Description Missing!")
    }

    //from the routes page. from multer
    const videoFileLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path || "";

    if (!videoFileLocalPath) {
        throw new ApiError(400, "Video File Doesnt Exist.")
    }

    const video = await uploadOnCloudinary(videoFileLocalPath)

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    if (!video) {
        throw new ApiError(400, "Video Failed to Upload on Cloudinary")
    }

    if (!thumbnail) {
        throw new ApiError(400, "Thumbnail Failed to Upload on Cloudinary")
    }

    const newVideo = await Video.create({
        videoFile: video.url,
        thumbnail: thumbnail.url,
        title: title,
        description: description,
        duration: video.duration,
        // owner: new mongoose.Types.ObjectId()
        owner: req.user._id
    })

    return res
        .status(200)
        .json(
            new ApiResponse(201, newVideo, "Video uploaded successfully")
        )
})

const getAllVideos = asyncHandler(async (req, res) => {
    //the userid is for finding specific channel
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

    const pipeline = [];

    pipeline.push({
        $match: {
            isPublished: true
        }
    })

    if (query) {
        pipeline.push({
            $match: {
                title: {
                    $regex: query,
                    $options: "i" //case insensitive ignore cap letters
                }
            }
        })
    }

    if (userId) {
        pipeline.push({
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        })
    }

    if (sortBy && sortType) {
        pipeline.push({
            $sort: {
                [sortBy]: sortType === "asc" ? 1 : -1
            }
        })
    }

    const videoAggregate = Video.aggregate(pipeline)

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    }

    const videos = await Video.aggregatePaginate(videoAggregate, options)

    return res
        .status(200)
        .json(new ApiResponse(200, videos, "Videos fetched Successfully"))
})
export {
    publishAVideo,
    getAllVideos
}