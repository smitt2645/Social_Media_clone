import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv"
import { connectDb } from "./db/DbConnection.mjs";
import cors from "cors"
const app = express();
dotenv.config({
    path:"./.env"
})


app.use(bodyParser.json({limit:'30mb',extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}));
app.use(cors());

const URI = String(process.env.DB_URI);
connectDb(URI);

// authRoute

import AuthRoute from "./router/authRoute.mjs";
import userRoute from "./router/userRoute.mjs";
import postsRoute from "./router/postRouter.mjs";
app.use("/api/v1/auth",AuthRoute);
app.use("/api/v1/user",userRoute);
app.use("/api/v1/posts",postsRoute);


const Port = process.env.PORT || 3000
app.listen(Port,()=>{
console.log(`server running on http://localhost:${Port}`);
});