const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  personalInformation: {
    firstName: { type: String, required: true, trim: true },
    middleName: { type: String, trim: true },
    lastName: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    class :{ type: String, enum: ["1", "2", "3","4","5"], required: true },
    roleNumber:{type:String,required:true, unique:true } ,
    studentMobileNumber: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/, // Ensures a 10-digit mobile number
    },
    studentAddress: { type: String,trim: true },
  },
  parentInformation: {
    fathersName: { type: String, required: true, trim: true },
    mothersName: { type: String, required: true, trim: true },
    parentMobileNumber: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/, // Ensures a 10-digit mobile number
    },
    parentAddress: { type: String, required: true, trim: true },
  },
}, { timestamps: true });

const Student = mongoose.model("Student", userSchema);

module.exports = Student;
