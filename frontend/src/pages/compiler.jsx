import React from 'react'
import { useState, useEffect } from 'react'
// import './App.css'
import axios from 'axios'

import moment from 'moment'
import stubs from '../Stubs/codeStubs'
import axiosLink from '../axiosInstance'
function Compiler() {
    const [code_new, setCode] = useState('')
    const [output, setOutput] = useState('')
    const [language, setLanguage] = useState('')
    const [status, setStatus] = useState('')
    const [executeTime, setExecuteTime] = useState('not run yet')
    const [input, setInput] = useState('')
    const [funcName, setFuncName] = useState('')

    const setDefaultLanguage = ()=>{
        localStorage.setItem('default-language', language)
    }
    useEffect(()=>{
        setLanguage(localStorage.getItem('default-language'))
    },[])

    useEffect(()=>{
        setCode(stubs[language])
    },[language])

    const submit = async () => {
        console.log(funcName)
        
        const codeDetails = {
            language: 'py',
            code: code_new,
            input: input,
            funcName 
        }   
        try {
            // const startTime = new Date()
            const res = await axios.post(`${axiosLink}/run`, codeDetails)
            const stdout = res.data.out
            // console.log(res)
            setOutput(stdout)
            try {
                const statRes = await axios.get(`${axiosLink}/status/?id=${res.data.jId}`)
                // console.log(statRes)
                setStatus(statRes.data.compileStatus)
                const {startedAt, completedAt }  = statRes
                var st = moment(startedAt)
                var end = moment(completedAt)
                setExecuteTime(end.diff(st,'seconds'))
            } catch (statusError) {
                console.log('status error')
                console.log(statusError)
            }
            
        } catch (error) {
            console.log('errrrorrr')
            setOutput(error.response.data.err) 
        }
    }

    return ( 
        <div className="app">
            <h1 className="heading">Online code compiler</h1>
            <div className="language-selection">
                <select name="" id="" value={language} onChange = {(e)=>{
                    setLanguage(e.target.value)
                    console.log(language)
                }}>

                <option value="py">Python3</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>

                </select>

            </div> 
            <button onClick ={setDefaultLanguage}>Set Default </button>

            {/* Code editor */}
            
            {/* <Editor /> */}

            <textarea className="code-editor" rows="20" cols="75" value={code_new} onChange={(e)=> {
                setCode(e.target.value)
            }}></textarea> 

            {/* Code editor */}

            <h3>Function name</h3>
            <input type="text" name="Function name" id="" onChange={(e) =>{
                setFuncName(e.target.value)
            }}/>
            <br />
            <textarea name="" id="" cols="30" rows="10" className="input" value = {input} onChange={(e)=>{
                setInput(e.target.value)
            }}></textarea>

            <button className="submit" type="submit" onClick={submit}>Submit</button>
            <p className="output">{output}</p>
            <h5>Status : {status}</h5>
            <h5>ExecuteTime : {executeTime}</h5>  

        </div> 
        )
}

export default Compiler