import mongoose, { isValidObjectId } from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/apiError.js"
import {Apiresponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video Id")
    }

    const pipeline = [
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
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
                            fullname: 1,
                            username: 1,
                            avatar: 1
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

    const comments = await Comment.aggregatePaginate(Comment.aggregate(pipeline), options)

    return res.status(200).json(
        new Apiresponse(200, comments, "Comments fetched successfully")
    )
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const{content}=req.body
    const {videoId}=req.params

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video Id")
    }

    if(!content){
        throw new ApiError(400,"comment is missing")
    }

    const comment=await Comment.create({
    content,
    video:videoId,
    owner:req.user?._id
    })

    if(!comment){
        throw new ApiError(500,"Failed to add comment")
    }
    return res.status(201).json(
        new Apiresponse(201, comment, "Comment added successfully")
    )
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const{commentId}=req.params
     const{content}=req.body

     

    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid comment Id")
    }


    if(!content){
        throw new ApiError(400,"comment is missing")
    }

    const updatedComment=await Comment.findByIdAndUpdate( commentId,
        {
            $set:{
                content

            }
        }, { new: true })

        if(!updatedComment){
            throw new ApiError(500,"Failed to update comment")
        }

        return res.status(200).json(
            new Apiresponse(200,updatedComment,"comment updated successfully")
        )
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId}=req.params

    if(!isValidObjectId(commentId)){
        throw new ApiError(400,"Invalid comment Id")}

    const deletedComment=await Comment.findByIdAndDelete(commentId)

    if(!deletedComment){
        throw new ApiError(500,"Failed to delete comment")
    }

    return res.status(200).json( 
        new Apiresponse(200,{},"Comment deleted successfully")
       )

    })
export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }