import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";

import UserRoutes from "./router/user.routes";
import StudentRoutes from "./router/students.routes";
import attendanceRoutes from "./router/attendance.routes";
import ClassBatchRoutes from "./router/class-batch.routes";
import teacherRoutes from "./router/teacher.routes";
import EnquiryRoutes from "./router/enquiry.routes";
const app: Application = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded());

app.use("/api", UserRoutes);
app.use("/api", StudentRoutes);
app.use("/api", attendanceRoutes);
app.use("/api", ClassBatchRoutes);
app.use("/api", teacherRoutes);
app.use("/api", EnquiryRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("hello there this is the response");
});

export default app;
