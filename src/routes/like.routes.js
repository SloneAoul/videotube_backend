import { Router } from "express";
import {  toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos } from "../controllers/like.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.middleware.js"
import { get } from "mongoose";
const router= Router()




router.route("/toggle-video-like/:videoId").patch(verifyJWT,toggleVideoLike)

//start testing from here

router.route("/toggle-comment-like/:commentId").patch(verifyJWT,toggleCommentLike) // testing left

router.route("/toggle-tweet-like/:tweetId").patch(verifyJWT,toggleTweetLike)

router.route("/videos").get(verifyJWT,getLikedVideos)

    
export default router