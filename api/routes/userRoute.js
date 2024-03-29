const router = require('express').Router()
const users = require('../models/User')
const bcrypt = require('bcrypt')

// delete a user
router.delete('/:id', async (req, res) => {
    const userId = req.params.id
    console.log('hi')
    try {
        await users.findByIdAndDelete(userId)
        res.status(200).send({ success: true })
    } catch (deleteError) {
        res.status(401).send({ error: deleteError, success: false })
    }
})
// edit user details
router.put('/:id', async (req, res) => {
    const userId = req.params.id
    const newDetails = req.body
    let changeKeys = Object.keys(newDetails)
    let newValues    // console.log(newProgress);
    try {
        // let updated = await users.findByIdAndUpdate(userId, { testProgress: newProgress }, { new: true })
        let user = await users.findById(userId)
        for (key of changeKeys) {
            console.log(key)
            console.log(newDetails[key])
            user[key] = newDetails[key];
        }
        // user.testProgress = newProgress
        user.save()
        let updated = await users.findById(userId)
        console.log(user)
        res.status(200).send({ success: true, updated: user })
    } catch (updateError) {
        console.log(updateError)
        res.status(401).send({ error: updateError, success: false })
    }

})
router.get('/:id', async (req, res) => {
    const userId = req.params.id
    console.log('hi')
    try {
        let user = await users.findById(userId)
        res.status(200).send({ success: true, user })
    } catch (findError) {
        res.status(401).send({ error: findError, success: false })
    }
})
router.get('/email/:id', async (req, res) => {
    const emailId = req.params.id
    console.log('hi')
    try {
        let user = await users.find({ emailId })
        res.status(200).send({ success: true, user })
    } catch (findError) {
        res.status(401).send({ error: findError, success: false })
    }
})
// updates:
// add a test, delete a test
// add favourites, delete a favourites question list
// progress updates

// update password thingy - for later
module.exports = router