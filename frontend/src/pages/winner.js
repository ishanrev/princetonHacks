import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import axiosLink from '../axiosInstance'
import crownImage from '../images/crownMain.png'
import sadFace from '../images/sadFaceTransparent.png'
import { FrownTwoTone } from '@ant-design/icons'
import Confetti from 'react-confetti'
import { UserContext } from '../contexts'

//  Game Images 
import bronze from '../images/bronze.png'
import silver from '../images/silver.png'
import gold from '../images/gold.png'
//  Game Images 


function Winner({ mode, winners = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], game = {} }) {
    const { user } = useContext(UserContext)
    const [winnersInfo, setWinnersInfo] = useState([{ name: '' }, { name: '' }, { name: '' }])
    const { participants = [{ name: '' }, { name: '' }, { name: '' }], participantNames = ['', '', ''], scores, host } = game;
    useEffect(() => {

        //console.log(winners)
        let fetchUsers = async () => {
            //console.log('trying')
            //console.log(winners)
            let temp = []
            for (let winId of winners) {
                try {
                    let user = await (await axios.get(axiosLink + '/user/' + winId.toString())).data.user
                    //console.log(user)
                    temp.push(user)
                } catch (fetchUserError) {
                    //console.log(fetchUserError)
                }
            }
            setWinnersInfo(temp)
        }
        fetchUsers()
        //console.log('./././../././././..///../')
    }, [])

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

                                    <li className={'px-2 py-3 my-2 border-2  rounded-lg text-xl overflow-x-hidden' + colour}>
                                        <div className="flex justify-between">
                                            <span className='pl-4'>{participantNames[index]}</span>
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
                            return (<></>)
                        }
                    })}

                </ul>
            </div >
        )
    }

    return (
        <><div className=''>

            {participants.indexOf(user._id.toString()) >= 0 && participants.indexOf(user._id.toString()) <= 2 ?
                <Confetti width={1000} height={600} initialVelocityX={2} initialVelocityY={3} opacity={0.6} gravity={0.03} />
                : undefined}

            <div className=' animate__animated animate__heartBeat text-3xl text-dark-500 text-center '>Winner: {'\n' + mode === 'challenge' ? winnersInfo[0].name.toUpperCase() : participantNames[0].toUpperCase()}</div>
            <br /><br />
            <div className='bg-base flex justify-center items-center gap-10 w-full h-full rounded-lg animate__animated animate__fadeInUp '>
                {winners[0] === undefined ? <></> : winners[0] === user._id.toString() ?
                    <Confetti width={1000} height={600} initialVelocityX={2} initialVelocityY={3} opacity={0.6} gravity={0.03} />

                    : undefined}
                {mode === 'challenge' ?

                    <>
                        <div>
                            <div className="winner-card-one text-center h-56 w-48 mb-4 rounded-lg border-2 border-dark-500 animate__animated animate__bounce crownBounce animate__infinite">
                                <div className='img-area h-4/5 w-full' >
                                    {/* <img src="../../public/crownMain.png" alt="Crown" /> */}
                                    <img src={crownImage} alt="Crown" className=' animate__animated animate__bounce' />
                                </div>
                                {/* <div className='text-3xl text-center items-center border-t-2 w-full border-dark-500' > */}
                                <div className='tex text-center items-center w-full ' >
                                    <span className='text-xl'>

                                        {winnersInfo[0] !== undefined ? winnersInfo[0].name : ''}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="winner-card-two text-center h-56 w-48 mb-4 rounded-lg border-2 border-dark-500">
                                <div className='img-area h-4/5 pt-6 items-center' >
                                    <FrownTwoTone style={{ fontSize: '7rem' }} twoToneColor="#78938A" />
                                    {/* <img src={sadFace} alt="Sad Face" /> */}
                                </div>
                                {/* <div className='text-3xl text-center items-center border-t-2 w-full border-dark-500' > */}
                                <div className=' text-center items-center w-full ' >
                                    <span className='text-xl'>

                                        {winnersInfo[1] !== undefined ? winnersInfo[1].name : ''}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </>
                    : <>
                        <div>
                            <div className="winner-card-one text-center h-28 w-24 mb-4 rounded-lg border-2 border-dark-500 animate__animated animate__bounce crownBounce animate__infinite">
                                <div className='img-area flex justify-center h-4/5 w-full' >
                                    {/* <img src="../../public/crownMain.png" alt="Crown" /> */}
                                    <img src={gold} alt="Crown" className=' w-[5rem] animate__animated animate__bounce' />
                                </div>
                                {/* <div className='text-3xl text-center items-center border-t-2 w-full border-dark-500' > */}
                                <div className='tex text-center items-center w-full ' >
                                    <span className='text-md'>

                                        {participantNames[0] !== undefined ? participantNames[0] : undefined}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="winner-card-two text-center h-28 w-24 mb-4 rounded-lg border-2 border-dark-500">
                                <div className='img-area flex justify-center h-4/5  items-center' >
                                    {/* <FrownTwoTone style={{ fontSize: '5rem' }} twoToneColor="#78938A" /> */}
                                    <img src={silver} alt="Sad Face" className='w-[5rem] object-cover' />
                                </div>
                                {/* <div className='text-3xl text-center items-center border-t-2 w-full border-dark-500' > */}
                                <div className=' text-center items-center w-full ' >
                                    <span className='text-md'>

                                        {participantNames[1] !== undefined ? participantNames[1] : undefined}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="winner-card-two text-center h-28 w-24 mb-4 rounded-lg border-2 border-dark-500">
                                <div className='img-area flex justify-center h-4/5  items-center' >
                                    {/* <FrownTwoTone style={{ fontSize: '3rem' }} twoToneColor="#78938A" /> */}
                                    <img src={bronze} alt="Sad Face" className='w-[5rem] object-cover' />
                                </div>
                                {/* <div className='text-3xl text-center items-center border-t-2 w-full border-dark-500' > */}
                                <div className=' text-center items-center w-full ' >
                                    <span className='text-md'>

                                        {participantNames[2] !== undefined ? participantNames[2] : undefined}
                                    </span>
                                </div>
                            </div>
                        </div>

                    </>}
            </div>
            {mode !== 'challenge' ?
                <div className=' '>
                    <div>
                        {leaderboard()}
                    </div>
                </div>
                : undefined}
        </div>
        </>
    )
}

export default Winner