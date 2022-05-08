const mongoose = require('mongoose')

const useSchema = new mongoose .Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255,
    },
    email:{
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    role: {
        type: String,
        required: true,
        enum: ['Admin', 'Teacher', 'Student']
    },

    password:{
        type: String,
        required: true,
        max: 1024,
        min: 6
    },
    
    date:{
        type: Date,
        default: Date.now
    },

    student_code:{
        type: String,
        required: true,
        max: 255,
        min: 6
    },

    phone: {
        type: String,
        max: 255,
        min: 6,
        default: " "
    },

    date_of_birth:{
        type: Date,
        required: true,
    },

})

module.exports = mongoose.model('User', useSchema)