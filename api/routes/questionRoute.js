const router = require('express').Router()
const { format } = require('express/lib/response')
const tests = require('../models/Test')
const { executePy } = require('../executePy')
const { generateFile } = require('../generateFile')
const { checkAnswerPy, runAnswerPy } = require('../checkAnswer')
// Test function
router.get('/test', (req, res) => {
    console.log('test')
    res.send('this router works')
})

// get a question
router.get("/", async (req, res) => {
    const { questionId, testId } = req.body;
    try {
        let test = await tests.findById(testId)
        let found = false
        for (let question of test.questions) {
            if (question._id.toString() === questionId) {
                found = true
                res.status(200).send({ found: true, question })
                break
            }
        }
        if (found === false) {
            res.status(400).send({ found: false })
        }
    } catch (findError) {
        res.status(400).send("no such test exists")
    }

})
// get all questions
router.get("/all", async (req, res) => {
    const { testId } = req.body;
    try {
        let test = await tests.findById(testId)
        let questions = test.questions;
        res.status(200).send({ success: true, questions })
    } catch (findError) {
        res.status(400).send("no such test exists")
    }

})

// create a question
router.post("/", async (req, res) => {
    const { testId, name, questionText, funcName, parameterNames, parameterTypes } = req.body;
    //test that each thing has a value and non should be undefined
    const keys = [testId, name, questionText, funcName]
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
            num = test.questions.length
            let newQuestion = {
                num,
                name,
                questionText,
                funcName,
                parameterNames,
                parameterTypes
            }

            test.questions.push(newQuestion)
            try {
                await test.save()
                let questionId = test.questions[test.questions.length - 1]._id.toString()
                res.status(200).send({ message: "successfully ceated a new question", questionId })
            } catch (saveError) {
                res.status(404).send(saveError)
            }
        } catch (findError) {
            res.status(400).send("no such test exists")
            console.log(findError)
        }
    } else {
        res.status(400).send({ message: "body contains undefined data" })
    }
})
// delete a question
router.delete("/", async (req, res) => {
    const { testId, questionId } = req.body;
    try {
        let test = await tests.findById(testId)

        let found = false
        let index = 0
        for (let question of test.questions) {
            if (question._id.toString() === questionId) {
                found = true
                test.questions.splice(index, index + 1)
                try {
                    await test.save()
                    res.status(200).send({ deleted: true })
                } catch (saveError) {

                    res.status(400).send({ deleted: false, saveError })
                }
                index += 1
                break
            }
        }
        if (found === false) {
            res.status(400).send({ deleted: false, message: "no such question" })
        }
    } catch (findError) {
        res.status(400).send({ message: "no such test exists", findError: findError.message })
    }

})
// update a question
router.put("/", async (req, res) => {
    const { testId, questionId, update } = req.body;
    console.log(testId, questionId, update)
    try {
        let test = await tests.findById(testId)
        let found = false
        let index = 0
        for (let question of test.questions) {
            if (question._id.toString() === questionId) {
                console.log(question)
                found = true
                let updateKeys = Object.keys(update)
                let questionKeys = Object.keys(question._doc)
                console.log(updateKeys, questionKeys)
                updateKeys.forEach((key) => {
                    question[key] = questionKeys.includes(key) ? update[key] : question[key]
                })
                try {
                    await test.save()
                    res.status(200).send({ updated: true })
                } catch (saveError) {
                    res.status(400).send({ updated: false, saveError })
                }
                index += 1
                break
            }
        }
        if (found === false) {
            res.status(400).send({ updated: false, message: "no such question" })
        }
    } catch (findError) {
        res.status(400).send({ message: "no such test exists" })
    }
})
// move a question from one test to another
router.put("/move", async (req, res) => {
    const { testId, toId, questionId } = req.body
    try {
        let test = await tests.findById(testId)
        let to = await tests.findById(toId)

        let found = false
        for (let question of test.questions) {
            if (question._id.toString() === questionId) {
                found = true
                question.num = to.questions.length

                console.log(to.questions)
                console.log(question)
                let temp = JSON.parse(JSON.stringify(question))
                to.questions.push(temp)
                console.log(to.questions)

                test.questions.splice(test.questions.indexOf(question), 1)
                console.log(test.questions)

                try {
                    await to.save()
                    await test.save()
                    res.status(200).send({ messgage: "successfull made the change" })
                } catch (saveError) {
                    res.status(400).send({ saveError })
                }
                break
            }
        }
        if (found === false) {
            res.status(400).send({ found: false })
        }

        // console.log(findError_)
        // res.status(400).send({ message: "no such destination test exists" })

    } catch (findError) {
        console.log(findError)
        res.status(400).send({ message: "no such test exists", findError })
    }
})
// check a question
router.post("/check", async (req, res) => {
    const { testId, questionId, code, language } = req.body
    console.log(req.body)
    try {
        let test = await tests.findById(testId)
        let question = test.questions.filter((q) => {
            return q._id.toString() === questionId;
        })[0]
        const { funcName, parameterNames, parameterTypes, testCases } = question
        console.log(question)
        try {
            let data = {
                code,
                funcName,
                parameterNames,
                parameterTypes,
                testCases
            }

            let questionReport = await checkAnswerPy({ language, data })
            console.log("questionReport", questionReport)
            res.send(questionReport)

        } catch (generateError) {
            console.log(generateError)
            res.status(400).send({ generateError: generateError.message })
        }

    } catch (findError) {
        res.status(400).send("no such test exists")
    }
})
router.post("/run", async (req, res) => {
    const { code, language, customInput, parameterTypes, funcName } = req.body
    console.log(req.body)

    try {
        let data = {
            code,
            funcName,
            parameterTypes,
            customInput
        }

        let response = await runAnswerPy({ language, data })
        if (response.success === true) {
            res.status(200).send({output: response.output})
        } else {
            throw new Error(res.error)
        }

    } catch (generateError) {
        console.log(generateError)
        res.status(400).send({ generateError: generateError.message })
    }


})

module.exports = router