import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SocketContext, UserContext } from '../../contexts'
import { PlusOutlined, UserOutlined, MinusOutlined } from '@ant-design/icons'
import SidebarDrawer from '../General/sidebarDrawer';
import { message } from 'antd';


function GameWaitingRoom({ participants, pin, game, setGame, host, participantNames }) {
    // console.log("main game: ", game)
    const navigate = useNavigate();
    const { user } = useContext(UserContext)
    const socket = useContext(SocketContext)
    const [hover, setHover] = useState([])
    useEffect(() => {
        let temp = []
        for (let par of participants) {
            temp.push('')
        }
        setHover(temp)


        socket.on('refresh game info', ({ }) => {

        })
        
    }, [])

    const removePlayer = (removeId) => {

    }
    const startGame = () => {
        console.log('entered the start game function')
        if (participants.length === 0) {
            console.log('shouldve reached here bro')
            message.error("There are not participats currently in the game, please wait")
            return;
        }
        socket.emit("start game", { gameId: game.id })
    }
    const leaveGame = () => {
        socket.emit("leave game", { gameId: game.id, removeId: user._id.toString() })
        navigate('/dashboard')
    }
    return (
        <div className='Game Waiting Room p-24 h-[100vh] bg-base from-purple-100 to-orange-100 waitings-room-img'>
            <div className="container w-full h-full bg-sub-200 from-purple-200 to-orange-300 flex gap-2 -z-30 rounded-lg 
            border-2 border-dark-500">

                <div className="participants overflow-y-scroll w-1/4 bg-[#fafafa] rounded-lg rounded-r-none p-4 ">
                    {participants.map((part, index) => {
                        return (
                            <>
                                {host === true ?
                                    <div className={"border-2 border-dark-500 h-[76px] mb-3 rounded-lg p-3 hover:cursor-pointer " +
                                        hover[index]} key={index}

                                        onMouseEnter={() => {
                                            let temp = [...hover]
                                            temp[index] = "bg-primary-200"
                                            setHover(temp)
                                        }}
                                        onMouseLeave={() => {
                                            let temp = [...hover]
                                            temp[index] = ""
                                            setHover(temp)
                                        }}
                                        onClick={() => {
                                            if (hover[index] === "bg-primary-200") {
                                                if (part !== user._id) {

                                                    let temp = participants.filter((par, i) => {
                                                        return index !== i
                                                    })
                                                    let tempGame = { ...game, participants: temp }
                                                    socket.emit("remove player", { removeId: part, gameId: game.id })
                                                    setGame(tempGame)
                                                    removePlayer(part)
                                                }
                                            }
                                        }}
                                    >
                                        {hover[index] === undefined ?
                                            <span className='items-center flex justify-center text-3xl'>
                                                {' ' + participantNames[index]}
                                            </span>
                                            : <span className='items-center flex justify-center text-lg'>
                                                Remove
                                            </span>
                                        }


                                    </div> : <div className={"border-2 border-dark-500 h-[76px] mb-3 rounded-lg p-3 hover:cursor-pointer "} key={index}>

                                        <span className='items-center flex justify-center text-3xl'>
                                            {' ' + participantNames[index]}
                                        </span>

                                    </div>}
                            </>


                        )
                    })}

                </div>
                <div className="gameInfo w-3/4 h-full items-center px-4 py-2 ">
                    <div className="flex justify-between">
                        <span className='mt-1'><SidebarDrawer dark /></span>
                        <div className='header flex justify-end h-[40px] gap-2'>

                            <div className="noOfParticipants  p-1 px-2 rounded-lg border-2 bg-fa border-dark-500 text-[1rem] 
                        hover:bg-primary-300 hover:text-slate-500 hover:text-orage-700">
                                <span className='participants icon px-'>
                                    <UserOutlined />
                                </span>
                                <span className='pl-2 pt-1'>{'' + participants.length}</span>
                            </div>
                            {host === true ? <button className="endGame p-1 px-2 rounded-lg border-2 bg-fa border-dark-500 text-[1rem] 
                        hover:bg-primary-300 hover:text-slate-500 hover:text-orage-700"
                                onClick={() => {
                                    socket.emit("end game", { gameId: game.id })
                                    navigate('/dashboard')
                                }}>

                                END
                            </button>
                                : <button className="endGame p-1 px-2 rounded-lg border-2 bg-fa border-dark-500 text-[1rem] 
                        hover:bg-primary-300 hover:text-slate-500 hover:text-orage-700"
                                    onClick={leaveGame}>

                                    LEAVE
                                </button>}

                        </div>
                    </div>

                    <div className="content items-center  text-center">

                        {/* <span className=' text-[1rem]'>Host: {game.host} <br /></span>
                        <span className=' text-[3rem]'>Your room code:{'          '}</span> */}
                        <span className='block p-2 py-5 text-lg '>To join the quiz use this code</span>
                        <span className=' text-[3rem]  p-2 rounded-lg bg-white'>{pin}</span>
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        {/* <div className="buttons flex gap-2 justify-center text-center h-full items-center w-1/3"> */}

                        {host === true ?
                            <button className='p-3 rounded-lg border-2 bg-fa border-dark-500 text-[1.5rem] 
                        hover:bg-primary-300 hover:text-slate-500 hover:text-orage-700'
                                onClick={() => {
                                    startGame()
                                }}
                            ><b>START GAME NOW</b></button>
                            : undefined
                        }

                        {/* <button className='p-3 rounded-lg bg-yellow-300 text-[1rem]'>OTHER</button> */}
                        {/* </div> */}
                    </div>
                </div>
            </div>

        </div >
    )
}

export default GameWaitingRoom