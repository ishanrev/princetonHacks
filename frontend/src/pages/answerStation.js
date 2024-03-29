import React, { useContext, useEffect, useState, } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Split from 'react-split'
// import { Modal } from '../components/General/CoolComponents'
  
import AceEditor from 'react-ace'
// Languages
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/mode-python'
import 'ace-builds/src-noconflict/mode-json' 
import 'ace-builds/src-noconflict/mode-java' 
import 'ace-builds/src-noconflict/mode-csharp'
// there are many themes to import, I liked monokai.
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/theme-eclipse'
import 'ace-builds/src-noconflict/theme-terminal'
import 'ace-builds/src-noconflict/theme-solarized_light'
// this is an optional import just improved the interaction.
import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-noconflict/ext-beautify'
import axios from 'axios'
import axiosLink from '../axiosInstance'
import './answerStation.css'
// Ant Design
import { Modal, Button, Steps, Spin, Drawer, Pagination, Progress, } from 'antd';
import { Menu, Dropdown, message, notification } from 'antd';
import { Collapse } from 'antd';
import { LoadingOutlined, MenuOutlined, SaveOutlined } from '@ant-design/icons';

import { toBeEmpty } from '@testing-library/jest-dom/dist/matchers'
import socketClient from "socket.io-client";
import { LoggedInContext, SocketContext, UserContext } from '../contexts'
import SideBar from '../components/General/sidebar'
import SidebarDrawer from '../components/General/sidebarDrawer'
import { relativeTimeRounding } from 'moment'
import Winner from './winner'
const Latex = require('react-latex')
const { Panel } = Collapse;
const { Step } = Steps
const SERVER = "http://localhost:3001";


// function SettingsSelect({ type, data, settings, setSettings }) {
//     const [currentChosen, setCurrentChosen] = useState(settings[type])
//     return (
//         <>
//             <button class="
//                                     relative 
//                                     flex jutify-center items-center 
//                                     bg-white
//                                     text-gray-600 rounded  
//                                     focus:outline-none focus:ring ring-gray-200
//                                     border border-gray-600 shadow group
//                                     h-7 d[10]
//                                 ">
//                 <p class="px-4">{settings[type]}</p>
//                 <span class="border-l p-2 hover:dbg-gray-100">
//                     <svg
//                         class="w-5 h-5"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                         xmlns="http://www.w3.org/2000/svg">
//                         <path
//                             stroke-linecap="round"
//                             stroke-linejoin="round"
//                             stroke-width="2"
//                             d="M19 9l-7 7-7-7"
//                         ></path>
//                     </svg>
//                 </span>
//                 <div class="
//                     absolute top-full
//                     hidden group-focus:block 
//                     min-w-full w-max 
//                     h-28
//                     bg-white 
//                     shadow-md mt-1 rounded  
//                     overflow-y-scroll
//                 ">
//                     <ul class="text-left border rounded ">
//                         {data.map((el, index) => {
//                             return (
//                                 <li key={index} value={el} onClick={(e) => {
//                                     let temp = { ...settings }
//                                     temp[type] = el
//                                     setSettings(temp)
//                                     setCurrentChosen(e.target.value)
//                                 }} class="px-4 py-1  hover:bg-gray-100 border-b">
//                                     {el + ''}
//                                 </li>
//                             )
//                         })}

//                     </ul>
//                 </div>
//             </button>
//         </>
//     )
// }

function StopWatch() {
    const [seconds, setSeconds] = useState(0)
    useEffect(() => {
        setInterval(() => {
            let temp = seconds + 1
            setSeconds(temp)
        }, 1000)
    }, [])
    return (
        <span className="seconds">{seconds}</span>
    )
}

function Settings({ settings, setSettings }) {

    const onClickFontSize = ({ key }) => {
        let temp = { ...settings, fontSize: parseInt(key) }
        setSettings(temp)

    };
    const onClickAutoComplete = ({ key }) => {
        let d = key === 'true' ? true : false
        let temp = { ...settings, autoComplete: d }
        setSettings(temp)

    };
    const onClickTheme = ({ key }) => {
        let temp = { ...settings, theme: key }
        setSettings(temp)

    };
    const fontSize = (

        <Menu onClick={onClickFontSize}>
            <Menu.Item key={10}>10</Menu.Item>
            <Menu.Item key={12}>12</Menu.Item>
            <Menu.Item key={14}>14</Menu.Item>
            <Menu.Item key={16}>16</Menu.Item>
            <Menu.Item key={18}>18</Menu.Item>
        </Menu>

    );
    const theme = (

        <Menu onClick={onClickTheme}>
            <Menu.Item key={'monokai'}>monokai</Menu.Item>
            <Menu.Item key={'eclipse'}>eclipse</Menu.Item>
            <Menu.Item key={'terminal'}>terminal</Menu.Item>
            <Menu.Item key={'solarized_light'}>solarized</Menu.Item>
        </Menu>

    );
    const autoComplete = (

        <Menu onClick={onClickAutoComplete}>
            <Menu.Item key={'true'}>true</Menu.Item>
            <Menu.Item key={'false'}>false</Menu.Item>
        </Menu>

    );
    return (
        <>
            <div className="flex justify-around">

                <div className="titles text-left">

                    <div className="theme flex text-left pb-5 justify-around ">
                        <h6 className="description text-left pt-[6px]">Theme</h6>
                        {/* <SettingsSelect type={'theme'} data={['monokai']} settings={settings} setSettings={setSettings} /> */}
                    </div>
                    <div className="font-size pb-5 text-left flex justify-around">
                        <h6 className="description text-left pt-[10px]">Font Size</h6>
                        {/* <SettingsSelect type={'fontSize'} data={[10, 12, 18, 16, 18]} settings={settings} setSettings={setSettings} /> */}
                    </div>
                    <div className="autoComplete pb-5 text-left flex justify-around">
                        <h6 className="description text-left pt-[15px]">Auto Complete</h6>

                        {/* <SettingsSelect type={'autoComplete'} data={[true, false]} settings={settings} setSettings={setSettings} /> */}

                    </div>
                </div>
                <div className="dropdown text-center">
                    <Dropdown overlay={theme}>
                        <button href='#' className="theme text-black w-30 h-auto 
                        border-2 border-solid border-gray-200 mb-5 p-1 rounded-lg">{settings.theme}</button>
                    </Dropdown>
                    <br />
                    <Dropdown overlay={fontSize}>
                        <button href='#' className="fontSize text-black mt-2 w-30 h-auto 
                        border-2 border-solid border-gray-200 mb-5 p-1 rounded-lg">{settings.fontSize}</button>
                    </Dropdown>
                    <br />
                    <Dropdown overlay={autoComplete}>
                        <button href='#' className="autoComplete text-black mt-3 w-30 h-auto 
                        border-2 border-solid border-gray-200 mb-5 p-1 rounded-lg">{settings.autoComplete + ''}</button>
                    </Dropdown>
                </div>
            </div>
        </>
    )
}

function AnswerStation({ game, tId, gameId, gameObject }) {
    let TOPG = "The Bad Luck Island is inhabited by three kinds of species: r rocks, s scissors and p papers. At some moments of time two random individuals meet (all pairs of individuals can meet equiprobably), and if they belong to different species, then one individual kills the other one: a rock kills scissors, scissors kill paper, and paper kills a rock. Your task is to determine for each species what is the probability that this species will be the only one to inhabit this island after a long enough period of time.\n\n\n-----Input-----\n\nThe single line contains three integers r, s and p $(1 ≤ r, s, p ≤ 100)$ — the original number of individuals in the species of rock, scissors and paper, respectively.\n\n\n-----Output-----\n\nPrint three space-separated real numbers: the probabilities, at which the rocks, the scissors and the paper will be the only surviving species, respectively. The answer will be considered correct if the relative or absolute error of each number doesn't exceed $10^{ - 9}$.\n\n\n-----Examples-----\nInput\n2 2 2\n\nOutput\n0.333333333333 0.333333333333 0.333333333333\n\nInput\n2 1 2\n\nOutput\n0.150000000000 0.300000000000 0.550000000000\n\nInput\n1 1 3\n\nOutput\n0.057142857143 0.657142857143 0.285714285714"
    const { id } = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const pathName = window.location.pathname
    const mode = pathName.substring(1, pathName.indexOf('/', 2))

    const { user, setUser, updateUser } = useContext(UserContext)
    const [testId, setTestId] = useState(id)
    const dummyTest = { "_id": { "$oid": "62221e245456f3e84c5fde5e" }, "questions": [{ "num": { "$numberInt": "2" }, "name": "Product Question", "language": "py", "questionText": "find the productbetween the two inputted numbers", "funcName": "product", "_id": { "$oid": "622222cce821c492ee99e695" }, "testCases": [] }, { "num": { "$numberInt": "4" }, "name": "Product Question", "language": "py", "questionText": "second question", "funcName": "product", "_id": { "$oid": "622227f9da94f2e885c02aa8" }, "testCases": [] }], "name": "new test", "creator": "elon musk", "public": false, "__v": { "$numberInt": "8" } }
    const [settings, setSettings] = useState({ fontSize: 18, theme: 'monokai', language: 'javascript', autoComplete: 'false' })
    const [questions, setQuestions] = useState([{}])
    const [currentQuestion, setCurrentQuestion] = useState({
        num: 0, question: {
            questionText: ''
        }, funcName: 'test'
    })
    const [startCodeEditor, setStartCodeEditor] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const starterCode = `function ${currentQuestion.funcName}(){
    //write your code here
}`
    const [code, setCode] = useState(starterCode)
    const [resultArrived, setResultArrived] = useState('bg-transparent hover:bg-gray-300')
    const [result, setResult] = useState([])
    const [showResult, setShowResult] = useState(false)
    const [testReport, setTestReport] = useState({ questionReports: [], timeTaken: '', userId: '', })
    const socket = useContext(SocketContext)
    const [challengeId, setChallengeId] = useState(searchParams.get('challengeId'))
    const [isRunLoading, setIsRunLoading] = useState(false)
    const loadingIcon = <LoadingOutlined style={{ fontSize: 24, color: 'black' }} spin />;
    const [menuDrawer, setMenuDrawer] = useState(false)
    const [playlists, setPlaylists] = useState([])
    const [showChallengeDrawer, setShowChallengeDrawer] = useState(false)
    const [qCompleted, setQCompleted] = useState()
    const [opponentProgress, setOpponentProgress] = useState({})
    const [myProgress, setMyProgress] = useState({ questionsCompleted: 0, score: 0, time: 0, questionsIndex: [], codes: {} })
    const [showWinnerPage, setShowWinnerPage] = useState(false)
    // const [socket, setSocket] = useState(undefined)
    //socket.io configuration

    // challenfe states
    const [winnerId, setWinnerId] = useState(undefined)
    const [loserId, setLoserId] = useState(undefined)
    const { loggedIn, setLoggedIn } = useContext(LoggedInContext)
    let navigate = useNavigate()
    const [testName, setTestName] = useState('')
    // const [codes, setCodes] = useState({})
    // challenfe states
    useEffect(() => {
        let temp = myProgress.codes
        if (temp !== undefined) {
            if (currentQuestion.num !== undefined) {
                temp[currentQuestion.num.toString()] = code

            }
        }

        console.log('}}}}}')
        console.log(temp)
        setMyProgress({ ...myProgress, codes: temp })
    }, [code])

    const generateCodeStubs = () => {
        let stub = '';
        if (currentQuestion.question.parameterNames === undefined) {
            return ''
        }
        let { funcName, parameterNames, parameterTypes } = currentQuestion.question
        //console.log('bruuuuuuuuuuuuuuuuuuh', currentQuestion.question)
        if (settings.language === 'python') {
            stub = stub + `def ${funcName}(`
            let x = 0;
            for (let pName of parameterNames) {
                if (x < parameterNames.length - 1)
                    stub += pName + ', '
                else
                    stub += pName
                x += 1
            }
            stub = stub + `):
    #write your code here`
        } else if (settings.language === 'javascript') {
            stub = stub + `function ${funcName}(`
            let x = 0;
            for (let pName of parameterNames) {
                if (x < parameterNames.length - 1)
                    stub += pName + ', '
                else
                    stub += pName
                x += 1
            }
            stub = stub + `){
    // Write your code here
}`
        } else if (settings.language === 'java') {
            let returnType

            let sampleOutput = currentQuestion.question.testCases[0].output
            function getJavaDataType(sampleOutput) {

                let dType = ''
                try {
                    let type = typeof (JSON.parse(sampleOutput))
                    if (type === 'number') {
                        dType = 'int'
                    } else if (type === 'boolean') {

                        dType = 'boolean'
                    } else {
                        try {

                            let subType = typeof (JSON.parse(sampleOutput)[0])
                            if (subType === 'number') {
                                dType = 'int[]'
                            } else if (subType === 'boolean') {
                                dType = "boolean[]"
                            } else {
                                dType = "String[]"
                            }
                        } catch (NestedParseError) {
                            dType = 'String[]'
                        }
                    }
                } catch (ParseError) {
                    dType = 'String'
                }
                return dType
            }
            returnType= getJavaDataType(sampleOutput)

            function convertJavaDataType(type){
                if (type === 'String') {
                    return 'String'
                }
                else if (type === 'Integer') {
                    return 'int'
        
                }
                else if (type === 'Boolean') {
                   return 'booelan'
                }
                else if (type === 'StringArray') {
                   return 'String[]'
                }
                else if (type === 'IntegerArray') {
                   return 'int[]'
                }else if (type === 'Boolean') {
                    return 'boolean[]'
                 }
            }

            stub = stub + `public static ${returnType} ${funcName}(`
            let x = 0;
            for (let pName of parameterNames) {
                if (x < parameterNames.length - 1)
                    stub += convertJavaDataType(parameterTypes[x])+' '+pName + ', '
                else
                    stub += convertJavaDataType(parameterTypes[x])+' '+pName
                x += 1
            }
            stub = stub + `){
    // Write your code here
}`
        }
        return stub
    }

    const saveTest = () => {
        let temp = user.testProgress
        if (temp === undefined) {
            temp = {};
        }
        // console.log(myProgress);
        // temp[testId] = myProgress;
        console.log("the save test that i want");

        try {

            let tempTestProgress = user.testProgress !== undefined ? user.testProgress : {}
            console.log(myProgress)
            tempTestProgress[testId] = myProgress
            console.log("before saving")
            console.log(tempTestProgress)
            console.log("maccha work", { testProgress: tempTestProgress })
            updateUser({ testProgress: tempTestProgress })
            message.success("successfully saved your progress ")



            // setUser({...user})
        } catch (updateUserError) {
            console.log(updateUserError, "couldnt update progress")
        }



    }
    useEffect(() => {
        if (loggedIn === undefined) {
            navigate('/home')
        }
        if (mode === 'challenge') {
            socket.on("opponent update", ({ message, update }) => {
                //console.log(message)
                openNotification('warning', message)
                //console.log('898989898989898', update)
                setOpponentProgress(update)
            })
            socket.on("challenge winner", ({ winnerId, loserId }) => {
                //console.log("received the winners and losers")
                //console.log(winnerId, loserId)


                setWinnerId(winnerId)
                setLoserId(loserId)
                setShowWinnerPage(true)

            })
        } else if (game === true) {
            socket.on("show game winner", ({ }) => {

                setShowWinnerPage(true)

            })
        }

        socket.on("challenge winner", ({ winnerId, loserId }) => {
            //console.log("received the winners and losers")
            //console.log(winnerId, loserId)
            if (mode === 'challenge') {

                setWinnerId(winnerId)
                setLoserId(loserId)
                setShowWinnerPage(true)
            } else {
                setShowWinnerPage(true)
            }
        })

        socket.on('connection', () => {
            // //console.log(`I'm connected with the back-end`);
        });
        socket.on("test", () => {
            // //console.log('testSocket Message')
        })

    }, []);

    let btn = ' border-2 border-gray-600 bg-transparent border-solid hover:bg-gray-300 rounded-[4px]'
    async function fetchPlaylists() {
        let temp = []
        for (let playlist of user.saved) {
            //console.log("savedId", playlist)
            try {
                const res = await axios.get(axiosLink + "/test/" + playlist)
                temp.push(res.data)
            } catch (playlistError) {
                //console.log('Playlist Error')
                //console.log(playlistError)
            }
        }
        setPlaylists(temp)
    }
    useEffect(() => {
    }, [])
    useEffect(() => {
        // if (localStorage.getItem('editorSettings') === undefined) {
        //     let tempSettings = {
        //         fontSize: 18, theme: 'monokai', language: 'python', autoComplete: 'false'
        //     }
        //     localStorage.setItem('editorSettings', JSON.stringify(tempSettings))
        //     setSettings(tempSettings)
        // } else {
        //     setSettings(JSON.parse(localStorage.getItem('editorSettings')))
        // }
        let temp = localStorage.getItem('1234')

        setCode(temp)

    }, [])
    useEffect(() => {
        setTimeout(() => setStartCodeEditor(true), 1)
    }, [])

    useEffect(() => {

    }, [])
    useEffect(() => {
        async function fetchData() {
            try {
                let variableTestId = game === true ? tId : testId
                let test = await (await axios.get(axiosLink + `/test/${variableTestId}`)).data
                setTestName(test.name)
                console.log('>>>>>>>>>')
                console.log(test)
                console.log('>>>>>>>>>')
                //getting test information
                // if (user.testProgress[test._id.toString()] === undefined) {
                //     console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<")
                //     saveTest()
                // }
                if (mode === 'practice') {
                    console.log('<<<<<<<<')
                    if (user !== undefined) {
                        console.log('entered')
                        let tempCurrent
                        try {
                            tempCurrent = user.testProgress[test._id]

                        } catch (SomeError) {

                        }
                        console.log('>>>>>>>>>')
                        console.log('[][][][][][][]')
                        console.log('>>>>>>>>>')
                        console.log(tempCurrent)
                        if (tempCurrent !== undefined) {
                            //console.log(user.testProgress)
                            let last = false
                            setMyProgress(tempCurrent)
                            let latestQuestionIndex = 0;
                            for (let x = 0; x < test.questions.length; x++) {
                                if (tempCurrent.questionsIndex.includes(x) === false) {
                                    latestQuestionIndex = x;
                                    if (x === test.questions.length - 1) {
                                        last = true
                                    }
                                    break;
                                }
                            }
                            if (last === true) {
                                latestQuestionIndex = test.questions.length - 1;
                            }
                            console.log("animals", latestQuestionIndex)
                            let savedCode
                            // if (tempCurrent.codes === undefined) {
                            //     console.log("goind to giv e blank page here")
                            //     tempCurrent.codes = {}
                            //     savedCode = 
                            // }
                            if (tempCurrent.codes !== undefined) {
                                console.log('pls save me')
                                savedCode = tempCurrent.codes[latestQuestionIndex.toString()]
                                console.log(savedCode)
                                setCode((saveCode !== undefined) ? savedCode : '')
                            }
                            setCurrentQuestion({
                                question: test.questions[latestQuestionIndex],
                                num: latestQuestionIndex
                            })
                            setCode(generateCodeStubs())

                        } else {
                            console.log(';;;;;;;;')
                            setCurrentQuestion({
                                num: 0,
                                question: test.questions[0]
                            })
                            setCode(generateCodeStubs())
                        }
                    }
                }
                setTestId(test._id)
                try {
                    let tempId = user._id.toString();
                    let { updated } = (await (axios.put(axiosLink + `/user/${tempId}`, { lastTest: test._id.toString() }))).data;
                    setUser(updated)

                    //console.log("successfully updated the lastTest")
                } catch (userUpdateError) {
                    //console.log(userUpdateError)
                }

                let t = test.questions
                let temp = [...t]
                setQuestions(temp)

                fetchPlaylists()

                //console.log('currentQuestion', currentQuestion)

            } catch (fetchError) {
                //console.log('fetchError ' + fetchError)
            }
        }
        fetchData()

    }, [])

    //     useEffect(() => {
    //         setCode(`
    // function ${currentQuestion.question.funcName}(){
    //     //write your code here
    // }`)
    //     }, [currentQuestion])
    useEffect(() => {
        setCode(generateCodeStubs())
    }, [settings, currentQuestion])



    const saveCode = () => {
        localStorage.setItem("1234", code)
    }

    const run = async () => {
        try {
            setIsRunLoading(true)

            const languageAbbreviations = { "python": 'py', "javascript": 'js' }
            let data = {
                testId,
                questionId: currentQuestion.question._id,
                code,
                language: languageAbbreviations[settings.language] !== undefined ? languageAbbreviations[settings.language] : settings.language
            }
            // //console.log(data)
            let report = await (await axios.post(axiosLink + '/question/check', data)).data.report
            setIsRunLoading(false)
            setResult(report)
            setResultArrived(' bg-yellow-200 ')
            // testReport[currentQuestion.num] = report
            let arr = testReport.questionReports;
            arr[currentQuestion.num] = report
            let tempTestReport = { ...testReport, questionReports: arr }
            setTestReport(tempTestReport)
            let passed = false
            for (let tc of report) {
                let { correct } = tc

                if (correct === true) {
                    passed = true
                } else if (correct === false) {
                    passed = false;
                    break;
                }
            }

            //chart progress update
            if (passed === true) {
                let tempDailyUpdate = user.dailyProgress;
                if (tempDailyUpdate !== undefined) {
                    //console.log("going to updat chart")
                    tempDailyUpdate[tempDailyUpdate.length - 1].numQuestionsCompleted += 1;
                    tempDailyUpdate[tempDailyUpdate.length - 1].pointsCollected += currentQuestion.question.points;
                    updateUser({ dailyProgress: tempDailyUpdate })
                }
                //console.log("tempDailyUpdate", tempDailyUpdate)
                //console.log("dailyProgress", user.dailyProgress)
                let tempDaysActive = user.daysActive
                let today = new Date()
                let day = today.getDate()
                let month = today.getMonth()
                let year = today.getFullYear()
                let dateStr = `${day}-${month}-${year}`
                console.log(tempDaysActive)
                console.log(dateStr)
                // For main code please fix this section
                // if (tempDaysActive !==undefined && tempDaysActive.includes(dateStr) === false) {
                //     tempDaysActive.push(dateStr)
                //     updateUser({ daysActive: tempDaysActive, dailyProgress: tempDailyUpdate })
                // }


                // setUser({ ...user, dailyProgress: tempDailyUpdate, daysActive: tempDaysActive })
            }


            if (mode === 'challenge') {

                if (passed === true && myProgress.questionsIndex.includes(currentQuestion.num) === false) {
                    myProgress.questionsCompleted += 1;
                    //console.log(questions[currentQuestion.num].points)
                    myProgress.score += questions[currentQuestion.num].points
                    myProgress.questionsIndex.push(currentQuestion.num)
                }
            }


            if (mode === 'challenge' && passed === true) {
                socket.emit("opponent update", {
                    challengeId,
                    message: 'opponent has just complete a question hurry',
                    update: myProgress
                })
            }
            if (game === true && passed === true) {
                // socket.emit("game progress", { gameId, testReport: tempTestReport, participantId: user._id })
                if (myProgress.questionsIndex.includes(currentQuestion.num) === false) {
                    //console.log("sendig")
                    socket.emit("update score", { gameId: gameObject.id, increment: currentQuestion.question.points, playerId: user._id.toString() })
                }
            }

            if (mode !== 'challenge') {

                if (passed === true && myProgress.questionsIndex.includes(currentQuestion.num) === false) {
                    myProgress.questionsCompleted += 1;
                    //console.log(questions[currentQuestion.num].points)
                    myProgress.score += questions[currentQuestion.num].points
                    myProgress.questionsIndex.push(currentQuestion.num)
                }
            }

            //console.log(report)
        } catch (runError) {
            //console.log(runError.message.data)
        }
    }
    const runCustom = () => {
        //console.log('runCustombaby')
    }
    const runMenu = (
        <Menu>
            <Menu.Item><button onClick={runCustom} >Custom Input?</button> </Menu.Item>
            <Menu.Item><button onClick={run}>Test Cases?</button></Menu.Item>
        </Menu>
    );
    const resultSection = (

        <div className="resultSection p-10 border-2 border-gray-500 m-3 ">
            {result.map((res, index) => {
                return (
                    <div className="resultTestCase" key={index}> {res}
                        <br />
                    </div>
                )
            })}

        </div>

    )
    function endTest() {
        // let temp = { ...testReport, userId: "ishan", timeTaken: '10 minutes lol' }
        // setTestReport(temp)
        // //console.log(testReport)
        if (mode === 'challenge' && myProgress.questionsCompleted === questions.length) {
            //console.log("going to get the winner thingy")
            socket.emit("end challenge", { challengeId, fromId: user._id.toString() })
        }
    }

    const openNotification = (type, message) => {
        notification[type]({
            message: 'Notification Title',
            description: message
        });
    }
    const saveQuestionMenu = (
        <Menu>
            {playlists.map((playlist, index) => {
                //console.log("playlist", playlist)
                if (playlist !== undefined) {

                    return (

                        <Menu.Item key={index} onClick={() => [
                            saveQuestionToPlaylist(currentQuestion.question, playlist._id.toString(), index, playlist.name)
                        ]}>
                            {playlist.name}
                        </Menu.Item>
                    )
                } else {
                    return (
                        undefined
                    )
                }
            })}
        </Menu>
    )

    const saveQuestionToPlaylist = async (newQuestion, playlistId, index, playlistName) => {
        //console.log(playlists)
        if (playlists[index].questions.includes(newQuestion) === false) {

            try {
                let body = {
                    questions: [...playlists[index].questions, newQuestion]
                }
                const res = await axios.put(axiosLink + "/test/" + playlistId, body)
                let temp = [...playlists]
                temp[index] = res.data.test
                setPlaylists(temp)
                message.success("successfully added this question to the custom playlist " + playlistName)
            } catch (createTestError) {
                //console.log(createTestError.message.data)
            }
        } else {
            //console.log('already saved in the test')
        }
    }
    const latex = (string) => {
        if (string === undefined) {
            return ''
        }
        string = string.replace('```', '`')
        string = string.replace('`', '$')
        // string = string.replace()
        // console.log(string)
        return string;
    }

    return (
        <div className="answerStation h-[100%]">
            {/* <Settings settings={settings} setSettings={setSettings} className={showModal === true ? 'fixed' : 'hidden'} /> */}

            <div className="center ">
                {/* {showModal===true?undefined :undefined} */}
                <Split
                    sizes={[40, 60]}
                    minSize={[500, 500]}
                    expandToMin={false}
                    gutterSize={10}
                    gutterAlign="center"
                    snapOffset={30}
                    dragInterval={1}
                    direction="horizontal"
                    cursor="col-resize"
                    className='split'
                    style={{ 'display': 'flex', 'flex-direction': 'row' }}
                >
                    <div className={"centerLeft bg-[#f9f9f9] h-[100vh] overflow-y-scroll"}>

                        <div className="leftHeader h-[10%] p-4 flex justify-around">
                            <SidebarDrawer dark />
                            <span className='pt-2'>{testName}</span>
                            <div className={'' + ''}>
                                {mode === 'challenge' ?
                                    <button onClick={() => { let temp = !showChallengeDrawer; setShowChallengeDrawer(temp) }} className={' border-2 px-2 rounded-md border-slate-400' +
                                        (() => { return showChallengeDrawer === true ? ' bg-slate-400 text-gray-200' : '' })()}
                                    >Challenge</button> : game === true ?
                                        <button onClick={() => { let temp = !showChallengeDrawer; setShowChallengeDrawer(temp) }} className={' border-2 px-2 rounded-md border-slate-400' +
                                            (() => { return showChallengeDrawer === true ? ' bg-slate-400 text-gray-200' : '' })()}
                                        >Leaderboard</button>
                                        : undefined}
                            </div>
                            {/* <StopWatch /> */}
                            <Dropdown overlay={saveQuestionMenu}>
                                <div className="saveQuestion w-4 h-4 mt-1">
                                    <SaveOutlined style={{ color: 'gray', fontSize: '1.3rem' }} />
                                </div>
                            </Dropdown>
                        </div>
                        <div className={`questionArea centerLeft h-[80%]  rounded-md overflow-y-scroll 
                         ml-4 mr-2 p-4 site-drawer-render-in-current-wrapper  ` + (() => { return showWinnerPage === false ? ' bg-[#fff]' : ' bg-base' })()}>
                            <div className=''>


                                {showWinnerPage === true ?
                                    <div className='items-center p-[5%]'>
                                        {mode === 'challenge' ? <Winner mode='challenge' winners={[winnerId, loserId]} />
                                            : <Winner mode='game' game={gameObject} />}
                                    </div> : showChallengeDrawer === false ?
                                        <div className="questionTitle h-[75vh] overflow-y-scroll" style={{ whiteSpace: "pre-line" }} >
                                            <div className=' mb-2  text-xl'>{currentQuestion.question.name}</div>
                                            <div className=' bg-slate-400 w-full h-[2px] mb-2'></div>
                                            {/* <div lang = "latex">{currentQuestion.question.questionText}</div> */}
                                            <Latex >{latex(currentQuestion.question.questionText)}</Latex>
                                            {/* <img src={"https://latex.codecogs.com/png.image?" + currentQuestion.question.questionText.replace(" ",' \; ').substring(0,100)} alt = "question text sa supposed to be here"/> */}

                                        </div>
                                        :
                                        mode === 'challenge' ? <ChallengeProgress opponentProgress={opponentProgress} myProgress={myProgress} numQuestions={questions.length} /> :
                                            game === true ?
                                                <div className="h-[75vh] overflow-y-scroll">
                                                    <GameProgress game={gameObject} />

                                                </div>
                                                :
                                                <div className="questionTitle">
                                                    <div className=' pt-6 border-b-2 border-b-slate-400 text-xl'>{currentQuestion.question.name}</div>
                                                    {currentQuestion.question.questionText}

                                                </div>}
                            </div>


                        </div>
                        <div className="lowerCenterLeft text-sm h-[10%] bg-[#f9f9f9] top-[2px]  flex justify-center items-center">
                            <div className="navigate flex justify-between items-center pt-3 pr-4">

                                <button className={"previous mx-2 py-1 px-3 border-2 border-gray-600 bg-transparent border-solid hover:bg-gray-300 rounded-[4px]" + btn}
                                    onClick={() => {
                                        let cNum = currentQuestion.num
                                        if (cNum > 0) {
                                            setCurrentQuestion({ num: cNum - 1, question: questions[cNum - 1] })
                                        }
                                    }}
                                >
                                    Previous <i className="fa-solid fa-arrow-left"></i>
                                </button>

                                <div className="progress bg-primary- rounded-lg px-1 ">
                                    <Steps current={currentQuestion.num} onChange={(current) => {
                                        setCurrentQuestion({ num: current, question: questions[current] })
                                    }} >
                                        {questions.map((q, index) => {
                                            return <Step key={index} />
                                        })}
                                    </Steps>
                                </div>
                                <button
                                    className={"next mx-2 py-1 px-3 border-2 border-gray-600 bg-transparent border-solid hover:bg-gray-300 rounded-[4px]" + btn}
                                    onClick={() => {
                                        let cNum = currentQuestion.num
                                        if (cNum < questions.length - 1) {
                                            setCurrentQuestion({ num: cNum + 1, question: questions[cNum + 1] })
                                        }
                                    }}
                                >
                                    Next
                                </button>
                            </div>
                            {/* <Pagination defaultCurrent={1} onChange={(page) => {
                                page = page - 1
                                let temp = { num: page, question: questions[page] }
                                setCurrentQuestion(temp)
                            }} total={questions.length*10} /> */}
                        </div>
                    </div>


                    <div className="centerRight bg-[#f9f9f9]">
                        <div className="rightHeader flex justify-between py-3 mx-4 text-sm">
                            <div className="languageSelect d10">
                                {/* <!-- Light mode --> */}
                                <button className="
                                    relative 
                                    flex jutify-center items-center 
                                    bg-white
                                    text-gray-600 rounded 
                                    focus:outline-none focus:ring ring-gray-200
                                    border border-gray-600 shadow group 
                                    h-7
                                    
                                ">
                                    {/* <p className="p-4 mt-3">{(() => { return settings === undefined ? "undefined thingy" : settings.language })()}</p> */}
                                    <p className="p-4 mt-3">{settings.language}</p>
                                    <span className="border-l px-2 hover:dbg-gray-100 ">
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                strokeLinecap="round"
                                                strokeWidth="2"
                                                d="M19 9l-7 7-7-7"
                                            ></path>
                                        </svg>
                                    </span>
                                    <div className="
                                        absolute top-full
                                        hidden group-focus:block 
                                        min-w-full w-max 
                                        bg-white 
                                        shadow-md mt-1 rounded z-10
                                    ">
                                        <ul className="text-left  border rounded ">
                                            <li key={1} value={'javascript'} onClick={(e) => setSettings({ ...settings, language: 'javascript' })} className="px-4 py-1 hover:bg-gray-100 border-b">
                                                javascript
                                            </li>
                                            <li value={'python'} onClick={(e) => setSettings({ ...settings, language: 'python' })} className="px-4 py-1 hover:bg-gray-100 border-b">
                                                python
                                            </li>
                                            {/* <li value={'C++'} onClick={(e) => setSettings({ ...settings, language: 'cpp' })} className="px-4 py-1 hover:bg-gray-100 border-b">
                                                C++
                                            </li>
                                            <li value={'csharp'} onClick={(e) => setSettings({ ...settings, language: 'C#' })} className="px-4 py-1 hover:bg-gray-100 border-b">
                                                C#
                                            </li> */}
                                            <li value={'java'} onClick={(e) => setSettings({ ...settings, language: 'java' })} className="px-4 py-1 hover:bg-gray-100">
                                                java
                                            </li>
                                        </ul>
                                    </div>
                                </button>
                            </div>

                            <div className=" text-sm">
                                <button onClick={() => setShowModal(true)} className={"settingsIcon mx-2  py-1 px-2" + btn}>Settings</button>
                                <Modal className='SettingsModal ' title="Basic Modal" zIndex={1000}
                                    centered visible={showModal} onOk={() => setShowModal(false)} onCancel={() => setShowModal(false)}>
                                    <Settings settings={settings} setSettings={setSettings} />
                                </Modal>
                                <button className={"reset mx-2  py-1 px-2" + btn}> Reset</button>
                                <button className={"reset mx-2 mr-4 py-1 px-2" + btn} onClick={saveTest}> Save</button>
                            </div>
                        </div>
                        {startCodeEditor === true ?
                            <div className="">


                                <AceEditor
                                    style={{
                                        height: (showResult ? '43vh' : '83vh'),
                                        width: ''
                                    }}
                                    placeholder='Start Coding'
                                    mode={settings.language}
                                    theme={settings.theme}
                                    name='basic-code-editor'
                                    onChange={currentCode => setCode(currentCode)}
                                    fontSize={settings.fontSize}
                                    showPrintMargin={false}
                                    showGutter={true}
                                    highlightActiveLine={true}
                                    value={code}
                                    className='rounded-md ml-2 mr-4 '
                                    setOptions={{
                                        enableBasicAutocompletion: settings.autoComplete,
                                        enableLiveAutocompletion: settings.autoComplete,
                                        enableSnippets: true,
                                        showLineNumbers: true,
                                        tabSize: 4,
                                    }}
                                />
                                {showResult ?
                                    <div className="resultSection h-[37.5vh] p-5 bg-white rounded-lg mt-4 ml-2 mr-4 overflow-scroll" style={{ whiteSpace: "pre-line" }}>
                                        Result  <br />
                                        {result.length > 0 ?
                                            <Collapse defaultActiveKey={['1']} onChange={(key) => { }} >
                                                {result.map((res, index) => {
                                                    let header = <span className="">Test Case {index + 1} {' '}
                                                        <span className={res.correct ? 'text-green-600' : 'text-red-600'}>{(res.correct ? 'Passed' : 'Failed')}
                                                        </span>  </span>
                                                    return (
                                                        <Panel header={header} key={index} >
                                                            <div className="info">
                                                                Your Output
                                                                <div className="yourOutput overflow-x-scroll h-24 p-3 border-2 border-gray-200 m-3 rounded-md" >
                                                                    {res.yourOutput}
                                                                </div>
                                                                Required Output
                                                                <div className="requiredOutput overflow-x-scroll h-24 p-3 border-2 border-gray-200 m-3 rounded-md">
                                                                    {res.reqOutput}
                                                                </div>
                                                            </div>
                                                        </Panel>
                                                    )
                                                })}
                                            </Collapse>
                                            : <span>No results</span>}

                                    </div>
                                    : undefined}
                            </div> : undefined
                        }
                        <div className="checks lowerBarRight text-sm pt-3 pr-4 flex justify-end bg-[#f9f9f9] ">
                            {/* <Dropdown overlay={resultSection} placement='top' arrow > */}
                            {/* onClick={(e) => {setResultArrived('bg-transparent hover:bg-gray-300 '); e.preventDefault()}} */}
                            <button className={"result mx-2 py-1 px-3 border-2 border-gray-600  border-solid  rounded-[4px] " + resultArrived}
                                onClick={() => { setShowResult(showResult ? false : true); setResultArrived('') }} >
                                Result
                            </button>
                            {/* </Dropdown> */}
                            <button className={"submit mx-2 py-1 px-3 " + btn}>
                                Submit
                            </button>
                            <Dropdown overlay={runMenu} placement='topRight' arrow>
                                <span className={isRunLoading ? 'my-1' : undefined}>
                                    <Spin spinning={isRunLoading} >
                                        <button className="run border-2 border-dark-500 border-solid  bg-dark-500 hover:bg-primary-main text-white rounded-[4px] mx-2 py-1 px-3">
                                            Run Code

                                        </button>
                                    </Spin>
                                </span>
                            </Dropdown>
                            {currentQuestion.num === questions.length - 1 ?
                                <button className={"EndTest mx-2 py-1 px-3 " + btn} onClick={endTest}>
                                    End Test
                                </button>
                                : undefined}
                        </div>
                    </div>

                    {/* <div className="w-full h-[200px] bg-red-300"></div> */}
                    {/* <div className="w-full h-[200px] bg-red-700"></div> */}

                </Split>

            </div >

            {/* <div className="lowerBar h-[8vh] text-sm px-4 pt-2 bg-[#f9f9f9] flex justify-between">
            </div> */}

        </div >

    )
}
function ProgressTracker({ num, status }) {
    return (
        <div className="progressTracker">

        </div>
    )
}

const ChallengeProgress = ({ opponentProgress, myProgress, numQuestions }) => {
    function calculatePercent(num) {
        let percent;
        percent = Math.round(num * 100 / numQuestions)
        //console.log("percent = ", percent)
        return percent
    }
    return (
        // flex justify-cente rgrid lg:grid-cols-2 md:grid-cols-1
        <div className="ChallengeProgress h-full flex justify-center  ">
            <div className="challengeProgressWrapper flex justify- justify-center gap-16 pt-12">
                <div className="myProgress  w-full text-center">
                    <span className='block text-lg '>My Progress</span>
                    <br />
                    <Progress width={200} strokeColor={'#9483ba'} type='circle' percent={(() => { return calculatePercent(myProgress.questionsCompleted) })()} ></Progress>
                    <br /><br />
                    <span className='block '>Questions Completed: {myProgress.questionsCompleted}</span>
                    <span className='block '>Points: {myProgress.points}</span>

                </div>
                <div className="opponentsProgre  w-full text-center">
                    <span className='block text-lg '>Opponents's Progress</span>
                    <br />
                    <Progress width={200} strokeColor={'#9483ba'} type='circle' percent={(() => { return calculatePercent(opponentProgress.questionsCompleted) })()} ></Progress>
                    <br /><br />
                    <span className='block '>Questions Completed: {opponentProgress.questionsCompleted}</span>
                    <span className='block '>Points: {opponentProgress.points}</span>

                </div>
            </div>
        </div>
    )
}

const GameProgress = ({ game }) => {
    const { user } = useContext(UserContext)
    const { participants, participantNames, scores, host } = game;
    return (
        <div className="">
            <span className="block text-3xl">Leaderboard</span>
            <ul className='p-2 overflow-y-scroll'>
                {participants.map((par, index) => {

                    {/* let colour = par !== user._id.toString() ? ' border-dark-500' : " border-primary-500 "; */ }
                    {/* let colour2 = par !== user._id.toString() ? ' border-l-dark-500' : " border-l-primary-500"; */ }

                    let colour = par !== user._id.toString() ? ' border-dark-500' : " bg-dark-500 text-white border-dark-500";
                    let colour2 = par !== user._id.toString() ? ' border-l-dark-500' : " border-l-white";
                    return (
                        <>

                            <li key={index} className={'px-2 py-3 my-2 border-2  rounded-lg text-xl overflow-x-hidden' + colour}>
                                <div className="flex justify-between">
                                    <span className='pl-4'>{participantNames[index]}</span>
                                    {/* <div className=''> */}
                                    <div className={'border-l-2  flex justify-center w-1/5' + colour2}><span>{scores[par]}</span></div>

                                    {/* </div> */}
                                </div>

                            </li>
                            {index === 2 ?
                                <>
                                    <div className='w-full bg-slate-300 h-[0.3rem] rounded-lg my-4'></div>
                                </>
                                : undefined}
                        </>
                    )
                })}

            </ul>
        </div >
    )
}
export default AnswerStation