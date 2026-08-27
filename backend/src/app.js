import express from "express";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import interviewRouter from "./routes/interview.routes.js";

const app = express();

app.get("/", (req, res) => {
    res.json({
        message: "AI Resume Analyzer Backend is running",
        version: "36934e0",
    });
});

const allowedOrigins = [
    "http://localhost:5173",
    "https://ai-resume-analyzer-alpha-lovat.vercel.app",
    process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

app.get("/api/test", (req, res) => {
    res.json({
        message: "API route is working",
    });
});

export default app;