import mongoose from "mongoose";

// function to connect to database

const connectDB = async () =>{
    mongoose.connection.on('connected',()=> console.log('Database Connected'))
    await mongoose.connect(`${process.env.MONGODB_URI}/intern-link`)
}
export default connectDB;