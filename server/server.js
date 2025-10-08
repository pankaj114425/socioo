import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js';
import {inngest,functions} from './inngest/index.js'
import {serve} from "inngest/express"
const app=express();
await connectDB()
app.use(express.json())
app.use(cors())
const port=process.env.PORT || 3000;
app.get('/',(req,res)=>res.send("server is running"))
app.use("/api/inngest", serve({ client: inngest, functions }));

app.listen(port,()=>
console.log(`server is runnig on port ${port}`))
