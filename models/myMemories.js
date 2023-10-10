import mongoose, { Schema, models } from "mongoose";

const memorySchema = new Schema(
  {
    userId: {
      type: String,
      required: false,
    },
    imgUrl: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    full_address: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    latitude: {
      type: String,
      required: false,
    },
    longitude: {
      type: String,
      required: false,
    },
    sDate: {
      type: String,
      required: false,
    },
    eDate: {
      type: String,
      required: false,
    },
    mod: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);

const myMemories =
  models.myMemories || mongoose.model("myMemories", memorySchema);

export default myMemories;
