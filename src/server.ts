import cors from "cors";
import express, { Request, Response } from "express";
import morgan from "morgan";
import authRouter from "./routes/auth.route";
import { connectMongoose } from "./configs/mongo";

const app = express();

// Middleware 
app.use(morgan("dev"))
app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true
}));
app.use(express.json())

// Health route
app.get("/api/health", (req: Request, res: Response) => {
    res.status(200).json({
        status: "success",
        message: "2FA app is running, Health status is OK"
    })
});

// User Routes
app.use("/api/auth", authRouter)

app.all("*", (req: Request, res: Response) => {
    res.status(404).json({
        status: "fail",
        message: `Route ${req.originalUrl} is not found`
    })
});

app.listen(3000, async () => {
    console.log("Server is Successfully Running, and App is listening on port "+ 3000)
    
    // connect Mongodb
    await connectMongoose()
});



