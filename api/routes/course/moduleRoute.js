const router = require('express').Router()
// const videos = require('../../models/Video')
// const articles = require('../../models/Article')
// const tests = require('../../models/Test')

router.get('/test', (req, res) => {
    console.log('test')
    res.send('this router works for the module route')
})

module.exports = router