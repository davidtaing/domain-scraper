import mongoose from "mongoose";
const { model, Schema } = mongoose;

// "strict: false" due to mixed column datatypes
const Listing = model(
  "Listing", 
  new Schema({
    _id: Schema.Types.Number,
  }, { strict: false })
);

export default Listing;