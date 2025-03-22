import mongoose from "mongoose";
import colors from 'colors';
import {exit} from "node:process";

export const connectDB = async () => {
    try {
        const connection=await mongoose.connect(process.env.DATABASE_URL);
        const url=`${connection.connection.host}:${connection.connection.port}`;
        console.log(colors.green.bgBlue.bold(`MongoDB Connected: ${url}`));
   
    } catch (error) {
        console.log(error.message);
        exit(1);
    }
}