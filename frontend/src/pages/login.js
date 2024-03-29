import axios from 'axios'
import React, { useState, useEffect, useContext } from 'react'
import axiosLink from '../axiosInstance'
import { LoggedInContext, SocketContext, UserContext } from '../contexts'
import { useNavigate } from 'react-router-dom'
import { Spin } from 'antd'
function Login() {
    const { loggedIn, setLoggedIn } = useContext(LoggedInContext)
    const navigate = useNavigate()
    const { user, setUser } = useContext(UserContext)
    const socket = useContext(SocketContext)
    const [emailId, setEmailId] = useState('')
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState(false)
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('second')
    const [loggedInMessage, setLoggedInMessage] = useState(undefined)
    // const [loggedIn, setLoggedIn] = useState(undefined)
    const [remember, setRemember] = useState(false)
    const [loading, setLoading] = useState(false)
    const input = 'bg-gray-100 rounded-lg px-2 py-2 w-full focus:outline-none border-2 border-gray-200 '

    useEffect((() => {
        setLoggedIn(undefined)
    }), [])

    function checkPassword() {
        let chk = false
        if (password.length < 6) {
            chk = true
            setPasswordError(true)
            setPasswordErrorMessage('Minimum password length is 6')
        }
        else if (password.includes(' ')) {
            chk = true
            setPasswordError(true)
            setPasswordErrorMessage('No spaces allowed')
        }
        else {
            setPasswordError(false)
        }
        return chk
    }
    async function handleSignIn() {
        //console.log(loggedIn)

        const _MS_PER_DAY = 1000 * 60 * 60 * 24
        let chk = checkPassword()
        if (chk === false) {
            let data = {
                emailId,
                password
            }
            try {
                setLoading(true)
                let { data: res } = await axios.post(axiosLink + '/auth/login', data)
                if (res.loggedIn === true) {

                    let tempUser = res.user

                    //progress new days configurations
                    let currentDate = new Date();
                    let lastLoggedIn = tempUser.lastLoggedIn;
                    if (lastLoggedIn === undefined) {
                        lastLoggedIn = new Date("2022-7-9")
                    }
                    let utc1 = Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
                    let utc2 = Date.UTC(lastLoggedIn.getFullYear(), lastLoggedIn.getMonth(), lastLoggedIn.getDate())
                    let numDays = Math.floor((utc1 - utc2) / _MS_PER_DAY)

                    let tempProgress = tempUser.dailyProgress;
                    for (let x = 0; x < numDays; x++) {
                        tempProgress.push({
                            numQuestionsCompleted: 0,
                            pointsCollected: 0
                        })
                    }

                    tempUser.dailyProgress = tempProgress

                    setUser(tempUser)
                    socket.emit("save userId", { userId: tempUser._id.toString() })

                    if (remember === true) {

                        localStorage.setItem("userId", tempUser._id.toString())
                    }else{
                        localStorage.setItem("userId", "")
                        
                    }
                    setLoggedIn(true)
                    setLoggedInMessage('successfully logged in')
                    
                    setTimeout(() => {
                        navigate('/dashboard')
                    }, 2000)

                } else if (res.loggedIn === false) {
                    setLoggedIn(false)
                    setLoggedInMessage('incorrect username or password')
                }
                //console.log('res', res)
            } catch (loginError) {
                //console.log(loginError.message)
                setLoggedIn(false)
                setLoggedInMessage('incorrect username or password')
            }
            setLoading(false)

        }
    }


    return (
        <div onKeyDown={(e)=>{if(e.key ==='Enter'){handleSignIn()}}} className="singIn min-h-screen flex justify-center items-center bg-dark-500">
            <div className="wrapperBox h-[auto] w-1/3 bg-white shadow-2xl rounded-lg p-8">
                <h1 className='text-3xl'>Login into your account</h1>

                <div className='my-3'>
                    <label htmlFor="emailId">Email</label>
                    <input type="email" className={'' + input} name="" id="emailId" onChange={(e) => setEmailId(e.target.value)} />
                </div>
                <div className='my-3'>
                    <label htmlFor="password">Password</label>
                    <input type="password" className={'' + input} name="" id="password"
                        onChange={(e) => { setPassword(e.target.value) }} />
                    {passwordError === true ? <span className="text-red-700">{passwordErrorMessage}</span> : undefined}
                    {loggedIn === true ? <h3 className='w-full p-2 bg-green-200 rounded-lg my-4 border-2 border-green-300'>{loggedInMessage}</h3> : loggedIn === false ?
                        <h3 className='w-full p-2 bg-red-200 rounded-lg my-4 border-2 border-red-300'>{loggedInMessage}</h3> : undefined}
                </div>
                <div className='flex justify-between mt-10'>
                    <div className='py-2'>
                        <input type="checkbox" name="" id="rememberMe" className='' onChange={(e) => { setRemember(e.target.value) }} />
                        <label htmlFor="rememberMe" className='ml-2 cursor-pointer'>Remember Me?</label>
                    </div>
                    <div className='w-[50px]  py-2 px-2 hover:cursor-pointer text-white rounded-3xl bg-sub-500    hover:bg-yellow-200'>

                        <Spin spinning={loading}>
                            <button  className=''
                                onClick={handleSignIn}>Login</button>
                        </Spin>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login