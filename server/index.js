import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import multer from 'multer';
import morgan from 'morgan';
import path from "path";
import { fileURLToPath } from 'url';
import authRoutes from "./routes/auth.js"
import { register } from './controllers/auth';

// CONFIGURATIONS
const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);
dotenv.config();
const app=express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));
app.use(morgan("commmon"));
app.use(bodyParser.json({limit:"30mb",extended:true}));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets",express.static(path.join(__dirname,'public/assets')));

// FILE STORAGE

const storage=multer.diskStorage({ // snippet of multer to save data
    destination:function(req,file,cb){
        cb(null,"public/assets");
    },
    filename:function(req,file,cb){
        cb(null,file.originalname);
    }
});
const upload=multer({storage});

// ROUTES WITH FILES
app.post("auth/register",upload.single("picture"),register);

// ROUTING
app.use("/auth",authRoutes)

// MONGOOSE SETUP

const PORT=process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    app.listen(PORT,()=>console.log(`Server Started on PORT: ${PORT}`));
}).catch((error)=> console.log(` ${error} did not connect`));