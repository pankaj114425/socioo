import mongoose from "mongoose";
import "colors"
const connectDB =async()=>{
    try {
        mongoose.connection.on('connected',()=>console.log('Database connected  '.bold.white.bgBlue))
         await mongoose.connect(`${process.env.MONGODB_URL}/socioomedia`)
    } catch (error) {
        console.log("MongoDB connection error:".red, error.message);
    }
}

export default connectDB