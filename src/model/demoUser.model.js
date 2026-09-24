// ======================================================
// DEVOPS NOTEBOOK — MONGOOSE MODEL
// ======================================================

import mongoose from "mongoose";

const demoUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique:true,
      match: /^[A-Za-z]+$/
    },
  },
  {
    timestamps: true,
  }
);

const DemoUser = mongoose.model("DemoUser", demoUserSchema);

export default DemoUser;