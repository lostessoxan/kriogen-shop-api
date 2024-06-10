import express, { RequestHandler } from "express";
import morgan from "morgan";
import cors from "cors";
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";
import orderRoutes from "./routes/orderRoutes";
import compression from "compression";
import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/errors-notFound-handlers";

// =============================== app additional settings

const app = express();

const shouldCompress = (req: any, res: any) => {
  if (req.headers["x-no-compression"]) {
    // don't compress responses with this request header
    return false;
  }

  // fallback to standard filter function
  return compression.filter(req, res);
};

app.use(compression());
app.use(compression({ filter: shouldCompress }));

app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// =============================== ROUTES

app.get("/", (req, res, next) => {
  res.send("BYE BYE");
});
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

// NOT FOUND HANDLER
app.use(notFoundHandler);

// ERRORS HANDLER
app.use(errorHandler);

export default app;
