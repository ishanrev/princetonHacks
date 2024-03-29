const mongoose = require("mongoose")
const testCaseSchema = mongoose.Schema({
    num: {
        type: Number,
        required: true
    },
    name: String,
    input: [],
    output: String
})
const questionSchema = mongoose.Schema({
    num: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    questionText: {
        type: String,
        required: true
    },
    funcName: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date
    },
    points: {
        type: Number,
        default: 10
    },
    parameterNames: [String],
    parameterTypes: [String],
    testCases: [testCaseSchema]

})

const testSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    creator: {
        type: String,
        required: true
    },
    public: {
        type: Boolean,
        required: true
    },
    description: {
        type: String,
        default: 'Description lies here'
    },
    img: {
        type: String,
        default: 'https://res.cloudinary.com/dhlxchjon/image/upload/v1659113931/no-image-small_w0xpnx.png'
    },
    questions: [questionSchema]
})


const tests = mongoose.model('test', testSchema)
module.exports = tests;