import mongoose, { Schema } from "mongoose";

const tweetSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 280 // optional: limit tweet length like Twitter
    }
  },
  { timestamps: true }
);

export const Tweet = mongoose.model("Tweet", tweetSchema);