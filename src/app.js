import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app=express()

// app.use(cors({
//     origin:process.env.CORS_ORIGIN,credentials:true
// }))

app.use(cors({
    origin: function(origin, callback) {
        const allowedOrigins = [
            "http://localhost:5173",
            process.env.CORS_ORIGIN
        ]
        if(!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true
}))

app.use(express.json({limit:"16kb"})) //config for json format
app.use(express.urlencoded({extended:true,limit:"16kb"})) //config for datafrom url , which may differ from browser to browser

app.use(express.static("public"))

//for performing CRUD operations on cookies
app.use(cookieParser()) 






import userRouter from './routes/user.routes.js'
import videoRouter from './routes/video.routes.js'
import tweetRouter from './routes/tweet.routes.js'
import subscriptionRouter from './routes/subscription.routes.js'
import likeRouter from './routes/like.routes.js'
import commentRouter from './routes/comment.routes.js'
//routes declaration

app.use("/api/v1/users",userRouter)
app.use("/api/v1/videos",videoRouter)
app.use("/api/v1/tweets",tweetRouter)
app.use("/api/v1/subscriptions",subscriptionRouter)
app.use("/api/v1/likes",likeRouter)
app.use("/api/v1/comments",commentRouter)



export {app}