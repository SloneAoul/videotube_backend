import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/apiError.js"
import {Apiresponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content}=req.body
    if(!content){
        throw new ApiError(400,"Content missing")
    }

    const tweet=await Tweet.create({
        content,
        owner: req.user?._id
    })
    if(!tweet){
        throw new ApiError(400,"Tweet no published")

    }
    return res.status(200)
    .json(
        new Apiresponse(200,tweet,"Tweet is published successful")
    )


})

const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params
    const { page = 1, limit = 10 } = req.query

    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user Id")
    }

    const pipeline = [
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar: 1,
                            fullname: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: { $first: "$owner" }
            }
        },
        {
            $sort: { createdAt: -1 }
        }
    ]

    const options = {
        page: parseInt(page),
        limit: parseInt(limit)
    }

    const tweets = await Tweet.aggregatePaginate(Tweet.aggregate(pipeline), options)

    return res.status(200).json(
        new Apiresponse(200, tweets, "Tweets fetched successfully")
    )
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId}=req.params
    const {content}=req.body

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"Invalid tweet Id")
    }

    if(!content){
        throw new ApiError(400,"Content missing")
    }

    const tweet= await Tweet.findByIdAndUpdate(tweetId,
        {
            $set:{
                content:content
            }
        }, { new: true }
    )

    if(!tweet){
        throw new ApiError(400,"tweet  missing")
    }

    return res.status(200)
    .json(
        new Apiresponse(200, tweet, "Tweet updated successfully")
    )

})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet

    const {tweetId}=req.params
    

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"Invalid tweet Id")
    }

    const tweet= await Tweet.findByIdAndDelete(tweetId)

    if(!tweet){
        throw new ApiError(400,"tweet  missing")
    }

    return res.status(200)
    .json(
        new Apiresponse(200, {}, "Tweet deleted successfully")
    )

})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}