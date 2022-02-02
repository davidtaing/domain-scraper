import dotenv from "dotenv";
dotenv.config("../.env");

const config = {
  DOMAIN_API_KEY: process.env.DOMAIN_API_KEY,
  MONGOOSE_CONNECTION_STRING: process.env.MONGOOSE_CONNECTION_STRING,
}

export default config;