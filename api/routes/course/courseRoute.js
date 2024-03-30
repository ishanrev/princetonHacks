const router = require('express').Router()
const courses = require('../../models/Course')
const { ChatOpenAI } = require("@langchain/openai");
const axios = require('axios');
const { getTranscript, generateEmbeddings, createSummary } = require('./summary');

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
            tests: []
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
                newVideo.summary = summary
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
                            summary:snippet

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


        course.modules.push(tempModule)
    }



    // baseSchema.replace("\"", ")


    //First I create step 1 of the document to create samle template getting the first
    //Now I loop through the videos section and do the and I must extract the main topic similar to how bloom executes it 


    res.status(200).send({ course })
})

router.post('/deploy', (req, res) => {
    let { course, modules } = req.body
    let courseObject = {
        name: course.name
    }

    try {
        for (let module of modules) {

        }

    } catch (parsingError) {
        console.log(parsingError);
        res.status(400).send({ error: parsingError })
    }
    res.send('this router works for the course route')
})

module.exports = router