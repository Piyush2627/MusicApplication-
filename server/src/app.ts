import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

dotenv.config();

import UserRoutes from "./router/user.routes";
import StudentRoutes from "./router/students.routes";
import attendanceRoutes from "./router/attendance.routes";
import ClassBatchRoutes from "./router/class-batch.routes";
import teacherRoutes from "./router/teacher.routes";
import EnquiryRoutes from "./router/enquiry.routes";
import InstrumentRental from "./router/instrumentRental.routes";
import Payment from "./router/payment.routes";
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

app.use("/api", UserRoutes);
app.use("/api", StudentRoutes);
app.use("/api", attendanceRoutes);
app.use("/api", ClassBatchRoutes);
app.use("/api", teacherRoutes);
app.use("/api", EnquiryRoutes);
app.use("/api", InstrumentRental);
app.use("/api", Payment);

app.get("/", (req: Request, res: Response) => {
  res.send("hello there this is the response");
});

export default app;
