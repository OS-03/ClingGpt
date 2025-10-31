import OpenAI from 'openai';
import express from "express";
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import chatRoutes from "./routes/chat.js"

// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
//   baseURL:process.env.BASE_URL
// });


// const response = await client.chat.completions.create({
//     model: "provider-3/gpt-4.1-mini",
//     messages: [
//       { role: "user", content: "Difference Between SQL and MongoDB" },
//     ],
//   });

// console.log(response.choices[0].message.content);

const app = express();

//middlewares
app.use(express.json());
app.use(cors());
app.use("/api/v1",chatRoutes);

const connectDB = async()=>{
  try{
   const res = await mongoose.connect(process.env.MONGO_URI);
   console.log("MONGO-DB CONNECTED")
  }catch(err){
    console.log("failed connection",err)
  }
}

app.get('/',(req,res)=>{
  res.send("Server Running!");
});


app.listen(process.env.PORT,()=>{
  console.log(`Server Running @${process.env.PORT}`);
  connectDB();
})