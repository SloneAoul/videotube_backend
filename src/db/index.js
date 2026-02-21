// import mongoose from "mongoose";

// import { DB_NAME } from "../constants.js";

// const connectDB = async () => {
//     try{
//         // const connectionInstance=await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`)
//         const connectionInstance = await mongoose.connect(
//             `${process.env.MONGO_URL}/${DB_NAME}`,
//             {
//                 family: 4  // Force IPv4
//             }
//         );
//         console.log(`\n MongoDb connected! DB host:${connectionInstance.connection.host}`)
//     } catch(error){
//         console.log("Error connecting to MongoDB ", error);
//         process.exit(1)
//     }
// }

// export default connectDB;
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        console.log('Connecting to MongoDB...');
        console.log('URL:', `${process.env.MONGO_URL}/${DB_NAME}`);
        
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGO_URL}/${DB_NAME}`,
            {
                family: 4
            }
        );
        
        console.log(`\n✅ MongoDB connected! DB host: ${connectionInstance.connection.host}`);
    } catch(error){
        console.log("❌ Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
}

export default connectDB;