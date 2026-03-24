import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    type: {
      type: String,
      required: true,
    },

    input: {
      question: {
        type: String,
        default: "",
      },
      code: {
        type: String,
        default: "",
      },
    },

    response: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Analysis", analysisSchema);