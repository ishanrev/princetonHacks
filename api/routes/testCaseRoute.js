const router = require('express').Router()
const tests = require('../models/Test')

// create a test case
router.post("/", async (req, res) => {
    const { testId, questionId, name, input, output } = req.body;
    //test that each thing has a value and non should be undefined
    const keys = [testId, questionId, name, input, output]
    let cont = true
    for (let key of keys) {
        if (key === undefined) {
            cont = false
            break
        } else {
            cont = true
        }
    }

    if (cont === true) {

        try {
            let test = await tests.findById(testId)
            let question = test.questions.filter((t)=>{
                return t._id.toString()===questionId;
            })[0]
            let newTestCase = {
                num: question.testCases.length,
                name,
                input,
                output
            }
            question.testCases.push(newTestCase)
            console.log(question)
            try {
                await test.save()
                res.status(200).send({message: "successfully ceated a new test case", success: true})
            } catch (saveError) {
                res.status(404).send(saveError)
            }
        } catch (findError) {
            res.status(400).send("no such test exists")
        }
    } else {
        res.status(400).send({ message: "body contains undefined data" })
    }
})
// get a testCase
router.get("/", async (req, res) => {
    const { questionId, testId,testCaseId } = req.body;
    try {
        let test = await tests.findById(testId)
        let question = test.questions.filter((q)=>{
            return q._id.toString()===questionId;
        })[0]
        let testCase = question.testCases.filter((t)=>{
            return t._id.toString()===testCaseId;
        })[0]
        res.status(200).send({success: true, testCase})
    } catch (findError) {
        res.status(400).send("no such test exists")
    }

})
// delete a testcase
router.delete("/", async (req, res) => {
    const { questionId, testId,testCaseId } = req.body;
    console.log(questionId, testId)
    try {
        let test = await tests.findById(testId)
        let question = test.questions.filter((q)=>{
            return q._id.toString()===questionId;
        })[0]
        let testCase = question.testCases.filter((t)=>{
            return t._id.toString()===testCaseId;
        })[0]
        question.testCases.splice(question.testCases.indexOf(testCase),1)
        try {
            await test.save()
            res.status(200).send({success: true, message: "deleted testCase successfully"})
        } catch (saveError) {
            res.status(404).send(saveError)
        }
    } catch (findError) {
        res.status(400).send("no such test exists")
    }

})
// update a testcase
router.put("/", async (req, res) => {
    const { questionId, testId,testCaseId, update } = req.body;
    console.log(questionId, testId)
    try {
        let test = await tests.findById(testId)
        // console.log(test)
        let question = test.questions.filter((q)=>{
            return q._id.toString()===questionId;
        })[0]
        // console.log(question)
        let testCase = question.testCases.filter((t)=>{
            return t._id.toString()===testCaseId;
        })[0]
        //actually updating the test
        let testCasekeys = Object.keys(testCase._doc)
        let updateKeys = Object.keys(update)
        updateKeys.forEach((key)=>{
            testCase[key] = testCasekeys.includes(key)?update[key]:testCase[key]
        })
        try {
            await test.save()
            res.status(200).send({success: true, message: "updated testCase successfully"})
        } catch (saveError) {
            res.status(404).send(saveError)
        }
    } catch (findError) {
        res.status(400).send("no such test exists")
    }

})
module.exports = router;