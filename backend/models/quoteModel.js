import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: [true, "Quote text is required"],
    },
  },
  { timestamps: true }
);

const Quote = mongoose.models.Quote || mongoose.model("Quote", quoteSchema);

export default Quote;
