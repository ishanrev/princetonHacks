import React, { useState, useEffect, useContext } from 'react'
import SideBar from '../components/General/sidebarCourse'
import { Tabs, Progress, Carousel, Drawer, notification, Modal, Spin, Empty, Radio, Space } from 'antd'
import { PlusOutlined, UserOutlined, MinusOutlined, CheckOutlined, CloseOutlined, Badge, EditOutlined, UploadOutlined } from '@ant-design/icons'
import { Bar } from 'react-chartjs-2';
import DynamicChart from '../components/General/tester';
import { BarChartComp } from '../components/General/Charts'
import { SocketContext, UserContext, LoggedInContext } from '../contexts';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import axiosLink from '../axiosInstance';
import ChalengeFriendDrawer from '../components/General/chalengeFriendDrawer';
import { TestCard } from './browseTests';
import { Image } from 'cloudinary-react'
import YouTube from 'react-youtube';

import 'animate.css';

const { TabPane } = Tabs
const ALT_IMAGE = "https://res.cloudinary.com/dhlxchjon/image/upload/v1658670857/user-icon_t5lgwl.png"

function Challenges({ friendsUserNames }) {
    // //console.log('challenges', challenges)
    let navigate = useNavigate()
    const socket = useContext(SocketContext)
    const { user, setUser } = useContext(UserContext)

    const [challenges, setChallenges] = useState([])

    useEffect(() => {
        setChallenges(user.challenges)
    }, [])

    let questionId = '624044d2bf2ff26c3a0e123f'

    function acceptChallenge(ch, index) {
        //console.log(">>>>>>>>>>>>>>>>>>>>>" + ch.testId)
        let temp = challenges.filter((ch, i) => {
            return index !== i;
        })
        setChallenges(temp)
        socket.emit("accept challenge", { fromId: ch.fromId, toId: user._id, testId: ch.testId })
    }
    function declineChallenge(ch, index) {
        let temp = challenges.filter((ch, i) => {
            return index !== i;
        })
        setChallenges(temp)
    }
    useEffect(() => {
        function newChallengeRequest(fromId, testId) {
            //console.log("new challenge request from " + fromId + " babyyyyyyy")
            //console.log('/*/*/*/*/*/*/*/*/')
            let tempChallenges = challenges
            tempChallenges.push({ fromId, testId })
            //console.log()
            setChallenges(tempChallenges)
            notification.info({
                message: 'challenge',
                description: 'You have received a challenge from ' + friendsUserNames[fromId],
                onClick: () => {
                    navigate('/dashboard')
                },
                maxCount: 1
            })
        }
        socket.on("challenge request", ({ fromId, toId, testId }) => {
            //console.log('c')
            if (fromId !== user._id) {
                newChallengeRequest(fromId, testId)
            }
        })
        socket.on("challenge redirect", ({ challenge }) => {
            const { testId, challengeId } = challenge
            //console.log("challenge redirect to testId" + testId)
            console.log("challenge redirect")
            navigate('/challenge/answerStation/' + testId + `?challengeId=${challengeId}`)

        })
        socket.on("game created", ({ message, game }) => {
            //console.log(message)
            //console.log('game details')
            //console.log(game)
            navigate(`/game/${game.id}`)
        })
        socket.on("joined game", ({ id: gameId }) => {
            navigate(`/game/${gameId}`)
        })
        return async () => {
            try {
                setUser({ ...user, challenges })
                //console.log("going to update bossman")
                //console.log("update thingy")
            } catch (updateUserChallengesError) {
                //console.log(updateUserChallengesError)
            }
        }
    }, [])
    return (
        <>

            {challenges.length > 0 ?
                <>{
                    challenges.map((ch, index) => {
                        if (index < 2) {

                            return (
                                <div className="    ms-center px-2 " key={index}>
                                    <div className='flex justify-between ga px-6 border-b-2 border-dark-500  py-2 my-3'>
                                        <span className="from text-lg">
                                            {friendsUserNames[ch.fromId]}
                                        </span>
                                        <br />

                                        <div className="buttons flex justify-around gap-3 ">
                                            <button className='p-1 w-8  bg-primary-500 text-white rounded-lg'
                                                onClick={() => acceptChallenge(ch, index)}
                                            >
                                                <span className=' -mt-2'>
                                                    <CheckOutlined />
                                                </span></button>
                                            <button className='p-1 w-8 bg-dark-500 text-white rounded-lg'
                                                onClick={() => declineChallenge(ch, index)}
                                            >
                                                <span className='-mt-2'>
                                                    <CloseOutlined />
                                                </span></button>
                                        </div>
                                    </div>

                                    <TestCard testId={ch.testId} small={true} challengeMode={true} />


                                </div>
                            )
                        } else {
                            return null
                        }
                    })
                }

                </>

                : <div className='flex justify-center items-center pl-[32.5%] pt-[5%]'>
                    <Empty description={
                        <span>
                            No Challenges - visit <span className=' text-blue-300 cursor-pointer' onClick={() => navigate('/browse')}> Browse Tests</span><br /> to challenge someone
                        </span>
                    } />
                </div>}

        </>
    )
}


function CourseMain() {
    const navigate = useNavigate()
    const { user, setUser } = useContext(UserContext)
    const socket = useContext(SocketContext)

    let { courseId } = useParams()
    const [course, setCourse] = useState(null)
    const [courseFound, setCourseFound] = useState(false)
    const [currentMode, setCurrentMode] = useState({ type: null })

    const [module, setModule] = useState(0)
    const [type, setType] = useState(null)
    const [number, setnumber] = useState(0)


    const [friends, setFriends] = useState({ friends: [], pending: [], requests: [] })
    const [myTests, setMyTests] = useState([1, 2, 3, 4, 5, 6, 7])
    const [practiceTests, setPracticeTests] = useState([1, 2, 3, 4, 5, 6, 7])
    const maxMiddleNum = 4
    const [current, setCurrent] = useState(0)
    const [practiceCurrent, setPracticeCurrent] = useState(0)
    const [showFriendsDrawer, setShowFriendsDrawer] = useState(false)
    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

    const { loggedIn, setLoggedIn } = useContext(LoggedInContext)
    // const { user, setUser } = useContext(UserContext)
    const [newChallenge, setNewChallenge] = useState('')
    const [newFriend, setNewFriend] = useState('')
    const [friendsUserNames, setfriendsUserNames] = useState([])
    const [friendsEmails, setfriendsEmails] = useState([])
    const [friendsImgs, setfriendsImgs] = useState([])
    const [preview, setPreview] = useState("challenges")

    const previewSwitch = (
        <div className='flex justify-between pt-3 gap-2 '>
            <span className={'rounded-lg cursor-pointer border-2 border-dark-500 px-2' + (() => { return preview === "challenges" ? " bg-dark-500 text-white" : "" })()}
                onClick={() => { setPreview("challenges") }}>Challenges</span>
            <span className={'rounded-lg cursor-pointer border-2 border-dark-500 px-2' + (() => { return preview === "challenges" ? "" : " bg-dark-500 text-white" })()}
                onClick={() => { setPreview("myProgress") }}>My Progress</span>
        </div>
    )

    async function initializeUserNames() {
        let temp = {}
        let temp2 = {}
        let temp3 = {}
        for (let friendId of user.friends.friends) {
            try {
                let res = await axios.get(axiosLink + '/user/' + friendId)
                temp[friendId] = res.data.user.name
                temp2[friendId] = res.data.user.emailId
                temp3[friendId] = res.data.user.img
                // temp.push(res.data.user.name)
            } catch (updateError) {
                //console.log(updateError)
                break;
            }
        }
        for (let friendId of user.friends.pending) {
            try {
                let res = await axios.get(axiosLink + '/user/' + friendId)
                temp[friendId] = res.data.user.name
                temp2[friendId] = res.data.user.emailId
                temp3[friendId] = res.data.user.img
                // temp.push(res.data.user.name)
            } catch (updateError) {
                //console.log(updateError)
                break;
            }
        }
        for (let friendId of user.friends.requests) {
            try {
                let res = await axios.get(axiosLink + '/user/' + friendId)
                temp[friendId] = res.data.user.name
                temp2[friendId] = res.data.user.emailId
                temp3[friendId] = res.data.user.img
                // temp.push(res.data.user.name)
            } catch (updateError) {
                //console.log(updateError)
                break;
            }
        }
        //console.log(temp)
        setfriendsUserNames(temp)
        setfriendsEmails(temp2)
        setfriendsImgs(temp3)
    }

    const updateCurrentMode = (module, type, number) => {
        // let tempCurrentMode = currentMode
        // currentMode.module = module
        // currentMode.type = type
        // currentMode.number = number;
        // setCurrentMode(tempCurrentMode)
        // console.log(currentMode)

        setModule(module)
        setType(type)
        setnumber(number)
    }



    const getCourse = async () => {
        try {
            let res = await axios.get(axiosLink + '/course/' + courseId)
            setCourse(res.data.course);
            setCourseFound(true)
            console.log(res.data.course)
        } catch (getError) {
            console.log(getError)
        }
    }

    useEffect(() => {
        if (loggedIn === undefined) {
            navigate('/home')
        }
        if (courseId !== undefined) {
            getCourse()
        }
    }, [])

    useEffect(() => {
        console.log('has been changed')
    }, [module, type, number])
    // any change in friends use Effect method
    async function updateUser() {
        try {
            //console.log(user._id.toString())
            let res = await axios.get(axiosLink + '/user/' + user._id.toString())
            //console.log(res)
            //console.log('update user command ', res.data.user)
            setUser(res.data.user)
        } catch (updateError) {
            //console.log(updateError)
        }
    }
    useEffect(() => {
        //console.log("--------------------------")
        //console.log(user)
        //console.log("--------------------------")
        socket.on("update user", ({ }) => {
            //console.log("gonna update user")
            updateUser()
        })
        //console.log("llllllllllllllllllllll")
        //console.log(user.lastTest)
    }, [])

    useEffect(() => {
        initializeUserNames()
    }, [user])


    const RenderChart = () => {
        return <DynamicChart />
    }


    // const accept = (friend) => {
    //     socket.emit("accept friend request", { fromId: friend, toId: user._id.toString() })
    // }
    // const decline = (friend) => {

    // }

    // const renderFriends = (type) => {
    //     return (
    //         <div>
    //             {user.friends[type].map((friend, index) => {
    //                 return (
    //                     <>
    //                         <div className="wrapper mb-5" key={index}>

    //                             <div className="friend flex mb-2">
    //                                 {/* <img src="https:picsum.photos/50" alt="img" className="profilePic w-9 h-9 mr-2 mt-2 rounded-[100%] object-cover" /> */}
    //                                 <Image
    //                                     style=
    //                                     {{
    //                                         width: '2.25rem',
    //                                         height: '2.25rem',
    //                                         marginRight: '0.50rem',
    //                                         marginTop: '0.50rem',
    //                                         borderRadius: '100%',
    //                                         objectFit: 'cover'
    //                                     }}
    //                                     cloudName="hextree" publicId={friendsImgs[friend] !== undefined ? friendsImgs[friend] : ALT_IMAGE} />
    //                                 <div className="details">
    //                                     <span>{friendsUserNames[friend]}</span>
    //                                     <br />
    //                                     <span className='text-[11px]'>{friendsEmails[friend]}</span>
    //                                     {type === 'requests' ? <div className=''>
    //                                         <br />
    //                                         <button className='p-2 rounded-md bg-primary-200 mr-2' onClick={() => accept(friend)}>Accept</button>
    //                                         <button className='p-2 rounded-md bg-primary-200' onClick={() => decline(friend)}>Decline</button>
    //                                     </div>
    //                                         : undefined}
    //                                 </div>
    //                             </div>
    //                             <div className="hr w-full h-[1px] bg-gray-300 rounded-3xl">

    //                             </div>
    //                         </div>
    //                     </>
    //                 )
    //             })
    //             }

    //         </div>
    //     )

    // }



    // const sendFriendRequest = () => {
    //     if (newFriend !== null && user.friends.pending.includes(newFriend) === false && newFriend !== user.emailId) {
    //         try {

    //             socket.emit("new friend request", { fromEmail: user.emailId, toEmail: newFriend })
    //             notification.success({
    //                 description: `Friend request successfuly sent to ${friendsUserNames[newFriend]}`,
    //                 message: "Success"
    //             })
    //         } catch (err) {
    //             //console.log(err)
    //         }
    //     }
    // }

    return (
        <>


            <div className='dashboard flex justify-start h-[100vh] '>
                {/* <ChalengeFriendDrawer showFriendsDrawer={showFriendsDrawer} setShowFriendsDrawer={setShowFriendsDrawer} */}

                {/* /> */}
                {courseFound === true ? <>
                    <SideBar modules={course.modules} updateCurrentMode={updateCurrentMode} />
                    <div className=" bg-base h-[100vh] p-7 pt-3 pb-1 w-full overflow-y-scroll ">
                        <span className='text-2xl'>{course.title}</span>



                        <CourseContent course={course} type={type} module={module} number={number} />

                        {/* <span className="text-[2rem] mb-2 mx-2"></span>
                        <div className="top flex jusify-between gap-5 mb-6">

                        </div> */}


                    </div>
                </> : undefined}

            </div>

        </>

    )
}

const checkAnswer = () => {

}

const CourseContent = ({ course, module, type, number }) => {

    const [value, setValue] = useState(1);
    const { user } = useContext(UserContext)
    const [message, setMessage] = useState('')
    const onChange = (e) => {
        console.log('radio checked', e.target.value);
        setValue(e.target.value);
    };

    const opts = {
        height: '400',
        width: '600',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
        },
    };

    const submitAnswer = async () => {
        if (course.modules[module].videos[number].options[value].correct === true) {
            setMessage("correct")
            try {
                await axios.post(axiosLink + '/course/progress', { userId: user._id.toString(), courseId: course._id.toString() })
            } catch (progressError) {
                console.log(progressError)
            }
        } else {
            setMessage('incorrect')
        }
    }
    return (
        <>
            <br />
            <br />
            <br />
            {type === 'video' ? <>
                <div className="top ">
                    <div className="chart w-full h-full  rounded-lg shadow-lg 
                         p-6  px-3 shad flex items-center justify-center bg-[#fafafa]
                         border-2 border-dark-400 gap-6 pt-5">
                        <div className='rounded-lg '>

                            <YouTube videoId={course.modules[module].videos[number].url.split('=')[1]} opts={opts} />
                        </div>
                        <span>{course.modules[module].videos[number].summary}</span>


                    </div>

                </div>
                <br />
                <div className="test ">
                    <div className="chart w-full h-full  rounded-lg shadow-lg 
                         p-6  px-3 shad  bg-[#fafafa]
                         border-2 border-dark-400 gap-6 pt-5">
                        <span className='text-lg'> {course.modules[module].videos[number].question}</span>
                        <br />
                        <br />
                        <Radio.Group onChange={onChange} value={value}>
                            <Space direction="vertical">

                                {course.modules[module].videos[number].options.map(({ text, correct }, index) => {
                                    return (
                                        <Radio value={index}>{text}</Radio>
                                    )
                                })}


                            </Space>
                        </Radio.Group>
                        <button onClick={() => { submitAnswer() }} className="practice px-2 h-9 py-1 w-[1/8] bg-dark-500 text-white rounded-md">Submit</button>
                        {message === 'correct' ?
                            <>
                                <h3 className='w-full p-2 bg-green-200 rounded-lg my-4 border-2 border-green-300'>{message}</h3>
                            </> : message === 'incorrect' ? <>
                                <h3 className='w-full p-2 bg-red-200 rounded-lg my-4 border-2 border-red-300'>{message}</h3>
                            </> : undefined}
                    </div>

                </div>
            </> : undefined}
            {type === 'article' ? <>
                {/* <div className="top flex jusify-between gap-5 mb-6">
                    <div className="chart w-2/3 h-[300px]  rounded-lg shadow-lg 
                        items-center p-1  px-3 shad bg-[#fafafa]
                         border-2 border-dark-400 gap-6 pt-5"> */}

                <div className="top ">
                    <div className="chart w-full h-full  rounded-lg shadow-lg 
                         p-6  px-3 shad flex items-center justify-center bg-[#fafafa]
                         border-2 border-dark-400 gap-6 pt-5">

                        <a><span>{course.modules[module].articles[number].url}</span></a>


                    </div>

                </div>
                <br />



                {/* </div>

                </div> */}
            </> : undefined}
            {type === 'test' ? <>
                <div className="top ">
                    <div className="chart w-auto h-full  rounded-lg shadow-lg 
                         p-6  px-3 shad flex items-center justify-center bg-[#fafafa]
                         border-2 border-dark-400 gap-6 pt-5">

                        {/* <span>{course.modules[module].test}</span> */}
                        <TestCard courseId={course._id.toString()} course={true} testId={course.modules[module].test} />


                    </div>

                </div>
                <br />
            </> : undefined}
        </>
    )
}
const NothingSelected = () => {
    return (
        <>
            Nothing has been selected
        </>
    )
}
const VideoComponent = ({ video }) => {
    return (
        <>
            <div className="top flex jusify-between gap-5 mb-6">
                <div className="chart w-2/3 h-[300px]  rounded-lg shadow-lg 
                        items-center p-1  px-3 shad bg-[#fafafa]
                         border-2 border-dark-400 gap-6 pt-5">
                    {video.url}


                </div>

            </div>
        </>
    )
}
const ArticleComponent = ({ article }) => {
    return (
        <>
            <div className="top flex jusify-between gap-5 mb-6">
                <div className="chart w-2/3 h-[300px]  rounded-lg shadow-lg 
                        items-center p-1  px-3 shad bg-[#fafafa]
                         border-2 border-dark-400 gap-6 pt-5">

                    {article.url}

                </div>

            </div>
        </>
    )
}
const TestComponent = ({ test }) => {
    return (
        <>
            <div className="top flex jusify-between gap-5 mb-6">
                <div className="chart w-2/3 h-[300px]  rounded-lg shadow-lg 
                        items-center p-1  px-3 shad bg-[#fafafa]
                         border-2 border-dark-400 gap-6 pt-5">

                    {test}

                </div>

            </div>
        </>
    )
}
const UserInfo = () => {
    const { user, setUser, updateUser } = useContext(UserContext)
    const [newDetails, setNewDetails] = useState({})
    const [showEditUserModal, setShowEditUserModal] = useState(false)
    const [imageSelected, setImageSelected] = useState()
    const [imageLoaded, setImageLoaded] = useState(false)
    const handleOk = async () => {
        const formData = new FormData()
        formData.append('file', imageSelected)
        formData.append("upload_preset", "hextree")
        // setNewDetails({ ...newDetails, img: image })
        let url;
        try {
            setImageLoaded(true)
            let res = await axios.post("https://api.cloudinary.com/v1_1/dhlxchjon/image/upload", formData)
            setImageLoaded(false)
            setNewDetails({ ...newDetails, img: res.data.url })
            url = res.data.url
            //console.log(res)
        } catch (uploadPicError) {
            //console.log(uploadPicError)
        }
        updateUser({ ...newDetails, img: url })
        setImageLoaded(false)
        setShowEditUserModal(false)
    }
    const handleCancel = () => {
        setImageLoaded(false)
        setShowEditUserModal(false)
    }



    return (
        <div className="userInfo">
            <Modal visible={showEditUserModal} onOk={handleOk} onCancel={handleCancel} title='Update User Info'>
                <div className=' flex justify-between gap-1'>
                    <div>
                        <label htmlFor="">Name</label>
                        <br />
                        <br />
                        <input type="text" name="" id="" className=' rounded-md bg-slate-200 p-2 focus:outline-none' defaultValue={user.name}
                            onChange={(e) => {
                                setNewDetails({ ...newDetails, name: e.target.value })
                            }}
                        />
                        <br />
                        <br />

                        <input type="file" accept='' name="" id="" onChange={(e) => {
                            var pattern = /image-*/;

                            if (!e.target.files[0].type.match(pattern)) {
                                alert('Invalid format');
                                return;
                            }
                            setImageSelected(e.target.files[0])
                        }
                        } />
                        <br />
                        {/* <input type="checkbox" name="Public" id="Public" value={testDetails.public} onClick={changePublic} /> */}


                    </div>
                    {/* <Spin loading={imageLoaded}> */}
                    <div className='h-[10rem] w-[17rem] rounded-lg border-2 border-slate-300 flex items-center justify-center'>
                        {user.img === null ? <div className='pr-10'><UploadOutlined style={{ fontSize: '3rem', color: 'gray' }} /></div> : undefined}

                        <Image
                            style=
                            {{
                                height: '10rem',
                                width: '17rem',
                                objectFit: 'cover'
                            }}
                            cloudName="hextree" publicId={user.img} />
                    </div>
                    {/* </Spin> */}
                </div>
            </Modal>


            <div className="header w-full h-[120px] rounded-lg bg-sub-200 p-2 flex items-center gap-4 -mb-24">
                {/* <img src="https:picsum.photos/50" alt="img" className="profilePic w-[5.2rem] h-[5.2rem] ml-3 rounded-[100%] object-cover" /> */}
                <Image
                    style=
                    {{
                        width: '5.2rem',
                        height: '5.2rem',
                        marginLeft: '0.75rem',
                        borderRadius: '100%',
                        objectFit: 'cover'
                    }}
                    cloudName="hextree" publicId={user.img !== undefined ? user.img : ALT_IMAGE} />

                <div className=" flex justify-between bg">
                    <div>

                        <span className='text-2xl block'>{user.name}</span>
                        <span className='text-md block'>{user.emailId}</span>
                    </div>
                    <span className='flex justify-center items-center w-[4.2rem] cursor-pointer' onClick={() => setShowEditUserModal(true)}> <EditOutlined style={{ fontSize: '20px' }} /> </span>
                </div>


            </div>

        </div>
    )
}

export default CourseMain