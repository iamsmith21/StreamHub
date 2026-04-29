import mongoose, { mongo, Schema } from "mongoose";

// making one like model instead of all - video like, comment like or tweet like

const likeSchema = new Schema({
    video: {
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    },
    tweet: {
        type: Schema.Types.ObjectId,
        ref: "Tweet"
    },
    likedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},
    { timestamps: true })

export const Like = mongoose.model("Like", likeSchema)