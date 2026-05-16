import express from "express";
import cors from "cors";
import AuthRouter from "./router/AuthRouter.js";
import ReportRouter from "./router/ReportRouter.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cors({
  origin: process.env.FORTEND_URL, // Aapka frontend URL (check karein 5173 hai ya 3000)
  credentials: true, // Zaroori hai kyunki aap cookies use kar rahe hain
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(cookieParser());


app.use("/api/auth", AuthRouter);
app.use("/api/report", ReportRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message: message,
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
});


export default app;

