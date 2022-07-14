const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const useSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  qr_code: {
    type: String,
    // required: true,
    max: 255,
    min: 6,
    default: "",
  },
  shift: {
    type: Number,
    required: true,
  },

  course_id: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },

  lesson_date: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Lesson", useSchema);
