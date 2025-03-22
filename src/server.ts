import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { corsConfig } from './config/cors';
import cors from 'cors';
import morgan from 'morgan';
import projectRoutes from './routes/projectRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config(); //En este caso es para la variable de entorno DATABASE_URL este de forma gloabal

connectDB();


const app=express();

app.use(cors(corsConfig))

//Logging

app.use(morgan('dev'))

//Habilita el body en formato JSON para obtener la respueta de los datos
app.use(express.json());



//Routes
app.use('/api/auth',authRoutes)
app.use('/api/projects',projectRoutes);

export default app;