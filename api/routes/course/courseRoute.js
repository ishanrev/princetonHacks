const router = require('express').Router()
const { ChatOpenAI } = require("@langchain/openai");
const axios = require('axios');
const { getTranscript, generateEmbeddings, createSummary } = require('./summary');
const courses = require('../../models/Course')
const tests = require('../../models/Test');
const users = require('../../models/User');

const runLLMChain = async (prompt) => {
    const model = new ChatOpenAI({
        streaming: false,
        openAIApiKey: process.env.OPENAI_API_KEY,
        temperature: 0,

    });

    const res = await model.invoke(prompt);
    return res.content
};

router.get('/test', (req, res) => {
    console.log('test')
    res.send('this router works for the course route')
})

router.get('/:id', async (req, res) => {
    const courseId = req.params.id;

    console.log('hi')
    try {
        let course = await courses.findById(courseId)
        res.status(200).send({ course })
    } catch (findError) {
        res.status(401).send(findError)
    }
})

router.get('/create', async (req, res) => {
    let { prompt } = req.body
    // I have a main conjunciton object
    let course = { modules: [] }
    let x = 0;

    const basePrompt = `Assume you are an AI that creates course for students who want to learn programming. Based on the user input you need to create a course on that particular topic that covers the essentials. The structure of the course is below in the form of MongoDB schema. The course needs to be made up of atleast 3 modules with each module containing containinga title, three deatiled video topics, two articles topics and three leetcode problem names for the tests section int the module. Give me a JSON file in the form of a single one line string without any new lines like \\n and spaces according to the schema of the course based on the previous description. THE RESPONSE SHOULD BE JSON PARSEABLE SUCH THAT NO ERRORS OCCUR WHEN TRYING TO JSON PARSE THE RESPONSE STRING
    course:{
        title: String,
        modules: [{
                title: String,
                videos: [String],
                articles = [String]
                tests = [String] 
            }]
    }   

    User input: ${prompt}
        
    `
    let baseSchema, baseSchemaJSON
    while (x <= 5) {

        try {
            baseSchema = await runLLMChain(basePrompt)
            baseSchemaJSON = JSON.parse(baseSchema).course
            break;
        } catch (error) {
            x++;
        }
    }

    course.title = baseSchemaJSON.title
    for (let module of baseSchemaJSON.modules) {
        let tempModule = {
            title: "",
            videos: [],
            articles: [],
            test: null
        }
        tempModule.title = module.title
        for (let video of module.videos) {

            const url = "https://www.searchapi.io/api/v1/search";
            const params = {
                "engine": "youtube",
                "q": video,
                "api_key": process.env.SERP_API_KEY
            };
            try {

                let res = await axios.get(url, { params })
                // console.log(res.data);

                const { link, title, description, thumbnail } = res.data.videos[0]
                let newVideo = {
                    url: link,
                    title,
                    description,
                    thumbnail: thumbnail.static
                }
                let transcript = await getTranscript(link)
                let generatedEmbeddings = await generateEmbeddings(transcript)
                let summary = await createSummary("give me a summary of the video")
                newVideo.summary = summary.text
                console.log('------------------', generatedEmbeddings, '------------------')

                const questionString = await runLLMChain(`Based on the video transcript, provided below generate one multiple choice question with three options out of which one of them is correct. The question must be something that tests the user on the core concept of the video and something that helps the user understand the code explained in the video. The question should be in the schema below and Give me a JSON file in the form of a single one line string without any new lines like \\n and spaces according to the schema of the course based on the previous description. THE RESPONSE SHOULD BE JSON PARSEABLE SUCH THAT NO ERRORS OCCUR WHEN TRYING TO JSON PARSE THE RESPONSE STRING
                
                    Transcript: ${transcript}
                    

                    JSON format:
                    {
                        question: String,
                        options: [{
                            text:String,
                            correct:boolean
                        }]
                    }
                `)
                let y = 0;
                let question;
                while (y <= 5) {
                    try {
                        question = JSON.parse(questionString)
                        // console.log(question);
                        newVideo.question = question.question
                        newVideo.options = question.options
                        break;
                    } catch (questionParseError) {
                        y++;

                    }
                }
                tempModule.videos.push(newVideo)
            } catch (videoError) {
                console.log(videoError)
            }




        }

        for (let article of module.articles) {

            const url = "https://www.searchapi.io/api/v1/search";
            const params = {
                "engine": "google",
                "q": `Articles on ${article}`,
                "api_key": process.env.SERP_API_KEY
            };
            try {


                let res = await axios.get(url, { params })
                console.log(res.data);
                let newArticle;
                let articleCounter = 0
                while (articleCounter < 10) {
                    try {

                        const { link, title, snippet } = res.data.organic_results[articleCounter]
                        newArticle = {
                            url: link,
                            title,
                            summary: snippet

                        }
                        let transcriptResponse = await axios.get(link, {
                            headers: {
                                'Accept': 'application/json'
                            }
                        })
                        // let generatedEmbeddings = await generateEmbeddings(transcriptResponse.data)
                        // let summary = await createSummary("From this webpage extract the main article/blog and give me a summary in approximately 100 words")
                        // newArticle.summary = summary
                        console.log('------------------', '------------------')
                        break;
                    } catch (articleError) {
                        articleCounter++;
                    }
                }


                tempModule.articles.push(newArticle)
            } catch (articleError) {
                console.log(articleError)
            }




        }

        let newTest = {
            name: module.title,
            creator: "",
            public: true,
            description: "Sample test description",
            questions: []
        }

        for (let test of module.tests) {
            try {
                let questionCommand = `Based on the following mongodb database schema, create a single custom question from Leetcode called ${test}. The test cases must follow the scehama and create around 10 test cases. I have also provided a sample list of questions to the schema, but you must create a single question as mentioned before and return its JSON data. Give me a JSON file in the form of a single one line string without any new lines like \\n and spaces according to the schema of the course based on the previous description. Note: For the parameterTypes array, the possible parameter types are [Integer, String, Boolean, IntegerArray, StringArray, BooleanArray]. THE RESPONSE SHOULD BE JSON PARSEABLE SUCH THAT NO ERRORS OCCUR WHEN TRYING TO JSON PARSE THE RESPONSE STRING
                Schemas:
                
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
                

                
                Sample array of Questions document on MongoDB:
                
                
                  "questions": [
                    {
                      "questionText": "Given an array of integers nums and an integer target, return an array containing the indices of the two numbers in the array such that they add up to the target. \n You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order. \n Input: nums = [2, 7, 11, 15], target = 9 \n Output: [0, 1] \n Explanation: nums[0] + nums[1] = 2 + 7 = 9, so the answer is [0, 1].",
                      "num": 0,
                      "name": "Two Sum",
                      "parameterNames": [
                        "arr",
                        "target"
                      ],
                      "parameterTypes": [
                        "IntegerArray",
                        "Integer"
                      ],
                      "funcName": "twoSum",
                      "points": 10,
                      "testCases": [
                        {
                          "name": "Test Case 1",
                          "input": [
                            [
                              2,
                              7,
                              11,
                              15
                            ],
                            9
                          ],
                          "output": "[0,1]"
                        },
                        {
                          "name": "Test Case 2",
                          "input": [
                            [
                              3,
                              2,
                              4
                            ],
                            6
                          ],
                          "output": "[1,2]"
                        },
                        {
                          "name": "Test Case 3",
                          "input": [
                            [
                              3,
                              3
                            ],
                            6
                          ],
                          "output": "[0,1]"
                        },
                        {
                          "name": "Test Case 4",
                          "input": [
                            [
                              0,
                              4,
                              3,
                              0
                            ],
                            0
                          ],
                          "output": "[0,3]"
                        },
                        {
                          "name": "Test Case 6",
                          "input": [
                            [
                              2,
                              7,
                              11,
                              15
                            ],
                            18
                          ],
                          "output": "[1,2]"
                        },
                        {
                          "name": "Test Case 8",
                          "input": [
                            [
                              2,
                              4,
                              6,
                              8,
                              10
                            ],
                            14
                          ],
                          "output": "[2,3]"
                        },
                        {
                          "name": "Test Case 9",
                          "input": [
                            [
                              5,
                              10,
                              15,
                              20
                            ],
                            25
                          ],
                          "output": "[1,2]"
                        },
                        {
                          "name": "Test Case 10",
                          "input": [
                            [
                              1,
                              2,
                              3,
                              4,
                              5
                            ],
                            20
                          ],
                          "output": "[]"
                        }
                      ],
                      "_id": {
                        "$oid": "631a3566c991ee779c9a3c29"
                      }
                    },
                    {
                      "questionText": "Given a string s consisting of printable ASCII characters, return the length of the last word in the string. A word is defined as a sequence of non-space characters separated by a space.\n\n It is guaranteed that there is at least one word in s. \n\n A 'word' is defined as a maximal substring consisting of non-space characters only. \n\n Input: 'Hello World'\nOutput: 5\nExplanation: The last word is 'World,' which has a length of 5.",
                      "num": 0,
                      "name": "Length of Last Word",
                      "parameterNames": [
                        "str"
                      ],
                      "parameterTypes": [
                        "String"
                      ],
                      "funcName": "lastWord",
                      "points": 10,
                      "testCases": [
                        {
                          "name": "Test Case 1",
                          "input": "Hello World",
                          "output": 5
                        },
                        {
                          "name": "Test Case 2",
                          "input": "   Hello   World   ",
                          "output": 5
                        },
                        {
                          "name": "Test Case 3",
                          "input": "Length of Last Word",
                          "output": 4
                        },
                        {
                          "name": "Test Case 4",
                          "input": "OpenAI GPT-3.5",
                          "output": 7
                        },
                        {
                          "name": "Test Case 5",
                          "input": "Hello",
                          "output": 5
                        },
                        {
                          "name": "Test Case 6",
                          "input": "     ",
                          "output": 0
                        },
                        {
                          "name": "Test Case 7",
                          "input": "Word",
                          "output": 4
                        },
                        {
                          "name": "Test Case 8",
                          "input": "A",
                          "output": 1
                        },
                        {
                          "name": "Test Case 10",
                          "input": "SpacesBefore Word SpacesAfter  ",
                          "output": 11
                        }
                      ]
                `
                const questionResponse = await runLLMChain(questionCommand)
                const newQuestion = JSON.parse(questionResponse)


                console.log('------------------', '------------------')
                console.log(newTest)
                console.log('------------------', '------------------')



                newTest.questions.push(newQuestion)
            } catch (testError) {
                console.log(testError)
            }
        }
        tempModule.test = newTest


        course.modules.push(tempModule)
    }



    // baseSchema.replace("\"", ")


    //First I create step 1 of the document to create samle template getting the first
    //Now I loop through the videos section and do the and I must extract the main topic similar to how bloom executes it 


    res.status(200).send({ course, baseSchemaJSON })
})

router.post('/deploy', async (req, res) => {
    let { course, userId } = req.body
    let testIds = []
    let newCourse = new courses({
        ...course,

    })
    let moduleNum = 0
    for (let module of course.modules) {
        let { test } = module
        let newTest = new tests({ ...test, creator: userId })
        try {
            await newTest.save()
            newCourse.modules[moduleNum].test = newTest._id.toString()
            testIds.push(newTest._id.toString())
            moduleNum++;
        } catch (saveError) {
            res.status(400).send({ error: saveError })
        }
    }




    try {
        await newCourse.save()
        console.log(newCourse._id.toString())
        let user = await users.findById(userId)

        user.courses[newCourse._id.toString()] = {
            progress: 0
        }

        await user.save()
        res.status(200).send({ testIds })
    } catch (updateError) {
        res.status(400).send({ error: updateError })
    }



})

module.exports = router