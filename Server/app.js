import express from "express";
import cors from "cors";
import AuthRouter from "./router/AuthRouter.js";
import ReportRouter from "./router/ReportRouter.js";
import ScheduleRouter from "./router/ScheduleRouter.js";
import cookieParser from "cookie-parser";

const app = express();
                  
app.use(express.json());
app.use(cors({
  origin: function(origin, callback) {
    // Allowed origins list
    const allowedOrigins = [
      process.env.FORTEND_URL,       
      "https://web-for-docter-danish-khans-projects-32cebd46.vercel.app"
    ].filter(Boolean); 

    // Allow Postman/server-to-server calls (no origin)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin); // debug ke liye
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// OPTIONS preflight ke liye zaroori hai
app.options("*", cors());
app.use(cookieParser());


app.use("/api/auth", AuthRouter);
app.use("/api/report", ReportRouter);
app.use("/api/schedule", ScheduleRouter);

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
