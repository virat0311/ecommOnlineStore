import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js'
import cors from 'cors'
import categoryRoute from './routes/categoryRoute.js'
import productRoutes from './routes/productRoutes.js'

//Created by pandey
//rest object creating
dotenv.config();

//database config

connectDB();//dotenve
//import app from express;
const app=express();

//middleware
app.use(cors())
app.use(express.json());
app.use(morgan('dev'));

//routes-that start from here
app.use('/api/v1/auth',authRoutes); //authentication
app.use('/api/v1/category',categoryRoute);//category
app.use('/api/v1/product',productRoutes);//product routes

//rest Api used
app.get('/',(req,res)=>{
    res.send(
       "<h1>hello how are you</h1>"//just chk 

    );
});
//port define
const PORT=process.env.PORT ||8080;//or if port not get from env
//run listen
app.listen(PORT,()=>{
    console.log(`server running on ${process.env.PORT} port: ${PORT}`);
})