// ======================================================
// DEVOPS NOTEBOOK — MONGOOSE MODEL
// ======================================================

import mongoose from "mongoose";

const demoUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const DemoUser = mongoose.model("DemoUser", demoUserSchema);

export default DemoUser;