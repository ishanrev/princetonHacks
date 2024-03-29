import React, { useState, useEffect, useContext } from 'react'
import { Tabs, Progress, Carousel, Drawer, notification } from 'antd'
import { PlusOutlined, UserOutlined, MinusOutlined, DeleteOutlined } from '@ant-design/icons'
import { Bar } from 'react-chartjs-2';
import { SocketContext, UserContext, LoggedInContext } from '../../contexts';
import axios from 'axios';
import axiosLink from '..//../axiosInstance';
import { Image } from 'cloudinary-react'
const ALT_IMAGE = "https://res.cloudinary.com/dhlxchjon/image/upload/v1658670857/user-icon_t5lgwl.png"

function ChalengeFriendDrawer({ showFriendsDrawer, setShowFriendsDrawer, testId }) {
    const socket = useContext(SocketContext)
    const { user } = useContext(UserContext)
    const [challengeFriendSearch, setChallengeFriendSearch] = useState('')
    const [challengeTest, setChallengeTest] = useState('')
    const [challengeFriends, setChallengeFriends] = useState([])
    const [hover, setHover] = useState([])
    const [friendsUserNames, setfriendsUserNames] = useState([])
    const [friendsEmails, setfriendsEmails] = useState([])
    const [friendsImgs, setfriendsImgs] = useState([])


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
            } catch (updateError) {
                console.log(updateError)
                break;
            }
        }
        setfriendsUserNames(temp)
        setfriendsEmails(temp2)
        setfriendsImgs(temp3)
    }

    useEffect(() => {
        initializeUserNames()
    }, [user.friends])
    const sendChallenge = () => {
        console.log(testId)

        if (challengeFriends[0] !== undefined) {

            socket.emit("challenge", { fromId: user._id, toId: challengeFriends[0], testId })
            notification.success({
                message: "Successful",
                description: " Challenge successfully sent to " + friendsUserNames[user.friends.friends.indexOf(challengeFriends[0])]
            })
        } else {
            notification.error({
                message: "Error",
                description: "Please choose a friend"
            })
        }
    }
    return (
        <div>
            <Drawer
                title="Challenge a friend"
                placement='right'
                closable={false}
                onClose={() => { setShowFriendsDrawer(false) }}
                visible={showFriendsDrawer}
                key='right'
            >
                <div className="choose-friend">
                    Choose a friend
                    {/* <div className="chosenFriends my-3 grid grid-cols-2 gap-2">
                        {challengeFriends.map((friend, index) => {

                            return (
                                <div className="p-2  px-3 rounded-3xl w-full h-10 flex gap-3 text-white
                                bg-dark-500" key={index}
                                    onMouseEnter={() => {
                                        let temp = [...hover]
                                        temp[index] = true
                                        setHover(temp)
                                    }}
                                    onMouseLeave={() => {
                                        let temp = [...hover]
                                        temp[index] = false
                                        setHover(temp)
                                    }}
                                >
                                    {hover[index] === true ?
                                        <div className="deleteSignIn w-full h-full flex
                                     justify-center items-center transition cursor-pointer "
                                            onClick={() => {
                                                let temp = challengeFriends.filter((fr, ind) => {
                                                    return ind !== index
                                                })
                                                console.log(challengeFriends)
                                                setChallengeFriends(temp)
                                            }}
                                        >
                                            <MinusOutlined />

                                        </div>
                                        : <>
                                            <span className='pl-1 '><UserOutlined /></span>
                                            <span>{friendsUserNames[index]}</span>

                                        </>}
                                </div>
                            )
                        })}

                    </div> */}
                    {/* <form action="#" autoComplete='off' > */}

                    <div className="chosenFriends my-3 flex gap-2">
                        <div className="p-2  px-3 rounded-3xl w-4/5 h-10 flex gap-3 text-white
                                bg-dark-500">
                            <span className='pl-1 '><UserOutlined /></span>
                            <span>{friendsUserNames[challengeFriends[0]]}</span>
                        </div>
                        <button onClick={() => {
                            let temp = []
                            setChallengeFriends(temp);
                        }}
                            className="rounded-md border-2 hover:bg-dark-200 px-2 -mb-1"><DeleteOutlined /></button>
                    </div>


                    <input type="text" name="" id="name" className="questionName bg-gray-50 border 
                        border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                        focus:border-blue-500 block w-full p-2.5 my-3 focus:outline-none"
                        onChange={(e) => { setChallengeFriendSearch(e.target.value) }}
                        autoComplete="new-password"
                    />
                    {/* </form> */}

                    <div className="searchBox h-[350px] w-full rounded-lg border-2 p-3 overflow-y-scroll border-gray-300">
                        {user.friends.friends.map((friend, index) => {
                            let display = false
                            {/* if (friendsUserNames[index] !== undefined) { */ }

                            if (friendsUserNames[friend]!==undefined &&friendsUserNames[friend].startsWith(challengeFriendSearch)) {
                                display = true
                            }

                            return (
                                <>
                                    {display === true ?
                                        <>
                                            <div className="wrapper flex justify-between items-center" key={index}>

                                                <div className="friend flex mb-2" key={index}>
                                                    {/* <img src="https://picsum.photos/50" alt="img" className="profilePic w-9 h-9 mr-2 mt-2 rounded-[100%] object-cover" /> */}
                                                    <Image
                                                        style=
                                                        {{
                                                            width: '2.25rem',
                                                            height: '2.25rem',
                                                            marginRight: '0.50rem',
                                                            marginTop: '0.50rem',
                                                            borderRadius: '100%',
                                                            objectFit: 'cover'
                                                        }}
                                                        cloudName="hextree" publicId={friendsImgs[friend] !== undefined ? friendsImgs[friend] : ALT_IMAGE} />
                                                    <div className="details">
                                                        <span>{friendsUserNames[friend]}</span>
                                                        <br />
                                                        <span className='text-[11px]'>{friendsEmails[friend]}</span>
                                                    </div>
                                                </div>
                                                <button className='add friend border-2 rounded-[100%] 
                                        w-10 h-10 border-gray-300 pt-[0.3rem] pb-3 hover:bg-slate-200'
                                                    onClick={() => {
                                                        if (challengeFriends.includes(friend) === false) {

                                                            // let temp = [...challengeFriends, friend]
                                                            let temp = [friend];
                                                            setChallengeFriends(temp)
                                                        }
                                                    }}
                                                >
                                                    <PlusOutlined />
                                                </button>
                                            </div>
                                            <div className="hr w-full h-[1px] bg-gray-300 rounded-3xl">

                                            </div>
                                        </>
                                        : undefined}
                                </>
                            )
                        })}

                    </div>
                </div>
                {/* <div className="choose-test">
                    Choose the Test
                    <input type="text" name="" id="name" className="questionName bg-gray-50 border 
                        border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                        focus:border-blue-500 block w-full p-2.5 my-3 focus:outline-none"
                        onChange={(e) => { setChallengeTest(e.target.value) }}
                    />
                    <div className="searchBox h-[200px] w-full rounded-lg border-2 border-gray-300">

                    </div>
                </div> */}
                <div className="items-center flex justify-center h-[50px]">

                    <button className="sendChallenge px-2 w-full py-2 mt-1 rounded-lg border-dark-500
                     border-2 text-lg hover:bg-primary-300 " onClick={sendChallenge}>
                        Send Challenge
                    </button>
                </div>
            </Drawer>
        </div>
    )
}

export default ChalengeFriendDrawer