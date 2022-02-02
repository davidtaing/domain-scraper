import { model, Schema } from "mongoose";

// mixed "anything goes" Schema because
const Listing = model("Listing", new Schema({ any: [] }));

export default Listing;