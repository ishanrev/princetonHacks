import React, { useState, createContext, useContext, useEffect } from 'react'
import './App.css'
import QuestionEditor from './components/TestMaker/QuestionEditor'

import Compiler from './pages/compiler'
import TestMakerPage from './pages/testMaker'
import NavBar from './components/General/NavBar'
// import CreateTest from './pages/createTest'
import AnswerStation from './pages/answerStation'
import DynamicChart from './components/General/tester'
import { BrowseTests } from './pages/browseTests'
import SignIn from './pages/signIn'
import Login from './pages/login'
import { UserContext, SocketContext, socket, LoggedInContext } from './contexts'
import { v4 as uuid } from 'uuid'
import SideBar from './components/General/sidebar'
import { Result } from 'antd'

// import { socket,  } from "./socket";


import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Routes,
    useNavigate,
    Navigate
} from "react-router-dom";
import Dashboard from './pages/dashboard'
// import {createSocket, getSocket} from './socket'
import socketClient from 'socket.io-client'
import Tester from './components/General/tester'
import TestMaker from './components/TestMaker/TestMaker'
import GamePinPage from './pages/gamePin'
import SocketConfiguration from './components/General/SocketConfiguration'
import GamePage from './pages/gamePage'
import axios from 'axios'
import axiosLink from './axiosInstance'
import TestCenter from './pages/testCenter'
import Winner from './pages/winner'
import HomePage from './pages/homePage'
import { CoursePage } from './pages/coursePage'
import CourseMain from './pages/courseMain'




function BrowseTestsMainPage() {
    return (
        <div className="search">
            <NavBar />
            <BrowseTests />
        </div>
    )
}
function NoPageFound() {
    return (
        <div className=" h-[100vh] pt-24">
            <Result
                status="error"
                title="No Page Found"
                subTitle="No Page Found, Click here to go to the home page"
                extra={<button className=' p-2 bg-slate-400 text-slate-700 rounded-lg text-xl'>
                    Home
                </button>}
            />
        </div>
    )
}



function App() {
    // let dummyId = uuid()
    // console.log("mu User Id is ",dummyId)
    // const navigate = useNavigate()
    const [buffer, setBuffer] = useState(false)
    const [challenges, setChallenges] = useState([{ fromId: 'testFromId', challenge: '' }, { fromId: 'testFrom2', challenge: '' }])
    const [user, setUser] = useState({ _id: uuid(), challenges, saved: [], friends: { friends: [], pending: [], requests: [] } })
    const [loggedIn, setLoggedIn] = useState(undefined)




    const newFriend = (fromId, toId) => {

    }

    const updateFriends = async () => {
        try {
            let res = await axios.get(axiosLink + '/user/' + user._id.toString())
            console.log(res)
            let tempUser = res.data.user
            setUser(tempUser)
        } catch (updateFriendsError) {
            console.log(updateFriendsError.message)
        }
    }

    useEffect(() => {
        async function fetchUser(userId) {
            try {
                console.log('userId main before fetching', userId)
                let res = await axios.get(axiosLink + '/user/' + userId)
                console.log('////////////////////////')
                console.log(res.data.user)
                setUser(res.data.user)
            } catch (fetchUserError) {
                console.log(fetchUserError)
            }
        }


        let userId = localStorage.getItem("userId")

        if (userId !== undefined) {
            fetchUser(userId)
        }
        //animate__animated animate__fadeInUp
    }, [])

    //Challege configuration
    useEffect(() => {
        socket.on("challenge accepted", ({ fromId, toId, challengeId }) => {
            console.log(`${toId} has accepted your challenge request`)

        })
        socket.on("challenge declined", ({ fromId, toId }) => {
            console.log(`${toId} has declined your challenge request`)
        })
        socket.on("challenge welcome", ({ message, challenge }) => {
            console.log(message)
        })




        socket.on("friend request", ({ fromId, toId }) => {
            updateFriends()
        })
        socket.on("friend request accepted", ({ fromId, toId }) => {
            updateFriends()
        })
        socket.on("friend request declined", ({ fromId, toId }) => {
            updateFriends()
        })




        return () => {
            socket.emit("remove user", { userId: user._id })
        }
    }, [loggedIn])
    // live game socket configurations
    useEffect(() => {
        // return async () => {
        //     try {
        //         let res = await axios.put(axiosLink + '/user/' + user._id.toString(), { dailyProgress: user.dailyProgress })
        //         console.log("chart progress update success")
        //         console.log(res.data.success)
        //     } catch (updateDailyProgressAPIError) {
        //         console.log("problem has arrived")
        //         console.log(updateDailyProgressAPIError.message)
        //     }
        // }
    }, [])

    async function updateUser(change) {
        console.log("--------change da---------")
        console.log(change)
        try {
            let tempId = user._id.toString();
            let { updated } = (await (axios.put(axiosLink + `/user/${tempId}`, change))).data;
            setUser(updated)

            console.log("successfully updated the lastTest")
        } catch (userUpdateError) {
            console.log("update ueser error")
            console.log(userUpdateError)
        }
    }


    return (
        <div className='bg-base font-main'>
            {/* <SocketConfiguration /> */}
            <Router>
                <LoggedInContext.Provider value={{ loggedIn, setLoggedIn }}>
                    <SocketContext.Provider value={socket}>
                        {/* <button onClick={() => {
                        console.log(socket)
                    }}>ShowSocket</button>
                    <Link to='/tester'>Go to tester page</Link> */}
                        <UserContext.Provider value={{ user, setUser, updateUser }}>
                            <Routes>

                                {/* <Route exact path='/' element={<BrowseTestsMainPage />} /> */}

                                <Route exact path='/' element={<HomePage />} />
                                <Route exact path='/home' element={<HomePage />} />
                                <Route exact path='/signUp' element={<SignIn />} />
                                <Route exact path='/login' element={<Login />} />
                                {/* <Route exact path='/' element={<Login />} /> */}
                                <Route exact path='/practice/answerStation/:id' element={<AnswerStation />} />
                                <Route exact path='/challenge/answerStation/:id' element={<AnswerStation />} />
                                <Route exact path='/course/answerStation/:id/:courseId' element={<AnswerStation />} />
                                {/* <Route exact path='/game/:id' element={<GamePage />} /> */}
                                <Route exact path='/dashboard' element={<Dashboard />} />
                                {/* <Route exact path='/testCenter' element={<TestCenter />} /> */}
                                <Route exact path='/browse' element={<BrowseTests />} />
                                <Route exact path='/create' element={<TestMakerPage />} />
                                {/* <Route exact path='/joinGame' element={<GamePinPage />} /> */}
                                <Route exact path='/courses' element={<CoursePage />} />
                                <Route exact path='/course/:courseId' element={<CourseMain />} />

                                {/* <Route exact path='/tester' element={<Winner mode='challenge' winners={["62b71ed9ddd5480e39d4d4fe", "62b71ed9ddd5480e39d4d4fe"]}></Winner>} /> */}
                                {/* <Route exact path='/sideBar' element={<SideBar />} /> */}
                                {/* <Route exact path='/tester-chart' element={<DynamicChart />} /> */}
                                {/* <Route exact path='/game/id' element={<GamePage />} /> */}
                                <Route path='*' element={<NoPageFound />} />

                                {/* <div className="buffer"> */}
                                {/* <Compiler /> */}
                                {/* <TestMakerPage /> */}
                                {/* <QuestionEditor /> */}
                                {/* <CreateTest /> */}
                                {/* <AnswerStation /> */}
                                {/* <Tester /> */}
                                {/* <BrowseTestsMainPage /> */}
                                {/* <SignIn /> */}
                                {/* <Login /> */}
                                {/* </div> */}
                                {/* <NavBar /> */}
                            </Routes>
                        </UserContext.Provider>
                    </SocketContext.Provider>
                </LoggedInContext.Provider>
            </Router>
        </div>

    )

}

export default App