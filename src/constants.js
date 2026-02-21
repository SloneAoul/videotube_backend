import mongoose from "mongoose"
import express from "express"

export const DB_NAME="test"
const app =express()
// (async()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`)
//         app.on("error",(err)=>{
//             console.log("error {constant.js}",err)
//             throw err

//         })
//     } catch (error) {
//         console.log("error {constant.js}",error)
//         throw error
//     }
// })()