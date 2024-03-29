import React, { useState, useContext, useEffect } from 'react'
import SidebarDrawer from '../components/General/sidebarDrawer'
import { LoggedInContext, UserContext } from '../contexts'
import { Tabs, message } from 'antd'
import { TestCard } from './browseTests'

import axiosLink from '../axiosInstance'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
// import { set } from 'express/lib/response'
const { TabPane } = Tabs
function TestCenter() {

    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext)
    const [myTests, setMyTests] = useState()
    const [continueTests, setContinueTests] = useState([])
    const [playlistTests, setPlaylistTests] = useState(["62610a1997b777db04b023d4", "62610a1997b777db04b023d4"])
    const [tests, setTests] = useState({});
    const [newPlaylist, setNewPlaylist] = useState({})
    const [testSearch, setTestSearch] = useState('')
    const [key, setKey] = useState("1")
    const { loggedIn, setLoggedIn } = useContext(LoggedInContext)

    const addPlayList = async () => {
        try {
            let body = {
                name: newPlaylist.name,
                public: newPlaylist.public,
                creator: user._id.toString()
            }
            let res = await axios.post(axiosLink + '/test', body)
            // //console.log('response from the saving is', res)
            let tempUser = { ...user }
            // //console.log(tempUser)
            tempUser.saved.push(res.data.test._id.toString())
            try {
                await axios.put(axiosLink + '/user/' + user._id.toString(), { saved: tempUser.saved })
                message.success('Successfully created a personal playlist', 3)
            } catch (updateError) {
                //console.log(updateError)
                message.error('Couldn\'t created a personal playlist', 3)
            }
            setUser(tempUser)
            // //console.log(tempUser)
        } catch (newPlaylistError) {
            // //console.log(newPlaylistError)
        }
    }


    useEffect(() => {
        if (loggedIn === undefined) {
            navigate('/home')
        }
        //console.log(user.saved)
        if (user.saved !== undefined) {
            setPlaylistTests(user.saved)
        }
    }, [])

    const searchBar = () => {
        return (
            <div className=' rounded-md border-2 border-gray-300 p-2'>

                <input type="text" onChange={(e) => {
                    setNewPlaylist({ name: e.target.value, public: false })
                }}
                    className=' px-2 focus:outline-none border-2 border-gray-600 m-2 rounded-md'
                />
                <button onClick={addPlayList} className='pr-4 mr-4 border-r-2 border-gray-300'>Add new playlist</button>

                {/* <input type="text" onChange={(e) => {
                    setTestSearch(e.target.value)

                }}
                    className=' px-2 focus:outline-none border-2 border-gray-600 m-2 rounded-md'
                /> */}
            </div>
        )
    }

    // function handleSearch() {
    //     // //console.log(user)
    //     if (key === '1') {
    //         let temp = myTests;
    //         if (testSearch !== '') {
    //             temp = user.myTests.filter((t) => {
    //                 return t.name.startsWith(testSearch)
    //             })
    //         }
    //         setMyTests(temp)
    //     } else if (key === '2') {
    //         let temp = continueTests;
    //         if (testSearch !== '') {
    //             temp = user.continueTests.filter((t) => {
    //                 return t.name.startsWith(testSearch)
    //             })
    //         }
    //         setContinueTests(temp)
    //     } else {
    //         let temp = playlistTests;
    //         if (testSearch !== '') {
    //             temp = user.playlistTests.filter((t) => {
    //                 return t.name.startsWith(testSearch)
    //             })
    //         }
    //         setPlaylistTests(temp)
    //     }
    // }

    return (
        <div className='bg-base min-h-[100vh]'>
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
            {/* <div className="Header w-full h-[30vh] bg-dark-500 flex items-center justify-center text-white ">
                <div className="text-center">
                    <span className='text-[2.75rem]'>Test Center</span>
                    <br />
                    <p className='text-[1.75rem]'>Manage all your tests - including custom Playlists</p></div>

            </div> */}
            <div className='px-28 py-12 pt-2 '>
                <div className="wrapper h-full">

                    <Tabs defaultActiveKey="1" onChange={(key) => {
                        // //console.log(typeof(key))
                        setKey(key)

                    }} tabBarStyle={{ color: 'black' }}>
                        <TabPane tab="My Tests" key="1">
                            <>
                                {/* {searchBar()} */}
                                <div className='grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-10 mt-3'>
                                    {user.myTests !== undefined ? <>{user.myTests.slice().reverse().map((test, index) => {
                                        // //console.log(index, test)
                                        return (
                                            <div className="test" key={index}>
                                                <TestCard testId={test} starts={testSearch} />
                                            </div>
                                        )
                                    })}</> : undefined}

                                </div>
                            </>
                        </TabPane>
                        <TabPane tab="Continue Practicing" key="2">
                            <>

                                {/* {searchBar()} */}
                                <div className='grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-10 mt-3'>
                                    {user.continueTests !== undefined ? <>{user.continueTests.slice().reverse().map((test, index) => {
                                        // //console.log(index, test)
                                        return (
                                            <div className="test" key={index}>
                                                <TestCard testId={test} starts={testSearch} />
                                            </div>
                                        )
                                    })}</> : undefined}
                                </div>
                            </>
                        </TabPane>
                        <TabPane tab="My Playlists" key="3">
                            <>

                                {searchBar()}
                                <div className='grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-10 mt-3'>

                                    {user.saved !== undefined ? <>{user.saved.slice().reverse().map((test, index) => {
                                        console.log(index, test)
                                        return (
                                            <div className="test" key={index}>
                                                <TestCard testId={test} starts={testSearch} canChange={true} />
                                            </div>
                                        )
                                    })}</> : undefined}
                                </div>
                            </>
                        </TabPane>
                    </Tabs>
                </div>


            </div>
        </div>
    )
}

export default TestCenter