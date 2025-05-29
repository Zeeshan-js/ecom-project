import mongoose from "mongoose"

const DB_NAME = "exom"
export let dbInstance = undefined;

const connectDB = async () => {
    try {
        const connetionInstance = await mongoose.connect(process.env.MONGODB_URI)
        dbInstance = connetionInstance;
        console.log("Database is connected !!",connetionInstance.connection.host)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

export default connectDB;