const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const useSchema = new mongoose.Schema({
  check_in_at: {
    type: Date,
    required: true,
  },
  student_id: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },

  student_name: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },

  lesson_name: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },

  course_id: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },

  lesson_id: {
    type: String,
    required: true,
    max: 1024,
    min: 6,
  },

  student_code: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },

  course_name: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },
});

module.exports = mongoose.model("History", useSchema);
