import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app=express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,credentials:true
}))

app.use(express.json({limit:"16kb"})) //config for json format
app.use(express.urlencoded({extended:true,limit:"16kb"})) //config for datafrom url , which may differ from browser to browser

app.use(express.static("public"))

//for performing CRUD operations on cookies
app.use(cookieParser()) 






import userRouter from './routes/user.routes.js'

//routes declaration

app.use("/api/v1/users",userRouter)


export {app}