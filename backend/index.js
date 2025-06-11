require('dotenv').config();

const cookieParser = require("cookie-parser");
const authRoute = require("./Routes/AuthRoute");
const cors = require("cors");
const express= require("express");
const mongoose=require('mongoose');
const PORT=process.env.PORT || 3002;
const uri=process.env.MONGO_URL;

const app=express();


app.listen(PORT, ()=>{
    console.log("App started");
    mongoose.connect(uri);
    console.log("db connected");
});

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());

app.use("/", authRoute);