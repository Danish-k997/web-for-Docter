import express from "express";
import cors from "cors";
import AuthRouter from "./router/AuthRouter.js";
import cookieParser from "cookie-parser";

const app = express();



app.use(express.json());
app.use(cors());
app.use(cookieParser());


app.use("/api/auth", AuthRouter);



export default app;

