import React, { useState, useEffect, useContext } from 'react'
import SideBar from '../components/General/sidebar'
import { Tabs, Progress, Carousel, Drawer, notification, Modal, Spin, Empty, Tooltip } from 'antd'
import { PlusOutlined, UserOutlined, MinusOutlined, CheckOutlined, CloseOutlined, Badge, EditOutlined, UploadOutlined } from '@ant-design/icons'
import { Bar } from 'react-chartjs-2';
import DynamicChart from '../components/General/tester';
import { BarChartComp } from '../components/General/Charts'
import { SocketContext, UserContext, LoggedInContext } from '../contexts';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import axiosLink from '../axiosInstance';
import ChalengeFriendDrawer from '../components/General/chalengeFriendDrawer';
import { TestCard } from './browseTests';
import { Image } from 'cloudinary-react'
import basicBadge from '../images/basicBadge.png'
import mediumBadge from '../images/mediumBadge.png'
import proBadge from '../images/proBadge.png'
import masterBadge from '../images/masterBadge.png'
import expertBadge from '../images/expertBadge.png'

const apiKey = 'sk_live_b7148d24-c106-414b-be1b-28e6bf2cd1a0'
const contractAddress = '0x41e0F19FaC825088622Ce524Acae49160d8c8B5D'

const badges = [
    { id: 1, name: "basicBadge", ipfsLink: "ipfs://QmSHMoTTY4h8gZjXruL931RZ4nnRR33veCAZj39TuUUFaA", image: basicBadge, num: 3 },
    { id: 2, name: "mediumBadge", ipfsLink: "ipfs://QmbdttjUjvZzYQaTE3PAAyQQwcAGBqYJA2nv3a6r1Nk6gS", image: mediumBadge, num: 5 },
    { id: 3, name: "proBadge", ipfsLink: "ipfs://QmPi3vz6mwVAgrTGooKpGnpcShSRbXqiRovb7CdPjTKp17", image: proBadge, num: 10 },
    { id: 4, name: "masterBadge", ipfsLink: "ipfs://QmXfG3BdWgJp6hWpvmGciohgrbCesvJoRkDRA4ScXH3x4J", image: masterBadge, num: 50 },
    { id: 5, name: "expertBadge", ipfsLink: "ipfs://QmYk7zcoBKD9XrrC7tnpKfkW3c79FohpWtc4zELFG8ochK", image: expertBadge, num: 100 },
];

const completedCourses = 3;

async function checkCoursesAndMintBadge(userId) {
    let badgeURI = '';
    if (completedCourses >= 3) {
        badgeURI = "ipfs://QmSHMoTTY4h8gZjXruL931RZ4nnRR33veCAZj39TuUUFaA";
    } else if (completedCourses >= 5) {
        badgeURI = "ipfs://QmbdttjUjvZzYQaTE3PAAyQQwcAGBqYJA2nv3a6r1Nk6gS";
    } else if (completedCourses >= 10) {
        badgeURI = "ipfs://QmPi3vz6mwVAgrTGooKpGnpcShSRbXqiRovb7CdPjTKp17";
    } else if (completedCourses >= 50) {
        badgeURI = "ipfs://QmXfG3BdWgJp6hWpvmGciohgrbCesvJoRkDRA4ScXH3x4J";
    } else if (completedCourses >= 100) {
        badgeURI = "ipfs://QmYk7zcoBKD9XrrC7tnpKfkW3c79FohpWtc4zELFG8ochK";
    } else {
        return;
    }

    await mintBadge(userId, badgeURI);
}

async function mintBadge(userId, badgeURI) {
    const form = new FormData();
    form.append("chain", "goerli");
    form.append("contractAddress", contractAddress);
    form.append("tokenURI", badgeURI);
    // Assuming 'userId' can be mapped to a wallet address or similar
    // You may need to adjust based on your application's user identification logic
    form.append("toAddress", userId); // Ensure this is the user's wallet address

    const options = {
        method: "POST",
        headers: {
            "X-API-Key": apiKey,
            // Add any other headers required by VerbWire
        },
        body: form,
    };

    try {
        const response = await fetch("https://api.verbwire.com/v1/nft/mint", options);
        const data = await response.json();
        console.log(data); // Log the response for debugging
    } catch (error) {
        console.error(`Error minting badge: ${error}`);
    }
}





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


function Dashboard() {
    const navigate = useNavigate()
    const { user, setUser } = useContext(UserContext)
    const socket = useContext(SocketContext)
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

    useEffect(() => {

        socket.on("game created", ({ message, game }) => {
            //console.log(message)
            //console.log('game details')
            //console.log(game)

        })
        let log = localStorage.getItem("loggedIn")
        if (log === undefined) {
            navigate('/login?#')
        }

        initializeUserNames()
    }, [])

    useEffect(() => {

        socket.on("game created", ({ message, game }) => {
            //console.log(message)
            //console.log('game details')
            //console.log(game)

        })
        let log = localStorage.getItem("loggedIn")
        if (log === false) {
            navigate('/login?#')
        }

        initializeUserNames()
    }, [])

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


    const accept = (friend) => {
        socket.emit("accept friend request", { fromId: friend, toId: user._id.toString() })
    }
    const decline = (friend) => {

    }

    const renderFriends = (type) => {
        return (
            <div>
                {user.friends[type].map((friend, index) => {
                    return (
                        <>
                            <div className="wrapper mb-5" key={index}>

                                <div className="friend flex mb-2">
                                    {/* <img src="https:picsum.photos/50" alt="img" className="profilePic w-9 h-9 mr-2 mt-2 rounded-[100%] object-cover" /> */}
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
                                        {type === 'requests' ? <div className=''>
                                            <br />
                                            <button className='p-2 rounded-md bg-primary-200 mr-2' onClick={() => accept(friend)}>Accept</button>
                                            <button className='p-2 rounded-md bg-primary-200' onClick={() => decline(friend)}>Decline</button>
                                        </div>
                                            : undefined}
                                    </div>
                                </div>
                                <div className="hr w-full h-[1px] bg-gray-300 rounded-3xl">

                                </div>
                            </div>
                        </>
                    )
                })
                }

            </div>
        )

    }



    const sendFriendRequest = () => {
        if (newFriend !== null && user.friends.pending.includes(newFriend) === false && newFriend !== user.emailId) {
            try {

                socket.emit("new friend request", { fromEmail: user.emailId, toEmail: newFriend })
                notification.success({
                    description: `Friend request successfuly sent to ${friendsUserNames[newFriend]}`,
                    message: "Success"
                })
            } catch (err) {
                //console.log(err)
            }
        }
    }

    return (
        <>


            <div className='dashboard flex justify-start '>
                <ChalengeFriendDrawer showFriendsDrawer={showFriendsDrawer} setShowFriendsDrawer={setShowFriendsDrawer}

                />
                <SideBar />
                <div className="main-dashboard bg-base h-[10    0vh] p-7 pt-3 pb-1 w-full overflow-y-scroll ">
                    <span className="text-[2rem] mb-2 mx-2"> Dashboard</span>
                    <div className="top flex jusify-between gap-5 mb-6">
                        <div className="chart w-2/3 h-[300px] animate__animated animate__fadeInUp rounded-lg shadow-lg 
                        items-center p-1  px-3 shad bg-[#fafafa]
                         border-2 border-dark-400 gap-6 pt-5">
                            {/* <div className='flex justify-between'>

                                <span className='text-2xl px-2'>{preview === "challenges" ? "Challenges" : "My Progress"}</span>
                                {previewSwitch}
                            </div> */}
                            {/* <Bar options={options} data={data} />; */}
                            {/* {<BarChartComp />} */}
                            <div className='flex justify-between '>
                                {preview === "challenges" ?
                                    <Challenges challenges={user.challenges} friendsUserNames={friendsUserNames} />
                                    : <>
                                        <div className='px-3'>

                                            <BarChartComp />
                                        </div>
                                    </>}
                            </div>

                        </div>
                        <div className="left bg-[#fafafa]
                         border-2 border-dark-400 row-span-2 
                         h-full w-[50%] p-3 shadow-lg rounded-lg overflow-y-scroll">
                            <span className='text-xl block mb-3'>Badges</span>
                            <div className="hr w-full h-[2px] bg-gray-300 rounded-3xl pl-2 mb-8">
                            </div>
                            <div className="flex justify-between mt-10">
                                {badges.map((badge) => {

                                    let brightness = "brightness-50";
                                    let badgeTitle = `Upon Completion of ${badge.num} courses`;

                                    if ((completedCourses >= 3 && badge.name === "basicBadge") ||
                                        (completedCourses >= 5 && badge.name === "mediumBadge") ||
                                        (completedCourses >= 10 && badge.name === "proBadge") ||
                                        (completedCourses >= 50 && badge.name === "masterBadge") ||
                                        (completedCourses >= 100 && badge.name === "expertBadge")) {
                                        brightness = "brightness-100";
                                        badgeTitle = `Earned: ${badge.name.replace('Badge', '')} badge`;

                                    }
                                    return (
                                        <div key={badge.id} className={'w-1/5 flex justify-center'}>
                                            <Tooltip title={badgeTitle}>
                                                <img src={badge.image} alt={badge.name} className={`${brightness} w-full h-auto`} />
                                            </Tooltip>
                                            {/* <div className="absolute bottom-0 pb-2 pt-1 px-3 bg-black text-white text-xs rounded opacity-0 hover:opacity-100 transition-opacity duration-300 ease-in-out">
                                                {badgeTitle}
                                            </div> */}

                                        </div>
                                    );
                                })}
                            </div>

                        </div>
                    </div>
                    <div className="flex justify-between mt-10">

                        <div className="flex justify-between gap-4 h-[50vh] animate__animated animate__fadeInUp w-[65%]">
                            <div className="left bg-[#fafafa]
                         border-2 border-dark-400 row-span-2 
                         h-full w-[65%] p-3 shadow-lg rounded-lg overflow-y-scroll">
                                <span className='text-xl block mb-3'>Continue practicing</span>
                                <div className="hr w-full h-[2px] bg-gray-300 rounded-3xl pl-2 mb-8">
                                </div>
                                <div className="pl-2">
                                    {user.lastTest !== undefined ?
                                        <TestCard starts='' testId={user.lastTest} small={true} />
                                        : <div className=' items-center flex justify-center'>
                                            <button className='rounded-lg p-2 border-primary-500 text-3xl border-2 hover:bg-primary-500 hover:text-white'
                                                onClick={() => {
                                                    navigate("/browse")
                                                }}
                                            >
                                                Browse Tests Here
                                            </button>
                                        </div>}
                                </div>

                            </div>
                            {/* <div className='right w-[50%] flex flex-col'>
                                <div className="rightTop bg-[#fafafa]
                         border-2 border-dark-400 shadow-lg rounded-lg pt-3 px-3 h-1/2 mb-2  w-full">
                                    <UserInfo />
                                </div> */}

                            {/* <div className="rightBottom  bg-[#fafafa]
                         border-2 border-dark-400 shadow-lg rounded-lg py-3 h-1/2  w-full animate__animated animate__fadeInUp overflow-y-scroll">
                                    <div className="list-of-challenges  ">
                                    </div>
                                </div> */}
                            {/* </div> */}

                        </div>
                        <div className="friend wrapper">

                            <div className="chart w-[320px] border-2 bg-[#fafafa] border-dark-400
                          h-[280px] overflow-y-scroll  rounded-lg shadow-lg p-4 shad ">
                                <div className="tabs ">
                                    <Tabs defaultActiveKey="1" tabBarStyle={{ color: 'black' }} centered>
                                        <TabPane tab="Friends" key='1'>
                                            <div className="friends ">
                                                {renderFriends('friends')}
                                            </div>
                                        </TabPane>
                                        <TabPane tab="Pending" key='2'>
                                            <div className="pending ">
                                                {renderFriends('pending')}
                                            </div>
                                        </TabPane>
                                        <TabPane tab="Requests" key='3'>
                                            <div className="requests ">
                                                {renderFriends('requests')}
                                            </div>
                                        </TabPane>
                                    </Tabs>
                                </div>

                            </div>
                            <div className="newFriend flex gap-2 justify-around mt-3 rounded-lg p-2 border-2 border-slate-200  w-full">
                                <input type="text" name="" id="" className='w-full btn focus:outline-none
                            rounded-md bg-slate-200 px-2 py-1' placeholder='Add A new friend'
                                    onChange={(e) => {
                                        let temp = e.target.value
                                        setNewFriend(temp)
                                    }}
                                />
                                <button className='' onClick={sendFriendRequest}>Add</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div >

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

export default Dashboard