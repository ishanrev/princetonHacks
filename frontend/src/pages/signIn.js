import axios from 'axios'
import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosLink from '../axiosInstance'
import { LoggedInContext, SocketContext, UserContext } from '../contexts'
import { Spin } from 'antd'
import { jwtDecode } from "jwt-decode"; // Use named import instead of default

function SignIn() {
    const { user, setUser } = useContext(UserContext)
    const { loggedIn, setLoggedIn } = useContext(LoggedInContext)
    const socket = useContext(SocketContext)
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [emailId, setEmailId] = useState('')
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState(false)
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('second')
    const [loggedInMessage, setLoggedInMessage] = useState(undefined)
    const [signedUp, setSignedUp] = useState(undefined)
    const [loading, setLoading] = useState(false)
    const input = 'bg-gray-100 rounded-lg px-2 py-2 w-full focus:outline-none border-2 border-gray-200 '

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.onload = () => {
            handleGoogleScriptLoad();
        };
        document.body.appendChild(script);
    }, []);

    function handleCallbackResponse(response) {
        console.log("Encoded JWT ID token: " + response.credential);
        var userObject = jwtDecode(response.credential); // Use the named import jwtDecode
        console.log(userObject);
    }

    function handleGoogleScriptLoad() {
        /* global google */
        google.accounts.id.initialize({
            client_id: "861748259643-bgv61qg3jo0rqjlctdsejqa3evrs8oof.apps.googleusercontent.com", // Ensure you have prefixed your environment variable with REACT_APP_
            callback: handleCallbackResponse,
        });

        google.accounts.id.renderButton(
            document.getElementById("signInDiv"),
            { theme: "outline"}
        );
    }

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
        // async function fetchUser() {
        //     try {
        //         let userId = localStorage.getItem("userId")
        //         //console.log("localStorageUsrId: ", userId)

        //         let res = await axios.get(axiosLink + '/user/' + userId)
        //         let { user } = res.data
        //         //console.log("main user")
        //         //console.log(user)
        //         socket.emit("initiate userId connection", {})
        //         socket.on("request userId", ({ }) => {
        //             // //console.log("ids that im about to goddamn send", user._id)
        //             socket.emit("save userId", { userId: user._id })
        //         })
        //         socket.on("saved socketId", ({ }) => {
        //             // //console.log("ids that im about to goddamn send", user._id)
        //             //console.log('socketId saved in the index.js dictionary')
        //         })
        //         setUser(user)
        //         // const newFriends = {
        //         //     friends: user.friends.friends,
        //         //     pending: user.friends.pending,
        //         //     requests: user.friends.requests
        //         // }
        //         // setFriends(newFriends)

        //     } catch (fetchUserError) {
        //         //console.log(fetchUserError)
        //     }
        // }

        let chk = checkPassword()
        if (chk === false) {
            let data = {
                name,
                emailId,
                password,
                userName: 'defaultserName',
                lastLoggedIn: new Date()
            }
            try {
                setLoading(true)
                let { data: res } = await axios.post(axiosLink + '/auth/signIn', data)
                //console.log(res)
                if (res.success === true) {
                    let tempUser = res.user
                    //console.log(tempUser)
                    socket.emit("save userId", { userId: tempUser._id.toString() })

                    setUser(tempUser)
                    localStorage.setItem("loggedIn", "true")
                    localStorage.setItem("userId", user._id.toString())
                    setSignedUp(true)
                    setLoggedInMessage('successfully created an account')
                    setLoggedIn(true)
                    setTimeout(() => {
                        navigate('/dashboard')
                    }, 2000)
                    // navigate('/dashboard')

                } else if (res.success === false) {
                    setLoggedInMessage('failed to create a new account')
                    setSignedUp(false)
                }
                //console.log('res', res)
            } catch (loginError) {

                setSignedUp(false)
                if (loginError.response.data.type !== undefined) {
                    setLoggedInMessage('user with ths email already id exists')
                } else {
                    setLoggedInMessage('failed to create a new account')
                }
            }
            setLoading(false)
        }
    }

    return (
        <div className="singIn min-h-screen flex justify-center items-center bg-dark-500">
            <div className="wrapperBox h-[auto] w-1/3 bg-white shadow-2xl rounded-lg p-8">
                <h1 className='text-3xl'>Create your account</h1>
                <div className='my-3'>
                    <label htmlFor="name">First Name</label>
                    <input type="text" className={'' + input} name="" id="name"
                        onChange={(e) => { setName(e.target.value) }} />
                </div>
                <div className='my-3'>
                    <label htmlFor="emailId">Email</label>
                    <input type="email" className={'' + input} name="" id="emailId"
                        onChange={(e) => { setEmailId(e.target.value) }} />
                </div>
                <div className='my-3'>
                    <label htmlFor="password">Password</label>
                    <input type="password" className={'' + input} name="" id="password"
                        onChange={(e) => { setPassword(e.target.value) }}
                    />
                    {passwordError === true ? <span className="text-red-700">{passwordErrorMessage}</span> : undefined}
                    {signedUp === true ? <h3 className='w-full p-2 bg-green-200 rounded-lg my-4 border-2 border-green-300'>{loggedInMessage}</h3> : signedUp === false ?
                        <h3 className='w-full p-2 bg-red-200 rounded-lg my-4 border-2 border-red-300'>{loggedInMessage}</h3> : undefined}
                </div>
                <div id="signInDiv"></div>
                <div className='flex justify-between mt-10'>
                    <div className='py-2'>
                        <input type="checkbox" name="" id="rememberMe" className='' />
                        <label htmlFor="rememberMe" className='ml-2 cursor-pointer'>RememberMe?</label>
                    </div>
                    <div className='w-[70px]  py-2 px-2 hover:cursor-pointer text-white rounded-3xl bg-sub-500    hover:bg-yellow-200'>

                        <Spin spinning={loading}>
                            <button className='whitespace-nowrap'
                                onClick={handleSignIn}>Sign Up</button>
                        </Spin>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignIn
