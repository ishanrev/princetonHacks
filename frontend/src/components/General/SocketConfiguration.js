import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SocketContext } from '../../contexts'

function SocketConfiguration() {
    let navigate = useNavigate()
    const socket = useContext(SocketContext)
    useEffect(() => {
        
    }, [])
    return (
        <div>SocketConfiguration</div>
    )
}

export default SocketConfiguration