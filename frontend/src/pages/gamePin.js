import { Modal } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SidebarDrawer from '../components/General/sidebarDrawer'
import { LoggedInContext, SocketContext, UserContext } from '../contexts'


function GamePinPage() {
    let navigate = useNavigate()
    const socket = useContext(SocketContext)
    let { user } = useContext(UserContext)
    const { loggedIn, setLoggedIn } = useContext(LoggedInContext)

    const [gamePin, setGamePin] = useState('')
    const [name, setName] = useState('')
    const [participants, setParticipants] = useState([1, 2, 3, 4])
    const [stage, setStage] = useState(0)
    const joinGame = () => {
        if (name !== '') {
            socket.emit("join game", { requestId: user._id, gamePin, requestName: name })
        }

    }

    const [showRemovedModal, setShowRemovedModal] = useState(false)

    useEffect(() => {
        socket.on("game created", ({ message, game }) => {
            
            navigate(`/game/${game.id}`)
        })
        socket.on("joined game", ({ id: gameId }) => {
            navigate(`/game/${gameId}`)
        })
        if (loggedIn === undefined) {
            navigate('/home')
        }

    }, [])


    return (
        <div className='bg-base'>
            <div className='h-14'></div>

            <div className=" h-[15vh] rounded-lg shadow-xl bg-dark-500 border-2 border-sub-300  mx-[110px]  
       px-10 flex justify-between items-center text-center gap-12 ">
                <SidebarDrawer />
                <div className='flex justify-center items-center pr-[45%]'>

                    <span className=' text-2xl text-white'>
                        JOIN A GAME
                    </span>
                </div>
            </div>
            {/* {showRemovedModal===true?removedModal():undefined} */}

            <div className="wrapper flex justify-center items-center h-[80vh] text-[1.1rem] ">


                <div className="enterGamePin w-1/3 p-10 border-2 border-dark-500 rounded-lg shadow-lg">
                    {stage === 0 ? <>
                        <div className="transition ease-out duration-300">
                            Enter the game pin here
                            <input type="text" name="" id="name" className="questionName bg-gray-50 border 
                        border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                        focus:border-blue-500 block w-full p-2.5 my-3 focus:outline-none"
                                autoComplete="new-password"
                                onChange={(e) => { setGamePin(e.target.value) }}
                            />
                            <div className="buttonsForJoiningAGame flex justify-around pt-6 ">
                                <button onClick={() => { setStage(1) }} className='bg-dark-500 shadow-lg text-white rounded-lg p-3'>Next</button>
                            </div>
                        </div>

                    </>
                        : <>
                            <div className="transition ease-in duration-300 ">
                                Enter the your name
                                <input type="text" name="" id="name" className="questionName bg-gray-50 border 
                        border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                        focus:border-blue-500 block w-full p-2.5 my-3 focus:outline-none"
                                    maxLength="14"
                                    autocomplete="new-password"
                                    onChange={(e) => {
                                        if (e.target.value.length <= 14) {
                                            setName(e.target.value)
                                        }
                                    }}
                                />
                                <div className="buttonsForJoiningAGame flex justify-around pt-6 ">
                                    <button onClick={joinGame} className='bg-dark-500 shadow-lg text-white rounded-lg p-3'>Join Game</button>
                                    <button onClick={() => { setStage(0) }} className='bg-dark-500 shadow-lg text-white rounded-lg p-3'>Back</button>
                                </div>
                            </div>
                        </>}




                </div>
            </div>
        </div>
    )
}

export default GamePinPage