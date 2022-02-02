import mongoose from "mongoose";
import config from "./config.js";

const connectDb = async () => {
  mongoose.connect(
    config.MONGOOSE_CONNECTION_STRING,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  ).then(() => {
    clearDatabase();
    console.log("Successfully connected to MongoDB");
  })
  .catch((err) => console.error(err));
}


async function clearDatabase() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
  console.log("Flushed documents from database");
}

export default connectDb;