import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js';
import {inngest,functions} from './inngest/index.js'
import {serve} from "inngest/express"
import { clerkMiddleware } from '@clerk/express'
import userRouter from './routes/userRoutes.js';
const app=express();
await connectDB()
app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())

const port=process.env.PORT || 4000;
app.get('/',(req,res)=>res.send("server is running"))
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use('/api/user',userRouter)
app.listen(port,()=>
console.log(`server is runnig on port ${port}`))
