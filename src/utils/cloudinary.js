import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

import dotenv from "dotenv";
dotenv.config({
    path: "./.env"
})
// console.log("=== CLOUDINARY CONFIG DEBUG ===")
// console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME)
// console.log("API Key:", process.env.CLOUDINARY_API_KEY)
// console.log("API Secret:", process.env.CLOUDINARY_API_SECRET ? "✓ Present" : "✗ Missing")
// console.log("================================")

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        // console.log("----ENTERING UPLOADING PHASE________👉👉👉")
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        console.log("error while uploadiong on cloudinary :",error.message)
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}



export {uploadOnCloudinary}

// console.log("🔥🔥🔥 CLOUDINARY FILE LOADED 🔥🔥🔥")

// import dotenv from "dotenv";
// dotenv.config({
//     path: "./.env"
// });  
// import { v2 as cloudinary } from 'cloudinary'
// import fs from 'fs'

// console.log("=== CLOUDINARY CONFIG ===")
// console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME)
// console.log("API Key:", process.env.CLOUDINARY_API_KEY)
// console.log("API Secret:", process.env.CLOUDINARY_API_SECRET ? "✓ Loaded" : "✗ Missing")
// console.log("=========================")

// cloudinary.config({ 
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//     api_key: process.env.CLOUDINARY_API_KEY, 
//     api_secret: process.env.CLOUDINARY_API_SECRET
// })

// console.log("-----entering uploading phase ------ ")

// const uploadOnCloudinary = async (localFilePath) => {
//     try {
//         if (!localFilePath) return null
        
//         if (!fs.existsSync(localFilePath)) {
//             console.log("File not found:", localFilePath)
//             return null
//         }

//         console.log("Uploading to Cloudinary:", localFilePath)

//         const response = await cloudinary.uploader.upload(localFilePath, {
//             resource_type: "auto"
//         })

//         console.log("✓ Upload successful!")
//         console.log("URL:", response.url)

//         // fs.unlinkSync(localFilePath)

//         fs.unlink(localFilePath, (err) => {
//     if (err) {
//         console.error("Unlink error:", err)
//     } else {
//         console.log("File deleted successfully")
//     }
// })
//         return response

//     } catch (error) {
//         console.error("Cloudinary error:", error.message)
//         if (fs.existsSync(localFilePath)) {
//             fs.unlinkSync(localFilePath)
//         }
//         return null
//     }
// }

// export { uploadOnCloudinary }




//-------_------------_______----------------

// import dotenv from "dotenv";
// dotenv.config({
//     path: "./.env"
// })

// import { v2 as cloudinary } from 'cloudinary'
// import fs from 'fs'

// console.log("🔥 CLOUDINARY MODULE LOADED 🔥")

// // Log config at module load time
// console.log("=== CLOUDINARY CONFIG ===")
// console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME || "❌ MISSING")
// console.log("API Key:", process.env.CLOUDINARY_API_KEY || "❌ MISSING")
// console.log("API Secret:", process.env.CLOUDINARY_API_SECRET ? "✓ Loaded" : "❌ MISSING")
// console.log("=========================")

// // Configure cloudinary
// cloudinary.config({ 
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//     api_key: process.env.CLOUDINARY_API_KEY, 
//     api_secret: process.env.CLOUDINARY_API_SECRET
// })

// const uploadOnCloudinary = async (localFilePath) => {
//     try {
//         console.log("📤 uploadOnCloudinary called")
//         console.log("📁 File path received:", localFilePath)
        
//         // Check if path exists
//         if (!localFilePath) {
//             console.log("❌ No file path provided")
//             return null
//         }
        
//         // Check if file exists on disk
//         if (!fs.existsSync(localFilePath)) {
//             console.log("❌ File not found on disk:", localFilePath)
//             return null
//         }

//         console.log("☁️ Starting Cloudinary upload...")

//         // Upload to cloudinary
//         const response = await cloudinary.uploader.upload(localFilePath, {
//             resource_type: "auto"
//         })

//         console.log("✅ Upload successful!")
//         console.log("📎 Cloudinary URL:", response.url)
//         console.log("🆔 Public ID:", response.public_id)

//         // Delete local file after successful upload
//         fs.unlink(localFilePath, (err) => {
//             if (err) {
//                 console.error("⚠️ Error deleting local file:", err.message)
//             } else {
//                 console.log("🗑️ Local file deleted successfully")
//             }
//         })
        
//         return response

//     } catch (error) {
//         console.error("💥 CLOUDINARY UPLOAD ERROR:")
//         console.error("Message:", error.message)
//         console.error("Full error:", error)
        
//         // Clean up local file on error
//         try {
//             if (localFilePath && fs.existsSync(localFilePath)) {
//                 fs.unlinkSync(localFilePath)
//                 console.log("🗑️ Local file cleaned up after error")
//             }
//         } catch (unlinkError) {
//             console.error("⚠️ Error cleaning up file:", unlinkError.message)
//         }
        
//         return null
//     }
// }

// export { uploadOnCloudinary }


// import { v2 as cloudinary } from 'cloudinary';
// import fs from 'fs';

// // ✅ This runs on server start (configuration)
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });

// // Optional: Verify config once on startup
// if (!process.env.CLOUDINARY_CLOUD_NAME) {
//     console.warn("⚠️ WARNING: Cloudinary credentials missing!");
// }

// // ✅ This only runs when called (during upload)
// const uploadOnCloudinary = async (localFilePath) => {
//     try {
//         console.log("📤 Starting upload to Cloudinary");
//         console.log("📁 File:", localFilePath);

//         if (!localFilePath) {
//             console.log("❌ No file path provided");
//             return null;
//         }

//         if (!fs.existsSync(localFilePath)) {
//             console.log("❌ File not found:", localFilePath);
//             return null;
//         }

//         const response = await cloudinary.uploader.upload(localFilePath, {
//             resource_type: "auto"
//         });

//         console.log("✅ Upload successful!");
//         console.log("📎 URL:", response.url);

//         // Delete local file
//         fs.unlink(localFilePath, (err) => {
//             if (err) {
//                 console.error("⚠️ Error deleting file:", err.message);
//             } else {
//                 console.log("🗑️ Local file deleted");
//             }
//         });

//         return response;

//     } catch (error) {
//         console.error("💥 Cloudinary upload error:", error.message);

//         // Cleanup on error
//         if (localFilePath && fs.existsSync(localFilePath)) {
//             try {
//                 fs.unlinkSync(localFilePath);
//                 console.log("🗑️ Local file cleaned up after error");
//             } catch (unlinkError) {
//                 console.error("⚠️ Cleanup error:", unlinkError.message);
//             }
//         }

//         return null;
//     }
// };

// export { uploadOnCloudinary };
