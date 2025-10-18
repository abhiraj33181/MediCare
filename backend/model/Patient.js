import mongoose from "mongoose";
import { type } from "os";
import { stringify } from "querystring";
import { computeAgeFromDOB } from "../utils/date.js";

const emergenecyContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: stringify,
      required: true,
    },
    relationship: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const medicalHistorySchema = new mongoose.Schema(
  {
    allergies: {
      type: String,
      default: "",
    },
    currentMedications: {
      type: String,
      default: "",
    },
    chronicConditions: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    profileImage: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
    },
    dob: {
      type: Date,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    emergenecyContact: emergenecyContactSchema,
    medicalHistory: medicalHistorySchema,
    isVerified : {
    type : Boolean,
    default : False,
  },
  },
  { timestamps: true }
);

patientSchema.pre("save", function (next) {
  if (this.dob && this.isModified("dob")) {
    this.age = computeAgeFromDOB(this.dob);
  }
  next();
});

export default patientModel = mongoose.model("Patient", patientSchema);
