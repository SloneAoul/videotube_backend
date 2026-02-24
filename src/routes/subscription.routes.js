import { Router } from "express";
import {  toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels} from "../controllers/subscription.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.middleware.js"
import { get } from "mongoose";

const router= Router()

router.route("/toggle-subscription/:channelId").post(verifyJWT,toggleSubscription)

router.route("/channel-subscribers/:channelId").get(verifyJWT,getUserChannelSubscribers)

router.route("/subscribed-channels/:subscriberId").get(verifyJWT,getSubscribedChannels)   








 


    
export default router