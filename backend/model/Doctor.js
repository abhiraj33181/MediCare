import mongoose from "mongoose";

export const healthcareCategoriesList = [
  "Primary Care",
  "Manage Your Condition",
  "Mental & Behavioral Health",
  "Sexual Health",
  "Children's Health",
  "Senior Health",
  "Women's Health",
  "Men's Health",
  "Wellness",
];

const dailyTimeRangeSchema = new mongoose.Schema({
    start : {type : String},
    end : {type : String,}
}, {_id : false})


const availablityRangeSchema = new mongoose.Schema({
    startDate : {type : String},
    endDate : {type : String,},
    excludeWeekdays : {
        type : [Number],
        default : []
    }
}, {_id : false})


const doctorSchema = new mongoose.Schema({
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
  specialization: {
    type: String,
    enum: [
      "Cardiologist",
      "Dermatologist",
      "Orthopedic",
      "Pediatrician",
      "Neurologist",
      "Gynecologist",
      "General Physician",
      "ENT Specialist",
      "Psychiatrist",
      "Ophthalmologist",
    ],
  },
  category : {
    type : String,
    enum: healthcareCategoriesList,
    required : false,
  },
  qualification : {
    type : String,
  },
  experience :{
    type : Number,
  },
  about : {
    type : String,
  },
  fees : {
    type : Number,
  },
  hospitalInfo : {
    name : String,
    address : String,
    city : String,
  },
  availablityRange: availablityRangeSchema,
  dailyTimeRange : dailyTimeRangeSchema,
  slotDurationMinutes : {
    type : Number,
    default : 30
  },
  isVerified : {
    type : Boolean,
    default : false,
  }
});


const doctorModel = mongoose.model('Doctor', doctorSchema)

export default doctorModel;