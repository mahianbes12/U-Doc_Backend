const mongoose = require('mongoose');

const medicalProfessionalSchema = new mongoose.Schema({
  FirstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  specialty: {
    type: String,
  },
});

const MedicalProfessional = mongoose.model('MedicalProfessional', medicalProfessionalSchema);

module.exports = MedicalProfessional;