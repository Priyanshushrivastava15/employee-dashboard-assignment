const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  employeeId: { type: Number, unique: true, sparse: true }, // Added sparse: true to avoid errors with existing docs
  name: { type: String, required: true },
  age: { type: Number, required: true },
  class: { type: String, required: true },
  subjects: [{ type: String }],
  attendance: { type: Number, required: true }, 
}, { timestamps: true });

EmployeeSchema.index({ name: 'text', class: 'text' });

module.exports = mongoose.model('Employee', EmployeeSchema);