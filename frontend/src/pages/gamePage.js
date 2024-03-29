import { Modal } from 'antd'
import axios from 'axios'
import React, { useState, useContext, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import axiosLink from '../axiosInstance'
import GameWaitingRoom from '../components/Game/gameWaitingRoom'
import { LoggedInContext, SocketContext, UserContext } from '../contexts'
import AnswerStation from './answerStation'
import { PlusOutlined, UserOutlined, MinusOutlined } from '@ant-design/icons'
import Confetti from 'react-confetti'
import Winner from './winner'
import SidebarDrawer from '../components/General/sidebarDrawer'


function GamePage() {
    const navigate = useNavigate()
    const { user } = useContext(UserContext)
    const { id } = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const testId = searchParams.get('testId')
    // game states = ['waiting','answerStation','end']
    const socket = useContext(SocketContext)
    const [section, setSection] = useState('waiting')
    const [game, setGame] = useState({ participants: [] })
    const [host, setHost] = useState(false)
    const gameRef = React.createRef()
    const hostRef = React.createRef()
    const { loggedIn, setLoggedIn } = useContext(LoggedInContext)


    useEffect(() => {
        if (loggedIn === undefined) {
            navigate('/home')
        }
        async function getGame() {
            try {
                const res = await axios.get(axiosLink + '/game/' + id)
                //console.log('game', res)
                let game = res.data.game
                setGame(game)
                gameRef.current = game
                if (game.removed.includes(user._id) === true) {
                    removedModal()
                }
                if (game.host === user._id) {
                    setHost(true)
                    hostRef.current = true
                } else {
                    hostRef.current = false
                }
                socket.on("new player", ({ participants, participantNames }) => {
                    // //console.log('new participants', participants)
                    let temp = { ...res.data.game, participants, participantNames }

                    setGame(temp)
                })

            } catch (gameError) {
                //console.log(gameError)
            }
        }
        getGame()
        return () => {
            endGame()
        }
    }, [])


    const endGame = () => {
        //console.log('trying')
        if (hostRef.current === true) {
            let tempGame = JSON.parse(JSON.stringify(game))
            //console.log("id to be removed" + gameRef.current.id)
            socket.emit("end game", { gameId: gameRef.current.id })
        } else {
            //console.log("id which has left the game" + gameRef.current.id)
            socket.emit("leave game", { gameId: gameRef.current.id, removeId: user._id.toString() })
        }
    }


    useEffect(() => {

        socket.on("start game", ({ game }) => {
            //console.log('client received the start message')

            // if (user._id !== game.host) {
            setSection('answerStation')
            // }
        })
        socket.on("player removed", ({ removeId }) => {
            if (removeId === user._id) {
                removedModal()
            }
        })
        socket.on("game ended", ({ }) => {
            // if (game.host !== user._id.toString()) {

            //console.log("reached client for end game")
            let x = 0
            do {
                Modal.warning({
                    title: "Game Ended",
                    content: "the host has ended the game, please proceed to the dashboard",
                    onOk() { navigate('/dashboard') },
                    okText: 'Exit Game'
                })
                x += 1
            } while (x === 0)
            // }

        })

        socket.on("refresh game info", ({ }) => {
            async function getGame() {
                try {
                    const res = await axios.get(axiosLink + '/game/' + id)
                    //console.log('game', res)
                    let game = res.data.game
                    setGame(game);

                } catch (gameError) {
                    //console.log("gameError", gameError)
                }
            }
            getGame()
        })


    }, [])

    const removedModal = () => {
        Modal.error({
            title: "Removed",
            content: "you have been removed from the game",
            onOk() { navigate('/dashboard') },
            okText: "Go to Dashboard"

        })
    }

    return (
        <div>

            {section === 'waiting' ?
                <GameWaitingRoom participants={game.participants} participantNames={game.participantNames} pin={game.pin} game={game} setGame={setGame} host={host} />
                : undefined}
            {section === 'answerStation' ?
                host === false ?
                    <AnswerStation game={true} tId={game.testId} gameId={game.id} gameObject={game} />
                    : <>
                        <HostPreview game={game} host={host} />
                        {/* BRUH  */}
                    </>
                : undefined}



        </div>
    )
}

const HostPreview = ({ game, host }) => {
    const socket = useContext(SocketContext)
    const { user, setUser } = useContext(UserContext)
    const { participantNames, participants, pin } = game
    let navigate = useNavigate()
    //console.log('participants', participants)
    //console.log('participantsNames', participantNames)
    const [gameFinished, setGameFinished] = useState(false)
    const leaderboard = () => {
        return (
            <div>
                <ul className='p-2 overflow-y-scroll'>
                    {participants.map((par, index) => {

                        {/* let colour = par !== user._id.toString() ? ' border-dark-500' : " border-primary-500 "; */ }
                        {/* let colour2 = par !== user._id.toString() ? ' border-l-dark-500' : " border-l-primary-500"; */ }

                        let colour = par !== user._id.toString() ? ' border-dark-500' : " bg-dark-500 text-white border-dark-500";
                        let colour2 = par !== user._id.toString() ? ' border-l-dark-500' : " border-l-white";
                        if (index > -1) {

                            return (
                                <>

                                    <li key={index} className={'px-2 py-3 my-2 border-2  rounded-lg text-xl overflow-x-hidden' + colour}>
                                        <div className="flex justify-between">
                                            <span className='pl-4'>{participantNames[index] !== undefined ? participantNames[index] : ''}</span>
                                            {/* <div className=''> */}
                                            <div className={'border-l-2  flex justify-center w-1/5' + colour2}>
                                                {/* <span>{scores[par] !== undefined ? scores[par] : ''}</span> */}

                                            </div>

                                            {/* </div> */}
                                        </div>

                                    </li>
                                    {
                                        index === 2 ?
                                            <>
                                                <div className='w-full bg-slate-300 h-[0.3rem] rounded-lg my-4'></div>
                                            </>
                                            : undefined
                                    }
                                </>
                            )
                        } else {
                            return (<li key={index}></li>)
                        }
                    })}

                </ul>
            </div >
        )
    }
    return (
        <div className="hostPreviewPage  flex justify-center items-center h-[100vh] border-2 border-dark-300">
            <div className=" w-1/2">
                {gameFinished === true ? <Confetti width={1000} height={600} initialVelocityX={2} initialVelocityY={3} opacity={0.6} gravity={0.03} />
                    : undefined}
                <div className='header flex justify-between h-[40px] gap-1 w-full mb-24'>
                    <div className="pt-2">
                        <SidebarDrawer dark />
                    </div>


                    <div className="p-1 px-2 rounded-lg border-2 bg-fa border-dark-500 text-[1rem] 
                        hover:bg-primary-300 hover:text-slate-500 hover:text-orage-700">Pin: {' ' + pin}</div>
                    <div className="noOfParticipants  p-1 px-2 rounded-lg border-2 bg-fa border-dark-500 text-[1rem] 
                        hover:bg-primary-300 hover:text-slate-500 hover:text-orage-700">
                        <span className='participants icon px-'>
                            <UserOutlined />
                        </span>
                        <span className='pl-2 pt-1'>{'' + participants.length}</span>
                    </div>
                    <button className="endGame p-1 px-2 rounded-lg border-2 bg-fa border-dark-500 text-[1rem] 
                        hover:bg-primary-300 hover:text-slate-500 hover:text-orage-700"
                        onClick={() => {
                            //console.log("bruh")
                            socket.emit("game winner", { gameId: game.id })
                            setGameFinished(true)
                        }}>

                        End Game
                    </button>


                </div>
                {/* <div className=' animate__animated animate__heartBeat text-3xl text-dark-500 text-center '>Winner: {' ' + participantNames[0].toUpperCase()}</div>

                {leaderboard()} */}
                {gameFinished === true ? <Winner game={game} mode='game' /> : <> {leaderboard()}</>}
            </div>
        </div >
    )
}
{/* <button
                    className='bp-2 bg-slate-300 text-black border-2 border-slate-600 active:border-4'
                    onClick={() => {
                        //console.log("bruh")
                        socket.emit("game winner", { gameId: game.id })
                    }}> End Game </button> */}
export default GamePage