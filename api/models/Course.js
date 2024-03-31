const mongoose = require("mongoose")


const videoSchema = mongoose.Schema({

    url: String,
    summary: String,
    title: String,
    description: String,
    question: String,
    thumbnail: String,
    options: [{
        text:String,
        correct: Boolean
    }]
})

const articleSchema = mongoose.Schema({
    title:String,
    url: String,
    summary:String,
    snippet:String,
})
const courseSchema = mongoose.Schema({

    title: String,
    modules: {
        type: [{
            videos: [videoSchema],
            articles: [articleSchema],
            test: String
        }],
        default: []
    },
    total:{
        type:Number,
        default:0
    }
})

const courses = mongoose.model('courses', courseSchema);
module.exports = courses;