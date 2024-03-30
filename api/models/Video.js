const mongoose = require("mongoose")
const videoSchema = mongoose.Schema({

    url: String,
    summary: String,
    title: String,
    description: String
})

const videos = mongoose.model('videos', videoSchema);
module.exports = videos;