import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser"; 
import userRouter from "./routers/userRouter.js"; 
import productRouter from "./routers/productRouter.js"; 
import orderRouter from "./routers/orderRouter.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express()

app.use(bodyParser.json())

app.use(
    (req, res, next) => {
        const value = req.get('authorization');
        if(value != null) {
            const token = value.replace("Bearer ","")
            jwt.verify(
                token, 
                process.env.JWT_SECRET,
                (err, decoded) => {
                    if(decoded == null) {
                        res.status(403).json({
                            message : "Unauthorized"

                        })

                    }    
                    else {    
                        req.user = decoded;
                        next();
                    }
                }
            )    
         }    
                
         else {
            next();
         }           

    }

)
const connectionString = process.env.DATABASE_URL

mongoose.connect(connectionString).then(
    () => {
        console.log("Connected to database")
    }
).catch(
    () => {
        console.log("Failed to connect to the database")
    }
)


app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);








app.listen(5000,
    () => {
        console.log("Server started");
    }  
)    



