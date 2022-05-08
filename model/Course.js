const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const { randomColor } = require("../components/randomColor");

const useSchema = new mongoose.Schema({
  classroom_name: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  start_date: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },
  end_date: {
    type: String,
    required: true,
    max: 1024,
    min: 6,
  },

  teacher_id: {
    type: Object,
    required: true,
    max: 1024,
    min: 6,
  },

  students: [{
    type: Object,
    // required: true,
    max: 1024,
    min: 6,
  }],

  color:{
    type: String,
    // required: true
    default: randomColor()
  },

  location: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
});

module.exports = mongoose.model("Course", useSchema);
