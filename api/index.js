import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import router from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import postRouter from './routes/post.route.js';

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));
  
app.use(cookieParser());

app.use(express.json());


app.use('/api/user',router);
app.use('/api/auth',authRouter);
app.use('/api/post',postRouter);

app.use((error,req,res,next)=>{
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });

})

dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log('MongoDB connected successfully');
}).catch((err)=>{
    console.log('MongoDB connection error:', err);
})



app.listen(3000, () => {
    console.log('Server is running on port 3000');
});