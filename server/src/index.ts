import express, { Request, Response, Router } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import userRouter from "./routes/user.routes";
import adminRouter from "./routes/admin.routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());
app.use(bodyParser.json());

const mainRouter: Router = Router();
mainRouter.use("/", userRouter);
mainRouter.use("/", adminRouter);

app.use("/api", mainRouter);

app.get("/api", (req, res) => {
  res.send("Express Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
