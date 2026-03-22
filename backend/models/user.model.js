import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    command: {
      type: String,
      required: true
    },

    response: {
      type: String,
      default: ""
    },

    time: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    assistantName: {
      type: String,
      default: "Jarvis"
    },

    assistantImage: {
      type: String,
      default: ""
    },

    history: {
      type: [historySchema],
      default: []
    }
  },
  { timestamps: true }
);


const User = mongoose.model("User", userSchema);

export default User;