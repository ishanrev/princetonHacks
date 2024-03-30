import React, { useContext, useEffect, useState } from 'react'
import { UserOutlined, EditOutlined, EllipsisOutlined, SettingOutlined, SearchOutlined } from '@ant-design/icons';
import { Menu, Dropdown, Modal, message, Switch, Empty, Progress, Grid } from 'antd';
import AnswerStation from './answerStation';
import { Link, useNavigate } from 'react-router-dom'
import { UserContext, SocketContext, LoggedInContext } from '../contexts';
import SidebarDrawer from '../components/General/sidebarDrawer';
import axios from 'axios';
import axiosLink from '../axiosInstance';
import ChalengeFriendDrawer from '../components/General/chalengeFriendDrawer';
import { Image } from 'cloudinary-react'


// import { SocketContext } from '../socket';

// import { Link } from 'react-router-dom'
const CourseCard = ({ courseId, starts = '', small = true, challengeMode = false, canChange = false }) => {
    // //console.log(starts)
    let navigate = useNavigate()
    const [test, setTest] = useState({ questions: [], name: '', creator: '', description: '' })
    const [course, setCourse] = useState({})

    const [showPracticeModal, setShowPracticeModal] = useState(false)
    const [showPlayModal, setShowPlayModal] = useState(false)
    const [challengeTo, setChallengeTo] = useState(null)
    const [search, setSearch] = useState('')
    const [check, setCheck] = useState(starts)
    // let questions = [{name: 'firsteeeeeeeeeeeeee'},{name: 'second'},{name: 'third'}]
    const socket = useContext(SocketContext)
    const { user, setUser } = useContext(UserContext)
    const [showFriendsDrawer, setShowFriendsDrawer] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [newDetails, setNewDetails] = useState({})
    const [courseFound, setCourseFound] = useState(false)
    const { loggedIn, setLoggedIn } = useContext(LoggedInContext)


    const ALT_IMAGE = 'https://res.cloudinary.com/dhlxchjon/image/upload/v1659113931/no-image-small_w0xpnx.png'
    useEffect(() => {
        console.log(courseId, "iwofhewufnudfnhspiuhf")
        if (loggedIn === undefined) {
            navigate('/home')
        }
        async function fetchTest() {
            try {


                let { data: testRes } = await axios.get(axiosLink + '/course/' + courseId)

                // if (testRes.creator === undefined) {
                //     testRes.creator = ''
                // }
                // if (testRes === undefined || testRes === null) {
                //     setCourseFound(false)
                // }
                // let bool = testRes.name.startsWith(starts) ? true : false
                // if (starts === '') { bool = true }
                // // //console.log(bool)
                // setCheck(bool)
                setCourse(testRes.course)
                setCourseFound(true)

            } catch (fetchTestError) {
                // //console.log('fetchTestError', fetchTestError)
                setCourseFound(false)
            }
        }
        fetchTest()

    }, [])

    // useEffect(() => {
    //     let bool = test.name.startsWith(starts) ? true : false
    //     if (starts === '') { bool = true }
    //     // //console.log(bool)
    //     setCheck(bool)
    // }, [starts])

    const questionsList = (
        <Menu>
            <div className="list pointer-events-none">
                {test.questions.map((q, index) => {
                    return (
                        <Menu.Item key={index}>
                            <span key={index}>{q.name}</span>
                        </Menu.Item>
                    )
                })}
            </div>
        </Menu>
    )
    const challenge = () => {
        if (socket !== undefined) {
            socket.emit("challenge", { fromId: user._id, toId: challengeTo })
        }
    }
    const handleOk = async () => {
        // try {
        //     let newTest = (await axios.put(axiosLink + '/test/' + testId, newDetails)).data.test
        //     setTest({ ...test, ...newDetails })
        // } catch (updateTestError) {
        //     //console.log(updateTestError)
        // }
        // setShowEditModal(false)
    }
    const handleCancel = () => {
        setShowEditModal(false)
    }
    // const deletePersonalTest = async () => {
    //     let tempSaved = user.saved.filter((tId, index) => {
    //         return testId !== tId
    //     })
    //     setUser({ ...user, saved: tempSaved })
    //     try {
    //         let res = (await axios.get(axiosLink + '/test/' + testId)).data
    //         //console.log(res)
    //     } catch (updateTestError) {
    //         //console.log(updateTestError)
    //     }
    //     try {
    //         await axios.put(axiosLink + '/user/' + user._id.toString(), { saved: tempSaved })
    //         message.success('successfully deleted a personal playlist', 3)
    //     } catch (updateError) {
    //         //console.log(updateError)
    //         message.error('couldn\'t delete a personal playlist', 3)
    //     }
    //     setCourseFound(false)
    //     setShowEditModal(false)
    // }

    // const hostGame = () => {
    //     //console.log('fromId', user._id)
    //     socket.emit("host game request", { fromId: user._id, testId })
    // }
    const moduleList = () => {
        return (
            <>
                <Menu>
                    <div className="list pointer-events-none">
                        {course.modules.map((module, index) => {
                            return (
                                <Menu.Item key={index}>
                                    <span key={index}>{module.title}</span>
                                    <Menu>

                                        {
                                            module.videos.map((video, videoIndex) => {
                                                return (
                                                    <Menu.Item key={videoIndex}>
                                                        <span key={videoIndex}>{video.title}</span>
                                                        <span key={videoIndex}>{video.summary}</span>

                                                    </Menu.Item>
                                                )
                                            })
                                        }
                                        {
                                            module.articles.map((video, videoIndex) => {
                                                return (
                                                    <Menu.Item key={videoIndex}>
                                                        <span key={videoIndex}>{video.title}</span>
                                                        <span key={videoIndex}>{video.summary}</span>

                                                    </Menu.Item>
                                                )
                                            })
                                        }
                                        <Menu.Item key={index}>
                                            <span key={index}>{module.test}</span>

                                        </Menu.Item>

                                    </Menu>
                                </Menu.Item>
                            )
                        })}
                    </div>
                </Menu>
            </>
        )
    }
    return (
        <> {courseFound === true ? <div>
            <br /><br /><br />
            {true ?
                <div className={`CourseCard  rounded-lg bg-white shadow-lg hover:cursor-pointer 
                hover:shadow-2xl overflow-hidden w-full `}
                    onClick={() => { }}
                >

                    <div className={"content  p-3 overflow-y-scroll" + (() => { return small === true ? ' h-[70%]' : ' h-[27.5%]' })()}>
                        <span className='text-xl'>{course.title}</span>
                        <br />
                        <p className="description pt-1 ">"Lorem ipsum dolor sit amet,
                            consectetur adipiscing elit, sed do eiusmod tempor sed do eiusmod tempor  "</p>
                        <br />
                        <div className="  ">
                            <span className='  '>
                                {user.courses !== undefined && user.courses[courseId] !== undefined && small === true ?
                                    <Progress size={10} percent={
                                        (() => {
                                            // let p;
                                            // if (user.testProgress[testId].questionsCompleted !== undefined) {

                                            //     p = ((user.testProgress[testId].questionsCompleted) / (test.questions.length)) * 100
                                            // }
                                            // console.log(p)
                                            return 30
                                        })()

                                        // style={{ width: '10%' }}
                                    } showInfo={false} strokeColor="#525E7580" />
                                    : <></>}
                            </span>
                            {/* <span className="questionNumber ml-5 bg-primary-300 rounded-lg pt-[2px] px-2 hover:shadow-md  max-h-7">{test.questions.length}</span> */}
                            {/* <Dropdown overlay={moduleList}>
                                    <span className=" bg-primary-300 rounded-lg Preview pt-[2px] px-2 hover:shadow-md max-h-7"
                                    >Preview</span>
                                </Dropdown> */}

                        </div>
                        <br />
                        <button onClick={() => { navigate('/course/' + courseId) }} className="practice px-2 h-9 py-1 w-full bg-dark-500 text-white rounded-md">Go to Course</button>



                        {/* <button className="previewQuestions p-2">Preview Questions</button> */}

                    </div>

                </div>
                : undefined}
        </div>
            : undefined}
        </>
    )
}
function NoTestsFound() {
    return (
        <div className="noTestsFound h-[400px] pt-24">
            <Empty />
        </div>
    )
}

function CoursePage() {
    const [search, setSearch] = useState('')

    // const [tests, setTests] = useState(['624044d2bf2ff26c3a0e123f', '624044d2bf2ff26c3a0e123f',
    //     '624044d2bf2ff26c3a0e123f', '624044d2bf2ff26c3a0e123f', '624044d2bf2ff26c3a0e123f',
    //     '624044d2bf2ff26c3a0e123f', '624044d2bf2ff26c3a0e123f', '624044d2bf2ff26c3a0e123f',
    //     '624044d2bf2ff26c3a0e123f'])
    const [tests, setTests] = useState(['624044d2bf2ff26c3a0e123f', '62f68a68a1f94db6d5530219'])
    const { user, setUser } = useContext(UserContext)
    const { loggedIn, setLoggedIn } = useContext(LoggedInContext)
    let navigate = useNavigate()
    // //console.log(search)

    // const getTests = async () => {
    //     try {
    //         let body = {
    //             filter: search.split(' ')
    //         }
    //         //console.log(body)
    //         let coursesTemp = []
    //         let res
    //         for(let course of user.courses){

    //             res = await axios.post(axiosLink + '/course/browse', body)
    //         }
    //         //console.log(res.data.tests)
    //         //console.log(res.data.tests)
    //         setTests(res.data.tests)
    //     } catch (fetchTestError) {
    //         //console.log(fetchTestError.response)
    //     }
    // }
    useEffect(() => {
        if (loggedIn === undefined) {
            navigate('/home')
        }
        // getTests()

    }, [])

    return (
        <>
            <div className='bg-base  min-h-[100vh]'>
                <div className='h-14'></div>
                <div className=" h-[15vh] rounded-lg shadow-xl bg-sub-500 border-2 border-sub-300  mx-[110px]  
       px-10 flex justify-between items-center text-center gap-12 ">
                    <SidebarDrawer />
                    <div className='flex justify-center items-center pr-[45%]'>

                        <span className=' text-2xl text-white'>
                            My Courses
                        </span>
                    </div>
                </div>
                <div className='browseTests p-10 pt-5 px-24 bg-base'>
                    <div className="search flex justify-center">
                        <input type="text" name="" id="" className='w-1/2 focus:outline-none p-2 h-[50px] rounded-lg shadow-md bg-slate-100 '
                            onChange={(e) => { setSearch(e.target.value) }}
                        />
                        {/* <span className='w-[50px] flex justify-center items-center border-2 border-dark-500 rounded-lg 
                     ml-2 cursor-pointer hover:bg-dark-500'
                            onClick={getTests}
                        ><SearchOutlined style={{ fontSize: '250%', color: '#92BA92' }} /></span> */}

                    </div>
                    {user !== undefined && user.courses !== undefined ?

                        <div className='grid grid-cols-3 gap-12'>
                            {
                                Object.keys(user.courses).map((courseId, index) => {
                                    return (
                                        <CourseCard courseId={courseId} key={index} />
                                    )
                                })
                            }
                        </div>
                        : undefined
                    }
                </div>
            </div>
        </>
    )
}

export { CoursePage, CourseCard }