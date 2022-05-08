const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const useSchema = new mongoose.Schema({
  students: [{
      
  }],

  course_id: [{
    type: Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  }],

});

module.exports = mongoose.model("Attendence", useSchema);
