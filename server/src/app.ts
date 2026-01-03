import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

dotenv.config();

import router from "./router/index.router";
const app: Application = express();

const allowedOrigins = [
	"http://localhost:5173",
	"https://music-application-mu.vercel.app",
];
app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error("Not allowed by CORS"));
			}
		},
		credentials: true,
	})
);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded());

app.use("/v1", router);

app.get("/", (req: Request, res: Response) => {
	res.send("hello there this is the response");
});

export default app;
