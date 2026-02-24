import { Router } from "express";
import {  getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus } from "../controllers/video.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.middleware.js"
import { get } from "mongoose";
const router= Router()

router.route("/").get(verifyJWT,getAllVideos)
router.route("/publish-video").post(verifyJWT,
    upload.fields([
        { name: "videoFile", maxCount: 1 },
        { name: "thumbNailFile", maxCount: 1 }
    ]),
    publishAVideo)

    router.route("/").get(verifyJWT,getAllVideos)

router.route("/:videoId").get(verifyJWT,getVideoById)

router.route("/update-video/:videoId").patch(verifyJWT,upload.single("thumbNailFile"), updateVideo)

router.route("/delete-video/:videoId").delete(verifyJWT,deleteVideo)

router.route("/toggle-publish/:videoId").patch(verifyJWT, togglePublishStatus)


    
export default router