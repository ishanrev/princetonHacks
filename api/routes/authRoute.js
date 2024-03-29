const router = require('express').Router()
const users = require('../models/User')
const bcrypt = require('bcrypt')

//create and ign in a user
router.post('/signIn', async (req, res) => {
    const { name, userName, emailId, password } = req.body
    const saltRounds = 10
    try {

        let user = await users.findOne({ emailId })
        if (user !== null) {
            console.log(user)
            console.log("problem")
            throw new Error("user user already eists")
        }
        let hashedPassword = ''
        try {
            hashedPassword = await bcrypt.hash(password, saltRounds)
            console.log(hashedPassword)
        } catch (hashError) { 
            console.log(hashError)
        }
        let newUser = new users({
            name,
            userName,
            emailId,
            password: hashedPassword,
            tests: [],
            friends: {
                friends: [],
                pending: [],
                requests: []
            }
        })

        try {
            let user = await newUser.save()
            res.status(200).send({ success: true, userId: user._id, user })
        } catch (saveError) {
            res.status(400).send({ success: false, error: saveError })
        }

    } catch (createError) {
        console.log("reached user repeat error")
        res.status(401).send({ success: false, error: createError, type: "repeat" })
    }
})
router.post('/login', async (req, res) => {
    const { emailId, password } = req.body
    try {
        let user = await users.findOne({ emailId })
        // console.log(user)
        let reqPassword = user.password
        try {
            let result = await bcrypt.compare(password, reqPassword)
            // console.log(result)
            if (result === true) {
                res.status(200).send({ success: true, loggedIn: true, user })
            } else if (result === false) {
                res.status(200).send({ success: true, loggedIn: false })
            }
        } catch (compareError) {
            res.status(400).send({ success: false, error: compareError })
        }

    } catch (findError) {
        res.status(400).send({ success: false, error: findError })
    }
})

//delete a user
//edit user details
//logIn
// update password thingy - for later
module.exports = router