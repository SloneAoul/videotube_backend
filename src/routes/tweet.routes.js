import { Router } from "express";
import {  createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet } from "../controllers/tweet.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.middleware.js"
import { get } from "mongoose";

const router= Router()

router.route("/create-tweet").post(verifyJWT,createTweet)

router.route("/get-tweets/:userId").get(verifyJWT,getUserTweets)

router.route("/update-tweet/:tweetId").patch(verifyJWT,updateTweet)

router.route("/delete-tweet/:tweetId").delete(verifyJWT,deleteTweet)



 


    
export default router