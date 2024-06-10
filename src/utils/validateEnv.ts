import { cleanEnv, port, str } from "envalid";

export default cleanEnv(process.env, {
  NODE_ENV: str(),
  PORT: port(),
  MONGODB_URI: str(),
  JWT_SECRET: str(),
});
