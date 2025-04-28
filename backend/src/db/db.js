import mongoose from "mongoose"


export const ConnectDB = async()=>{
    try {
        const connectioninstance = await mongoose.connect(`${process.env.MONGO_URI}`)
        console.log(`\n MongoDB is connected to ${connectioninstance.connection.host}`);

    } catch (error) {
        console.log("MONGODB connection error" ,error)
    }
}