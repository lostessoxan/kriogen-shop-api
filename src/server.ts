import dotenv from "dotenv";
import env from "./utils/validateEnv";
import connectDB from "./config/db";
import app from "./app";

dotenv.config();

const port = process.env.PORT || 8080;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is listening on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error(err.message);
  });

// ================================
