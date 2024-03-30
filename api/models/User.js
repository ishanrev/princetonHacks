const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    emailId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    myTests: {
        type: Array,
        default: []
    },
    img: {
        type: String,
        default: "https://res.cloudinary.com/dhlxchjon/image/upload/v1658670857/user-icon_t5lgwl.png"
    },
    continueTests: {
        type: Array,
        default: []
    },
    saved: {
        type: Array,
        default: []
    },
    friends: mongoose.Schema({
        friends: [],
        pending: [],
        requests: []
    }),

    challenges: [mongoose.Schema({
        fromId: String,
        challenge: mongoose.Mixed
    })],
    lastTest: String,
    // testProgress: {
    //     type: mongoose.Schema({
    //         [String]: mongoose.Schema({
    //             questionsIndex: [Number],
    //             score: Number,
    //             time: Number,
    //             questionsCompleted: Number
    //         })
    //     }),
    //     default: {}
    // },
    testProgress: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    dailyProgress: {
        type: [mongoose.Schema({
            numQuestionsCompleted: {
                type: Number,
                default: 0
            },
            pointsCollected: {
                type: Number,
                default: 0
            }
        })],
        default: [{}, {}, {}, {}, {}, {}, {}]
    },
    daysActive: [String],
    lastLoggedIn: Date,
    courses:{
        type: [String],
        default: []
    },
    badges:{
        type: [String],
        default: []
    }
})

const users = mongoose.model('users', userSchema)
module.exports = users