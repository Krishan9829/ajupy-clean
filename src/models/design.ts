import mongoose from "mongoose";

const DesignSchema = new mongoose.Schema(
  {
    prompt: String,
    style: String,
    text: String,
    image: String,
  },
  { timestamps: true }
);

export default mongoose.models.Design ||
  mongoose.model("Design", DesignSchema);