import { Router } from "express";
import {  getVideoComments, 
    addComment, 
    updateComment,
     deleteComment } from "../controllers/comment.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.middleware.js"
import { get } from "mongoose";
const router= Router()




router.route("/video/:videoId").get(verifyJWT,  getVideoComments) 
router.route("/add/:videoId").post(verifyJWT,  addComment) 
router.route("/update/:commentId").patch(verifyJWT,  updateComment) 
router.route("/delete/:commentId").delete(verifyJWT,  deleteComment) 


    
export default router