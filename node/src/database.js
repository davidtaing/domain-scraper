import mongoose from "mongoose";
import config from "./config.js";

const connectDb = async () => {
  mongoose.connect(
    config.MONGOOSE_CONNECTION_STRING,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  ).then(() => console.log("Successfully connected to MongoDB"))
  .catch((err) => console.error(err));
}

export default connectDb;