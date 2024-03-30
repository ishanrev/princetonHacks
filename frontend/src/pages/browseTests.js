import React, { useContext, useEffect, useState } from 'react'
import { UserOutlined, EditOutlined, EllipsisOutlined, SettingOutlined, SearchOutlined } from '@ant-design/icons';
import { Menu, Dropdown, Modal, message, Switch, Empty, Progress } from 'antd';
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
const TestCard = ({ testId, starts = '', small = true, challengeMode = false, canChange = false }) => {
    // //console.log(starts)
    let navigate = useNavigate()
    const [test, setTest] = useState({ questions: [], name: '', creator: '', description: '' })
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
    const [testFound, setTestFound] = useState()
    const { loggedIn, setLoggedIn } = useContext(LoggedInContext)


    const ALT_IMAGE = 'https://res.cloudinary.com/dhlxchjon/image/upload/v1659113931/no-image-small_w0xpnx.png'
    useEffect(() => {
        console.log(testId, "iwofhewufnudfnhspiuhf")
        if (loggedIn === undefined) {
            navigate('/home')
        }
        async function fetchTest() {
            try {
                // //console.log("response ", testRes)
                // //console.log(testId, "before sending request")

                let { data: testRes } = await axios.get(axiosLink + '/test/' + testId)
                // try {
                //     let { data } = await axios.get(axiosLink + '/user/' + testRes.creator)
                //     // //console.log(data)
                //     let { user } = data
                //     // //console.log(user)
                //     // testRes.creator = user
                // } catch (err) {
                //     //console.log('user error', err)
                //     // testRes.creator = ''
                //     setTestFound(false)
                // }
                if (testRes.creator === undefined) {
                    testRes.creator = ''
                }
                if (testRes === undefined || testRes === null) {
                    setTestFound(false)
                }
                let bool = testRes.name.startsWith(starts) ? true : false
                if (starts === '') { bool = true }
                // //console.log(bool)
                setCheck(bool)
                setTest(testRes)
                setTestFound(true)

            } catch (fetchTestError) {
                // //console.log('fetchTestError', fetchTestError)
                setTestFound(false)
            }
        }
        fetchTest()

    }, [])

    useEffect(() => {
        let bool = test.name.startsWith(starts) ? true : false
        if (starts === '') { bool = true }
        // //console.log(bool)
        setCheck(bool)
    }, [starts])

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
        try {
            let newTest = (await axios.put(axiosLink + '/test/' + testId, newDetails)).data.test
            setTest({ ...test, ...newDetails })
        } catch (updateTestError) {
            //console.log(updateTestError)
        }
        setShowEditModal(false)
    }
    const handleCancel = () => {
        setShowEditModal(false)
    }
    const deletePersonalTest = async () => {
        let tempSaved = user.saved.filter((tId, index) => {
            return testId !== tId
        })
        setUser({ ...user, saved: tempSaved })
        try {
            let res = (await axios.get(axiosLink + '/test/' + testId)).data
            //console.log(res)
        } catch (updateTestError) {
            //console.log(updateTestError)
        }
        try {
            await axios.put(axiosLink + '/user/' + user._id.toString(), { saved: tempSaved })
            message.success('successfully deleted a personal playlist', 3)
        } catch (updateError) {
            //console.log(updateError)
            message.error('couldn\'t delete a personal playlist', 3)
        }
        setTestFound(false)
        setShowEditModal(false)
    }

    const hostGame = () => {
        //console.log('fromId', user._id)
        socket.emit("host game request", { fromId: user._id, testId })
    }

    return (
        <> {testFound === true ? <div>
            <Modal visible={showEditModal} onOk={handleOk} onCancel={handleCancel} title='Make Changes'>
                <div className=' flex justify-between gapp-1'>
                    <div>
                        <label htmlFor="">Name</label>
                        <br />
                        <br />
                        <input type="text" name="" id="" className=' rounded-md bg-slate-200 p-2 focus:outline-none' defaultValue={test.name}
                            onChange={(e) => {
                                setNewDetails({ ...newDetails, name: e.target.value })
                            }}
                        />
                        <br />
                        <br />
                        {/* <input type="checkbox" name="Public" id="Public" value={testDetails.public} onClick={changePublic} /> */}
                        <label htmlFor="" className="Public" id="Public">Public</label>
                        <br />
                        <br />
                        <span className="m-2">
                            <Switch defaultChecked={test.public} onChange={(change) => { setNewDetails({ ...newDetails, public: change }) }} />
                        </span>
                        <br />
                        <br />
                        <button onClick={deletePersonalTest} className='p-2 rounded-lg text-white bg-red-400 active:bg-red-600'>Delete</button>
                    </div>
                    <div className='h-[10rem] w-[17rem] rounded-lg border-2 border-slate-300'>

                    </div>
                </div>
            </Modal>
            {check === true ?
                <div className={`testCard  rounded-lg bg-white shadow-lg hover:cursor-pointer 
                hover:shadow-2xl overflow-hidden min-w-[200px] max-w-[350px] ` + (() => { return small === false ? ' h-[475px]' : challengeMode === false ? ' h-[200px]' : ' h-[80px' })()}
                    onClick={() => { }}
                >
                    <ChalengeFriendDrawer showFriendsDrawer={showFriendsDrawer} setShowFriendsDrawer={setShowFriendsDrawer} testId={testId} />
                    {small === false ?
                        <div className={"header h-[45%] "}>

                            <img src="https://picsum.photos/300" className=' object-cover w-full h-full' alt="img here" />
                            {/* <Image
                                style=
                                {{
                                    width: 'full',
                                    height: 'full',
                                    marginLeft: '1rem',
                                    objectFit: 'cover'
                                }}
                                cloudName="hextree" publicId={test.img !== undefined ? test.img : ALT_IMAGE} /> */}

                        </div>
                        : undefined}
                    <div className={"content  p-3 overflow-y-scroll" + (() => { return small === true ? ' h-[70%]' : ' h-[27.5%]' })()}>
                        <span className="title flex justify-between ">
                            <h1>{test.name}</h1>
                            <div className=" flex gap-2 navbar-progress">
                                <span className=' w-[2%] mt-1 pl'>
                                    {user.testProgress!==undefined && user.testProgress[testId]!==undefined  && small === true ?
                                        <Progress percent={
                                            (() => {
                                                let p;
                                                if (user.testProgress[testId].questionsCompleted !== undefined) {

                                                    p = ((user.testProgress[testId].questionsCompleted) / (test.questions.length)) * 100
                                                }
                                                console.log(p)
                                                return p
                                            })()

// style={{ width: '10%' }}
                                        } type = "circle" showInfo={false} strokeColor="#525E7580"  />
                                        : <></>}
                                </span>
                                <span className="questionNumber ml-5 bg-primary-300 rounded-lg pt-[2px] px-2 hover:shadow-md  max-h-7">{test.questions.length}</span>
                                <Dropdown overlay={questionsList}>
                                    <span className=" bg-primary-300 rounded-lg Preview pt-[2px] px-2 hover:shadow-md max-h-7"
                                    >Preview</span>
                                </Dropdown>
                                {canChange === true ?
                                    <span className='bg-primary-300 rounded-lg pt-[2px] px-2 hover:shadow-md'
                                        onClick={() => { setShowEditModal(true) }}
                                    >
                                        <EditOutlined />

                                    </span>
                                    : undefined}
                            </div>

                        </span>

                        <p className="description pt-1 ">"Lorem ipsum dolor sit amet,
                            consectetur adipiscing elit, sed do eiusmod tempor sed do eiusmod tempor  "</p>


                        {/* <button className="previewQuestions p-2">Preview Questions</button> */}

                    </div>
                    {small === false ?
                        <div>
                            <div className={"footer bg-gray-200 h-[10%] px-3 py-2 pb-3 flex justify-between"}>
                                <div className="user">

                                    <span className=""><UserOutlined /></span>
                                    <span className="pl-2 pt-1"> {test.creator}</span>
                                </div>
                                <ul className="interact flex gap-2">

                                </ul>
                            </div>
                            <div className='px-5 h-[25px]'>

                                {small === false && challengeMode === false && user.testProgress[testId] !== undefined ? <>
                                    <Progress percent={
                                        (() => {
                                            let p;
                                            if (user.testProgress[testId].questionsCompleted !== undefined) {

                                                p = ((user.testProgress[testId].questionsCompleted) / (test.questions.length)) * 100
                                            }
                                            console.log(p)
                                            return p
                                        })()


                                    } showInfo={false} strokeColor="#525E7580" />
                                </> : <></>}
                            </div>
                        </div>

                        : undefined}
                    {challengeMode === false ?
                        <div className={" p-3  flex justify-center gap-3 " + (() => { return small === true ? ' h-[30%] bg-sub-200' : 'h-[15%]' })()}>
                            <button onClick={() => setShowPracticeModal(true)} className="practice px-2 py-1 w-full bg-dark-500 text-white rounded-md">Practice</button>
                            <Modal className='SettingsModal ' title="Practice" zIndex={1000}
                                centered visible={showPracticeModal}
                                onOk={() => setShowPracticeModal(false)}
                                onCancel={() => setShowPracticeModal(false)}>

                                {/* <Link to = {'answeStation/' + test.Id} component= {AnswerStation}></Link> */}
                                <Link to={'/practice/answerStation/' + testId} component={AnswerStation}>Go To The Practice Page </Link>
                            </Modal>


                            <button onClick={() => setShowFriendsDrawer(true)}
                                className="play px-1 py-1 w-full bg-primary-500 text-white rounded-md">
                                Play</button>
                            <button onClick={() => { hostGame() }}
                                className="play px-1 py-1 w-full bg-dark-500 text-white rounded-md">
                                Host</button>

                            <Modal className='SettingsModal ' title="Play" zIndex={1000}
                                centered visible={showPlayModal}
                                onOk={() => setShowPlayModal(false)}
                                onCancel={() => setShowPlayModal(false)}>
                                <input type="text" className='bg-gray-200 w-2'
                                    onChange={(e) => setChallengeTo(e.target.value)} />
                                <button onClick={challenge}>Test Challenge Friend button</button>
                            </Modal>

                        </div>
                        : undefined}
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

function BrowseTests() {
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

    const getTests = async () => {
        try {
            let body = {
                filter: search.split(' ')
            }
            //console.log(body)
            let res = await axios.post(axiosLink + '/test/browse', body)
            //console.log(res.data.tests)
            //console.log(res.data.tests)
            setTests(res.data.tests)
        } catch (fetchTestError) {
            //console.log(fetchTestError.response)
        }
    }
    useEffect(() => {
        if (loggedIn === undefined) {
            navigate('/home')
        }

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
                            Test Center
                        </span>
                    </div>
                </div>
                <div className='browseTests p-10 pt-5 px-24 bg-base'>
                    <div className="search flex justify-center">
                        <input type="text" name="" id="" className='w-1/2 focus:outline-none p-2 h-[50px] rounded-lg shadow-md bg-slate-100 '
                            onChange={(e) => { setSearch(e.target.value) }}
                        />
                        <span className='w-[50px] flex justify-center items-center border-2 border-dark-500 rounded-lg 
                     ml-2 cursor-pointer hover:bg-dark-500'
                            onClick={getTests}
                        ><SearchOutlined style={{ fontSize: '250%', color: '#92BA92' }} /></span>

                    </div>
                    {tests.length > 0 ?
                        <>
                            <span className="mb-3 my-5">Results For {' ' + search}</span>
                            <div className="testCards grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-12 mt-3">



                                {tests.map((test, index) => {
                                    return <TestCard testId={test} key={index} small />
                                })}




                            </div>
                        </> :
                        <NoTestsFound />
                    }
                </div>
            </div>
        </>
    )
}

export { BrowseTests, TestCard }