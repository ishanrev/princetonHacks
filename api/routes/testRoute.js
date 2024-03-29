const router = require('express').Router()
const tests = require('../models/Test')


router.get('/test', (req, res) => {
    console.log('test')
    res.send('this router works')
})


router.get("/:id", async (req, res) => {
    const testId = req.params.id;

    console.log('hi')
    try {
        let test = await tests.findOne({ _id: testId })
        res.status(200).send(test)
    } catch (findError) {
        res.status(401).send(findError)
    }
})

router.get('/search', (req, res) => {

})


router.post("/", async (req, res) => {
    console.log('hi')
  
    const { name, creator, public, questions } = req.body;

    let newTest = new tests()
    newTest.name = name;
    newTest.creator = creator
    newTest.public = public
    newTest.questions = questions
    try {
        await newTest.save()
        res.status(200).send({ created: true, test: newTest })
    } catch (saveError) {
        console.log(saveError)
        res.status(404).send({ saveError, created: false })
    }

})
router.delete("/:id", async (req, res) => {
    const testId = req.params.id
    console.log('hi')
    try {
        await tests.findByIdAndDelete(testId)
        res.status(200).send({ deleted: true })
    } catch (deleteError) {
        res.status(401).send({ deleteError, deleted: false })
    }

})
router.put("/:id", async (req, res) => {
    const testId = req.params.id
    const newDetails = req.body
    console.log(newDetails.questions)
    console.log(typeof (newDetails.questions))
    try {
        console.log('hi')
        let test = await tests.findByIdAndUpdate(testId, newDetails)
        console.log(test)
        res.status(200).send({ updated: true, test })
    } catch (updateError) {
        console.log(updateError)
        res.status(400).send({ error: updateError, updated: false })
    }

})

router.post("/browse", async (req, res) => {
    const { filter } = req.body;
    let testList = []
    console.log('reached api call')
    try {
        for (let fil of filter) {
            console.log(fil)
            let ids = await tests.find({
                "name": {
                    "$regex": fil,
                    "$options": "i"
                },
                public:true
            })
            
            ids = ids.map((obj) => {
                let { _id } = obj
                if(testList.includes(_id.toString())===false){
                    return _id.toString()
                }else{
                    return 
                }
            })
            console.log(ids)
            console.log('+=+=+=+=+=+=+=+=+=+=')
            testList = [...testList, ...ids]
        }
        res.status(200).send({ success: true, tests: testList })
    } catch (DBError) {
        console.log('DBError', DBError)
        res.status(404).send({ success: false })
    }
})

module.exports = router
