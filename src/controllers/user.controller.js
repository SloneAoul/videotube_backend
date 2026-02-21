import {asyncHandler} from "../utils/asyncHandler.js"
import jwt from 'jsonwebtoken';
import {ApiError} from  "../utils/apiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {Apiresponse} from "../utils/ApiResponse.js"
import mongoose from "mongoose"

const generateAceessAndRefreshTokens=async (userId)=>
{
    try {
        const user=await User.findById(userId)
       const accessToken=user.generateAccessToken()
       const refreshToken=user.generateRefreshToken()

       //saving refrsehs token in database
       user.refreshToken=refreshToken
       await user.save({validateBeforeSave:false})

       return {accessToken,refreshToken}

    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating refresh and access tokens")
        
    }
}

const registerUser=asyncHandler(async(req ,res)=>{
   // get user details from frontend
   
  
   const {fullname, email, username , password}=req.body
    
// validation - not empty
if(
    [fullname,email,username,password].some((field)=>field?.trim()==="")
){
    throw new ApiError(400,"All fields are required")
}
// check if user already exists: username, email
const existUser=await User.findOne({
    $or:[
        {email},
        {username}
    ]
})

if(existUser){
    throw new ApiError(409,"User with same email or username already exists ")
}


// check for images, check for avatar

// const avatarLocalpath=req.files?.avatar[0]?.path

// console.log(avatarLocalpath)

let avatarLocalPath;
if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
    avatarLocalPath = req.files.avatar[0].path;
}

let coverImageLocalPath;
if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path;
}

if(!avatarLocalPath){
    throw new ApiError(400,"Avatar file is required")
}



// Your upload to cloudinary code here...




// upload them to cloudinary, avatar
const avatar=await uploadOnCloudinary(avatarLocalPath)
const coverImage=await uploadOnCloudinary(coverImageLocalPath)

if(!avatar){
    throw new ApiError(400,"avatar file is not present")
}
console.log("-------entering user creation-------")
// create user object - create entry in db
const user= await User.create({fullname, 
    avatar:avatar.url, 
    coverImage:coverImage?.url || "", //if coverImage exists then upload otherwise leave it empty
    email,
    password,
    username:username.toLowerCase()
})
 console.log("----------User successfully created : --------")
// remove password and refresh token field from response
const createdUser=await User.findById(user._id).select(" -password -refreshToken")


// check for user creation

if(!createdUser){
    throw new ApiError(500,"something went wrong while registering the user")
}
// return res
return res.status(201).json(
    new Apiresponse(200,createdUser,"User registered successfully")
)

}
)


const loginUser=asyncHandler(async(req,res)=>{
    //req body->data
    console.log("Data in req body :-----",req.body)
const { email, username , password}=req.body
  //check if userrname or email exist
if(!username && !email){
    throw new ApiError(400,"username or email is required")
}
 //find the user

const user=await User.findOne({
    $or:[{username},{email}]
 })

if(!user){
    throw new ApiError(404,"user does not exist")
}

    //password check
const isPasswordValid=await user.isPasswordCorrect(password)
if(!isPasswordValid){
    throw new ApiError(401,"password incorrect")
}

    //generate access and refresh token

   const {accessToken,refreshToken}= await generateAceessAndRefreshTokens(user._id)


   const loggedInUser=await User.findById(user._id).select("-password -refreshToken")

    //send cookies

    const options={
        httpOnly:true,
        secure:true
    }
//coookie has key and value pairs
    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new Apiresponse(200,
            {
                user:loggedInUser,accessToken,refreshToken
            },
            "user logged In successfullly"
        )
    )


    
})


const logoutUser=asyncHandler(async(req,res)=>{
    //remove cookies

    await User.findByIdAndUpdate(
        req.user._id,

        {
            $set:{refreshToken:undefined}

        },
        {
            new:true
        }
    )
    const options={
        httpOnly:true,
        secure:true
    }

    return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(
        new Apiresponse(200,{},"User logged out successfully")
    )

    // remove refresh token
    
})

const refreshAccessToken=asyncHandler(async(req,res)=>{
    //access from cookies
   const incomingRefreshToken= req.cookies.refreshToken || req.body.refreshToken
if(!incomingRefreshToken){
    throw new ApiError(401,"unauthorized request")
}

try {
    const decodedToken =jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    )
    
    const user=await User.findById(decodedToken?._id)
    if(!user){
        throw new ApiError(401,"invalid refresh token")
    }
    if(incomingRefreshToken!==user?.refreshToken)
    {
        throw new ApiError(401,"Refresh token is expired or used")
    }
    
    const options={
        httpOnly:true,
        secure:true,
    
    }
    
    const {accesstoken, newrefreshToken}=await generateAceessAndRefreshTokens(user._id)
    
    return res.status(200)
    .cookie("accessToken",accesstoken)
    .cookie("refreshToken",newrefreshToken)
    .json (
        new Apiresponse(
            200,
            {accesstoken, refreshToken:newrefreshToken},
            "access token refreshed"
        )
    )
} catch (error) {

    throw new ApiError(401,error?.message || "invalid refresh token")
    
}
})


const changeCurrentPassword=asyncHandler(async(req,res)=>{
    console.log(req.body)
    const {oldPassword, newPassword}=req.body

    const user=await User.findById(req.user?._id)

    const isPasswordcorrectTrueOrfalse=await user.isPasswordCorrect(oldPassword)

    if(!isPasswordcorrectTrueOrfalse)
        throw new ApiError(400,"invalid old password")

    user.password=newPassword
    await user.save({validateBeforeSave:false})

    return res.status(200).json(
        new Apiresponse(200,{},"Password changed succesfully")
    )


})

const getcurrentUser=asyncHandler(async(req,res)=>{
    return res.status(200)
    .json(new Apiresponse(200, req.user, "current user fetched successfully"))
})


const updateAccountDetails=asyncHandler(async(req,res)=>{
    const {fullname, email}=req.body
    
    if(!fullname || !email){
        throw new ApiError(400,"All fields are required")
    }

    const user=await User.findByIdAndUpdate(req.user?._id,
        {
            $set:{
                fullname:fullname,
                email:email
            }
        },
        {new:true}
    ).select("-password ")


    return res.status(200)
    .json(
        new Apiresponse(200,user,"account details updated successfully")
    )


})

const updateUserAvatar=asyncHandler(async(req,res)=>{

    const avatarLocalPath=req.file?.path
    if(!avatarLocalPath){
        throw new ApiError(400,"avatarfile missing")
    }

    const avatar=await uploadOnCloudinary(avatarLocalPath)

    if(!avatar.url){
        throw new ApiError(400,"Error while uploading on avatar")
    }

    const user=await User.findByIdAndUpdate(req.user?._id,
    {
        $set:{
            avatar:avatar.url
        }
    },
    {
        new :true
    }
    ).select("-password")

    return res.status(200)
    .json(
        new Apiresponse(200,user,"avatar image updated successfully")
    )



})
const updateUserCoverImage=asyncHandler(async(req,res)=>{

    const CoverImageLocalPath=req.file?.path
    if(!CoverImageLocalPath){
        throw new ApiError(400,"cover Image  missing")
    }

    const coverImage=await uploadOnCloudinary(CoverImageLocalPath)

    if(!coverImage.url){
        throw new ApiError(400,"Error while uploading on avatar")
    }

    const user=await User.findByIdAndUpdate(req.user?._id,
    {
        $set:{
            coverImage:coverImage.url
        }
    },
    {
        new :true
    }
    ).select("-password")

    return res.status(200)
    .json(
        new Apiresponse(200,user,"Cover image updated successfully")
    )



})

const getUserChannelProfile=asyncHandler(async(req, res)=>{

    const {username}=req.params
    if(!username?.trim())
    {
        throw new ApiError(400,"username is missing")
    }
//aggreagation pipelines
    const channel=await User.aggregate([
        {
            $match:{
                username:username?.toLowerCase()
              
            }

        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"channel",
                as:"subscribers"
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"subscriber",
                as:"subscribedTo"
            }
        },
        {
            $addFields:{
                subscribersCount:{
                    $size:"$subscribers"
                },

                channelsSubscribedToCount:{
                    $size:"$subscribedTo"
                },
                isSubscribed:{
                    $cond:{
                        if:{$in:[req.user?._id,"$subscribers.subscriber"]},
                        then:true,
                        else:false
                    }
                }
            }
        },
        {
            $project:{
                fullname:1,
                username:1,
                subscribersCount:1,
                channelsSubscribedToCount:1,
                isSubscribed:1,
                coverImage:1,
                avatar:1,
                email:1,




            }
        }
    ])

    if(!channel?.length){
        throw new ApiError(404,"Channel does not exist")
    }

    return res
    .status(200)
    .json(
        new Apiresponse(200,channel[0],"user channel fetched successfully")
    )

})

const getWatchHistory = asyncHandler(async(req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
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
                        $addFields:{
                            owner:{
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res
    .status(200)
    .json(
        new Apiresponse(
            200,
            user[0].watchHistory,
            "Watch history fetched successfully"
        )
    )
})

export {registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getcurrentUser,changeCurrentPassword,updateAccountDetails,
updateUserAvatar,
updateUserCoverImage,
getUserChannelProfile,
getWatchHistory}

