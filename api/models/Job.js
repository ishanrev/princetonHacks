const mongoose = require('mongoose')
const jobSchema = mongoose.Schema({
    language: {
        type : String,
        required: true,
        default: 'py',
        enum: ['cpp','py']
    },
    filepath:{
        type: String,
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    startedAt: {
        type: Date,
    },
    completedAt: {
        type: Date,
    },
    output: {
        type: String
    },
    compileStatus : {
        type: String,
        default: "pending", 
        enum: ["pending", "success","error"]
    }

})
const jobs = mongoose.model('jobs',jobSchema) 

module.exports = jobs;