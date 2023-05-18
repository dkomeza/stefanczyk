import mongoose from "mongoose";

const images = new mongoose.Schema({
  album: String,
  originalName: String,
  path: String,
  lastChangeTime: {
    type: Date,
    default: Date.now,
  },
  lastChangeOperation: String,
  history: [
    {
      desc: String,
      time: {
        type: Date,
        default: Date.now,
      },
      operation: String,
      path: String,
    },
  ],
});

export const ImageModel = mongoose.model("Image", images);
