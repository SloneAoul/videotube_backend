import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"

import {ApiError} from "../utils/apiError.js"
import {Apiresponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query

    const matchStage = {}

    if (query) {
        matchStage.title = { $regex: query, $options: "i" }
    }

    if (userId) {
        matchStage.owner = new mongoose.Types.ObjectId(userId)
    }

    matchStage.isPublished = true

    const pipeline = [
        {
            $match: matchStage
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
                owner: {
                    $first: "$owner"
                }
            }
        },
        {
            $sort: { [sortBy]: sortType === "asc" ? 1 : -1 }
        }
    ]

    const options = {
        page: parseInt(page),
        limit: parseInt(limit)
    }

    const videos = await Video.aggregatePaginate(Video.aggregate(pipeline), options)

    return res.status(200).json(
        new Apiresponse(200, videos, "Videos fetched successfully")
    )
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    if(!title || !description){
        throw new ApiError(400, "either title or description is missing")
    }

    const  videoLocalPath=req.files?.videoFile?.[0]?.path
    const  thumbnNailLocalPath=req.files?.thumbNailFile?.[0]?.path

    if(!videoLocalPath) throw new ApiError(400, "Video file is required")
if(!thumbnNailLocalPath) throw new ApiError(400, "Thumbnail is required")

    const videoFile=await uploadOnCloudinary(videoLocalPath)
    const thumbNailFile=await uploadOnCloudinary(thumbnNailLocalPath)

    if(!videoFile) throw new ApiError(500, "Error uploading video")
if(!thumbNailFile) throw new ApiError(500, "Error uploading thumbnail")
    
    const video=await Video.create({
        title:title,
        description:description,
        videoFile:videoFile.url,
        thumbnail:thumbNailFile.url,
        owner:req.user?._id,
        duration:videoFile.duration,

        isPublished:true


    })

    return res.status(200)
    .json(
        new Apiresponse(201,video,"Video published successsfully")
    )

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video Id")
    }

    const video = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId)
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
                owner: {
                    $first: "$owner"
                }
            }
        }
    ])

    if(!video?.length){
        throw new ApiError(404, "Video not found")
    }

    return res.status(200).json(
        new Apiresponse(200, video[0], "Video retrieved successfully")
    )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

    
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid video Id")

    }

    const{title , description }=req.body

     if(!title || !description){
        throw new ApiError(400, "Title and description are required")
    }

    const thumbnailLocalPath=req.file?.path

    if(!thumbnailLocalPath){
        throw new ApiError(400, "Thumbnail is required")
    }

    const thumbnail=await uploadOnCloudinary(thumbnailLocalPath)



    const video=await Video.findByIdAndUpdate(videoId,
        {
            $set:{
                title,
                description,
                thumbnail: thumbnail.url
            }
        },
        {new:true}
    )
    if(!video){
        throw new ApiError(400,"Video not found")
    }
return res.status(200)
.json(
    new Apiresponse(200,video,"Video details updated successfully")
)

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid video Id")

    }

    const video=await Video.findByIdAndDelete(videoId)

    if(!video){
       throw new ApiError(404,"Invalid Video")
    }

    return res.status(200)
    .json(
        new Apiresponse(200,{},"Video deleted successfully")
    )

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
     
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid video Id")

    }
    const findingvideo=await Video.findById(videoId)
    

    const video=await Video.findByIdAndUpdate(videoId,
        {
            $set:{
                isPublished:!findingvideo.isPublished 
            }
        },{new:true}
    )
    if(!video){
         throw new ApiError(404,"video not found")
        
    }

    return res.status(200)
    .json(
        new Apiresponse(200,{},`Video ${video.isPublished ? "published" : "unpublished"} successfully`)
    )

})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}