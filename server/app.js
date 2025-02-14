  import express from "express";
  import cookieParser from "cookie-parser";
  import cors from "cors";
  import { config } from "dotenv";
  import { dbConnection } from "./config/dbConnection.js";
  import { dirname } from "node:path";
  import { join } from "path";
  import { fileURLToPath } from "url";
  import fileUpload from "express-fileupload";
  import userRouter from "./routers/userRoutes.js";
  import tradeRouter from "./routers/tradeRoutes.js";
  import adminRouter from "./routers/adminRoutes.js";
  import depositWithdrawRouter from "./routers/depositWithdrawRoutes.js";

  const app = express();

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const envPath = join(__dirname, "/config/config.env");

  config({ path: envPath });

  app.use(
    cors({
      origin: [process.env.FRONTEND_URL],
      credentials: true,
      methods: "GET,POST,PUT,DELETE",
      allowedHeaders: "Content-Type,Authorization",
    })
  );
  app.use(express.json());
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));
  app.use(fileUpload({ useTempFiles: true, tempFileDir: "/temp/" }));

  app.use("/api/user", userRouter);
  app.use("/api/trade", tradeRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/funds/", depositWithdrawRouter)


  dbConnection();

  export default app;