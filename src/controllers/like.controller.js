import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/apiError.js"
import {Apiresponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {Video} from "../models/video.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid video")
    }

    const existingLike= await Like.findOne({
       video: videoId,
       likedBy: req.user?._id
    })
  
    if(existingLike){
        //like to dislike

        const like = await Like.findByIdAndDelete(existingLike._id)
        return res.status(200).json(
                    new Apiresponse(200, {}, "Unliked successfully")
                )
    }
    else{
        const like =await Like.create({
    video: videoId,
    likedBy: req.user?._id
})
        return res.status(200)
    .json(
        new Apiresponse(200 , {}, "Liked successfully")
    )
    }

   
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    // const {commentId} = req.params
    //TODO: toggle like on comment

    const { commentId } = req.params

    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid comment Id")
    }

    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user?._id
    })

    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id)
        return res.status(200).json(
            new Apiresponse(200, {}, "Comment unliked successfully")
        )
    } else {
        await Like.create({
            comment: commentId,
            likedBy: req.user?._id
        })
        return res.status(200).json(
            new Apiresponse(200, {}, "Comment liked successfully")
        )
    }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    // const {tweetId} = req.params
    // //TODO: toggle like on tweet
    const { tweetId } = req.params

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweet Id")
    }

    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user?._id
    })

    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id)
        return res.status(200).json(
            new Apiresponse(200, {}, "Tweet unliked successfully")
        )
    } else {
        await Like.create({
            tweet: tweetId,
            likedBy: req.user?._id
        })
        return res.status(200).json(
            new Apiresponse(200, {}, "Tweet liked successfully")
        )
    }
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
     const likedVideos = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(req.user?._id),
                video: { $exists: true, $ne: null }
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "video",
                pipeline: [
                    {
                        $project: {
                            title: 1,
                            thumbnail: 1,
                            duration: 1,
                            views: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                video: { $first: "$video" }
            }
        }
    ])

    return res.status(200).json(
        new Apiresponse(200, likedVideos, "Liked videos fetched successfully")
    )
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}