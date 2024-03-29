import React, { createContext } from 'react'

// const SocketContext = createContext(null)
import io from "socket.io-client";
// import { SOCKET_URL } from "config";
let  SERVER = null;
if (process.env.NODE_ENV === 'development') {
    SERVER = "http://localhost:3001";

} else {

    SERVER = "https://structo-app.herokuapp.com/";
}

const socket = io.connect(SERVER);
//console.log("main socket is")
//console.log(socket)

function socketConfiguration() {

    socket.on("connection", () => {
        //console.log('socket io connection  succesfullle established baby leess go')
    })


    // setSocket(socket)
    //console.log(socket)
}
socketConfiguration()

const UserContext = createContext(null)
const SocketContext = createContext(socket);
const LoggedInContext = createContext(undefined)
export {
    UserContext,
    SocketContext,
    socket,
    LoggedInContext
}