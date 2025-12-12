const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  class: { type: String, required: true },
  subjects: [{ type: String }],
  attendance: { type: Number, required: true }, // Percentage (0-100)
}, { timestamps: true });

// Index for search performance
EmployeeSchema.index({ name: 'text', class: 'text' });

module.exports = mongoose.model('Employee', EmployeeSchema);