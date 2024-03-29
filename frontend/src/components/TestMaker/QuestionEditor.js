import axios from 'axios'
import React, { useEffect, useState } from 'react'
import axiosLink from '../../axiosInstance'
import AceEditor from 'react-ace'
// Languages
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/mode-json'
// there are many themes to import, I liked monokai.
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/theme-eclipse'
// this is an optional import just improved the interaction.
import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-noconflict/ext-beautify'
import { message, Steps, Tabs } from 'antd'

const { Step } = Steps;
const { TabPane } = Tabs

function InputNormal() {
    return (
        <div className="input"></div>
    )
}
function QuestionEditor({ newQuestion, setNewQuestion, mode, originalDetails, editQuestionFunc, editIndex, editMode, qEditor }) {
    // console.log('mode', mode)
    // console.log('originalDetails', originalDetails)

    // const [parameters, setParameters] = useState([])
    const [parameters, setParameters] = useState([])
    const [questionDetails, setQuestionDetails] = useState({})
    const [newParameter, setNewParameter] = useState({ type: 'Integer' })
    const [testCases, setTestCases] = useState([])
    const [newTestCase, setNewTestCase] = useState({ name: 'Test Case 1', input: '', output: '' })
    const [current, setCurrent] = useState(0)
    const [inputType, setInputType] = useState(false)
    const [normal, setNormal] = useState('bg-sub-500')
    const [JSON, setJSON] = useState('')
    const [code, setCode] = useState(`
function ${questionDetails.funcName}(${parameters.toString()}) {
    // console.log("");
}`)
    const [inputCode, setInputCode] = useState(`
[
    {
        "name" : "value"
    }
]`)
    // const [buttonColour, setButtonColour] = useState('primary-main')

    useEffect(() => {
        let tempParameters = []
        if (editMode === true) {
            for (let x = 0; x < originalDetails.parameterTypes.length; x++) {
                tempParameters.push({ name: originalDetails.parameterNames[x], type: originalDetails.parameterTypes[x] })
            }
        }
        setParameters(tempParameters)
        let temp = mode === 'edit' ?
            { ...originalDetails } : { points: 10, funcName: 'default', name: '', questionText: '', parameters };
        setQuestionDetails(temp)

        return () => {
            console.log("question editor is gonna unmount")
        }
    }, [])

    useEffect(() => {
        console.log('compnent mounted')
        let temp = { points: 10, funcName: 'default', name: '', questionText: '' }
        setTestCases([])
        setParameters([])
        setNewQuestion(temp);

    }, [])

    let parametersElement = parameters.map((p, index) => {
        return (
            <tr className=''>
                <td className='px-2 overflow-hidden text-ellipsis text-center'>{p.name}</td>
                <td className='px-2 overflow-hidden text-ellipsis text-center'>{p.type}</td>
            </tr>)
    })
    let testCasesElement = testCases.map((tc, index) => {
        return (
            <div key={index} className='border-2 border-slate-300 rounded-lg p-2 my-2 w-auto'>
                <h5 className='text-sate-700'> {tc.name}</h5>
            </div>
        )
    })
    let testCasesNamesElement = parameters.map((p, index) => {
        return (
            <div key={index} className='bg-gray-200 rounded-md my-2 p-3  text-black text-center'>
                <label htmlFor="pInput" className=''>{p.name}</label>
                <input type="text" name="pInput" id="pInput" className="pInput w-full"
                    onChange={(e) => {
                        let stringValue = e.target.value;
                        let finalValue;
                        let type = p.type
                        if (type === 'Integer') {
                            finalValue = parseInt(stringValue);
                        } else if (type === 'String') {
                            finalValue = stringValue.trim()
                        } else if (type === 'Boolean') {
                            finalValue = stringValue.trim().toLowerCase() === 'true' ? true : false
                        } else if (type === 'StringArray') {

                        } else if (type === 'BooleanArray') {

                        } else if (type === 'IntegerArray') {

                        }

                        let tempInput = []
                        tempInput[index] = finalValue
                        setNewTestCase({ ...newTestCase, input: tempInput })
                    }
                    } />
            </div>)
    })
    useEffect(() => {
        setParameters([])
        setTestCases([])
    }, [])
    const generateCodeStubs = () => {
        let stub = '';
        let funcName = newQuestion.funcName
        let parameterNames = parameters.map((param) => {
            return param.name
        })
        let language = 'python'

        if (language === 'python') {
            stub = stub + `def ${funcName}(`
            let x = 0;
            for (let pName of parameterNames) {
                if (x < parameterNames.length - 1)
                    stub += pName + ', '
                else
                    stub += pName
                x += 1
            }
            stub = stub + `):
    #write your code here`
        } else if (language === 'javascript') {
            stub = stub + `function ${funcName}(`
            let x = 0;
            for (let pName of parameterNames) {
                if (x < parameterNames.length - 1)
                    stub += pName + ', '
                else
                    stub += pName
                x += 1
            }
            stub = stub + `){
    // Write your code here
}`
        }
        return stub
    }
    function addParameter() {
        // parameters.push(newParameter)
        let tempParameters = [...parameters, newParameter]
        let parameterTypes = []
        let parameterNames = []
        for (let param of tempParameters) {
            parameterNames.push(param.name)
            parameterTypes.push(param.type)
        }
        setParameters(tempParameters)
        setNewParameter({ ...newParameter })
        // console.log(parameters)
        setNewQuestion((prevQuestion) => {
            return { ...prevQuestion, parameterNames, parameterTypes }
        })
    }
    function addTestCase() {

        for (let key of ['name', 'input', 'output']) {

            console.log(newTestCase[key])

            if (parameters.length === 0 && key === 'input') continue;
            if (newTestCase[key] === '' && key === 'output') {
                message.error("Not all required information has been added to create an adequate test case")
                return;

            };
            if (newTestCase[key] === undefined || newTestCase[key] === null) {
                message.error("Not all required information has been added to create an adequate test case")
                return;
            }
        }
        let temp;
        if (parameters.legth === 0) {

            temp = [...testCases, { ...newTestCase, input: [], num: testCases.length }]
        } else {
            temp = [...testCases, { ...newTestCase, num: testCases.length }]

        }
        setTestCases(temp)
        setNewTestCase({ name: 'Test Case ' + (() => { return testCases.length + 1 })(), output: '' })
        setNewQuestion((prevQuestion) => {
            return { ...prevQuestion, testCases: temp }
        })
        message.success("New Test Case has been successfully created")
        // console.log(testCases)
    }
    function saveQuestionDetails(e, key) {
        //         let parameterTypes = []
        //         let parameterNames = []
        //         for (let param of parameters) {
        //             parameterNames.push(param.name)
        //             parameterTypes.push(param.type)
        //         }

        //         let temp = { ...questionDetails, parameterNames, parameterTypes }
        //         temp[key] = e.target.value
        //         setQuestionDetails(temp)
        //         // console.log('main temppppppppppppppppppppp', temp)
        //         if (mode === 'new') {
        //             setNewQuestion(temp)
        //         } else if (mode === 'edit') {
        //             editQuestionFunc(editIndex, questionDetails)
        //         }
        //         let fName = questionDetails.funcName
        //         if (key === 'funcName') {
        //             let temp2 = `
        // function ${e.target.value}() {
        //     // console.log("");
        // }`

        //             setCode(temp2)
        //         }
        setNewQuestion((prevQuestion) => {
            let newQ = { ...prevQuestion }
            newQ[key] = e.target.value
            return newQ
        })
    }
    function previewChange() {

    }
    function saveChanges() {
        try {
            let parameterTypes = []
            let parameterNames = []
            for (let param of parameters) {
                parameterNames.push(param.name)
                parameterTypes.push(param.type)
            }
            let data = {
                ...questionDetails,
                parameterNames,
                parameterTypes
            }
            // axios.post(axiosLink+'/question',data)
            // console.log(data)
        } catch (saveError) {
            // console.log(saveError.message.data)
        }
    }

    return (
        // <div className="questionEditor bg-white-300 rounded-3xl bg-white
        //  h-[90vh] w-5/6 md:overflow-x-scroll lg:overflow-x-hidden overflow-y-auto m-auto py-3 border-t-2 shadow-2xl scrollbar-hide no-scrollbar ">
        <>
            <div className="newConfiguration questionEditor bg-white-300 rounded-3xl bg-white-300 border border- 2border-black  
            h-[100vh] w-auto m-7 mb-1 -py-1">
                {/* <div className="left border-2  h-full p-3 pr-1 mr-8 ml-3 mb-2 my-3 w-2/3 overflow-y-scroll">

                </div> */}
                <div className="progressManager w-full h-auto p-10 pb-6">
                    <Steps current={current} onChange={(current) => setCurrent(current)} >
                        <Step title="Basic " description="Enter the basic details of the question" />
                        <Step title="Description" description="Write the description of your question" />
                        <Step title="Parameters" description="Add the parameters of your function" />
                        <Step title="Test Cases" description="Add Test cases to your question" />
                        <Step title="Preview" description="Preview" />
                    </Steps>
                </div>
                <div className="content-writer w-full h-auto ">
                    {current === 0 ?
                        <div className="basicContent p-3 ">
                            <label htmlFor="name" className=''>Name</label>
                            <input type="text" name="" id="name" className="questionName bg-gray-50 border 
                        border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                        focus:border-blue-500 block w-full p-2.5"
                                onChange={(e) => saveQuestionDetails(e, 'name')}
                                value={newQuestion.name}
                            />

                            <br />
                            <label htmlFor="funcName">Function name</label>
                            <input type="text" name="" id="funcName" className="functionName bg-gray-50 border 
                        border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 
                        block w-full p-2.5"
                                onChange={(e) => {
                                    if (e.target.value.indexOf('(') === -1 && e.target.value.indexOf(')') === -1) {

                                        saveQuestionDetails(e, 'funcName');
                                    }
                                }}
                                value={newQuestion.funcName}
                            />

                            <br />
                            <label htmlFor="points">Points</label>
                            <input type="text" name="" id="points" className="points bg-gray-50 border 
                        border-gray-300 w-12 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                        focus:border-blue-500 block w-full p-2.5" placeholder='10 '
                                onChange={(e) => saveQuestionDetails(e, 'points')}
                                value={newQuestion.points}
                            />
                            <br />



                            <br />
                        </div>
                        : undefined}

                    {current === 1 ?
                        <div className="text-area-question-details-section p-3">
                            <span className='text-lg m-2 pt-4'>Description</span>
                            <textarea name="" id="" cols="30" rows="10" placeholder='Write the description of your question here'
                                className="questionDescription rounded-lg mt-3 p-2 w-full bg-gray-50 border border-gray-300"
                                onChange={(e) => saveQuestionDetails(e, 'questionText')}
                                value={newQuestion.questionText}
                            >
                            </textarea>
                        </div>
                        : undefined}

                    {current === 2 ?
                        <>
                            <div className="parameters mr-2 p-3 px-[12rem] ">
                                <label htmlFor="">Parameters</label>

                                <div className="flex justify-around gap-12 overflow-y-scroll">
                                    <table className="table-fixed my-8 border-collapse w-full overflow-hidden border-slate-400 bg-gray-50 rounded-lg">
                                        <thead className="">
                                            <tr className='bg-gray-200 -z-10 rounded-lg'>
                                                <th className='px-2'>Name</th>
                                                <th className='px-2'>Type</th>
                                            </tr>
                                        </thead>
                                        <tbody className='h-full'>
                                            {parametersElement}
                                        </tbody>
                                    </table>


                                    <div className="inputParameters h-1/3 border-2 border-dark-400 p-2 rounded-xl my-2">
                                        <div className='text-md border-b-1 border-b-slate-100'>New Parameter</div>
                                        <input type="text" name="" id="" value={newParameter.name} className=" mb-3 parameterType rounded-lg focus:outline-none bg-slate-100 
                            px-1 m-1" onChange={(e) => {
                                                setNewParameter({ ...newParameter, name: e.target.value })
                                            }}
                                        />
                                        <select name="" id="" value={newParameter.type} className="parameterTypes rounded-md mx-2 w-auto" onChange={(e) => {
                                            // console.log(e.target.value)
                                            setNewParameter({ ...newParameter, type: e.target.value })
                                        }}>
                                            <option value="Integer">Integer</option>
                                            <option value="IntegerArray">Integer Array</option>
                                            <option value="String">String</option>
                                            <option value="StringArray">String Array</option>
                                            <option value="Boolean">Boolean</option>
                                            <option value="BooleangArray">Boolean Array</option>
                                        </select>
                                        <button className="addParameters rounded-lg bg-primary-main bg-sub-400 text-black p-1 mx-[3px]" onClick={addParameter}>Add</button>

                                        <button className="rounded-lg bg-primary-main bg-sub-400 text-black p-1 mx-2" onClick={() => { setParameters([]); setTestCases([]) }}>Clear</button>
                                    </div>

                                </div>

                                {/* <div className="">{parametersElement}</div> */}


                            </div>
                        </>
                        : undefined}

                    {current === 3 ?
                        <div className="testCases p-3">
                            <Tabs defaultActiveKey="1" tabBarStyle={{ color: 'black' }} >
                                <TabPane tab="Preview" key='1'>
                                    <div className="left border-solid h-full w-2/3 overflow-y-scroll">
                                        <div className="tc">
                                            <h2 htmlFor="" className="m-3">Test Cases</h2>

                                            {testCasesElement}
                                        </div>
                                        <button
                                            className='rounded-lg bg-primary-main bg-sub-400 text-gray-200 p-1 mx-2'
                                            onClick={() => { setTestCases([]) }}>Clear</button>
                                    </div>
                                </TabPane>
                                <TabPane tab="Edit" key='2'>
                                    <div className="right  w-full overflow-x-hidden 
                                    divide-y-[3px] divide-gray-200 rounded-2xl ">
                                        {/* preview editor */}

                                        <input type="text" value={'Test Case ' + (() => { return testCases.length + 1 })()} placeholder={'Test Case ' + (() => { return testCases.length + 1 })()} className='testCaseName rounded-md p-2 focus:outline-none
                                        m bg-gray-200 border-solid border-black h-8 self-center mx-2' onChange={(e) => {
                                                setNewTestCase({ ...newTestCase, name: e.target.value }
                                                )
                                            }} />
                                        <button className="addTestCase hover:bg-dark-500 text-gray-700 bg-slate-300
                        rounded-lg px-2 py-[6px] ml-2 hover:text-[#f4f7f7]" onClick={addTestCase}>Add</button>
                                        <div className='border-2 border-gray-300 rounded-lg mt-4'>


                                            <div className="testCaseEditor  flex justify-around gap-1 p-3 ">

                                                <div className="left">
                                                    {/* json input editor */}
                                                    <div className="jsonEditor">

                                                    </div>

                                                    <div className="testCaseDetails flex justify-between space-x-1">

                                                        {/* bg-yellow-200 */}
                                                        <div className="input w-3/5">
                                                            <h3 className='input'>Input</h3>

                                                            <div className=" flex">

                                                                <button className={'normal mx-1 rounded-md bg-dark-500 px-2 py-2 text-white ' + normal} onClick={() => {
                                                                    setInputType(false);
                                                                    setNormal('bg-primary-main');
                                                                    setJSON(undefined);
                                                                }}>Normal</button>
                                                                <button className={'normal mx-1 rounded-md bg-dark-500 px-2 py-2 text-white ' + JSON} onClick={() => {
                                                                    setInputType(true);
                                                                    setNormal(undefined);
                                                                    setJSON('bg-primary-main');
                                                                }}>JSON</button>
                                                            </div>
                                                            <br />


                                                            {inputType === false ?
                                                                <div className='h-[10rem] overflow-y-scroll'>
                                                                    {parameters.length === 0 ? <span>No Parameters for this function</span> :
                                                                        <div className='px-4'>
                                                                            {testCasesNamesElement}
                                                                        </div>
                                                                    }
                                                                </div>
                                                                :
                                                                <div className="jsonEditor border-solid border-dark-500
                                     border-[2px] rounded-lg overflow-scroll no-scrollbar h-[200px] w-[350px]">

                                                                    <AceEditor
                                                                        style={{
                                                                            height: '100vh',
                                                                            width: '100%',
                                                                        }}
                                                                        placeholder='Start Coding'
                                                                        mode='json'
                                                                        theme='eclipse'
                                                                        name='basic-code-editor'
                                                                        onChange={currentCode => setInputCode(currentCode)}
                                                                        fontSize={12}
                                                                        showPrintMargin={true}
                                                                        showGutter={true}
                                                                        highlightActiveLine={true}
                                                                        value={inputCode}
                                                                        setOptions={{
                                                                            enableBasicAutocompletion: true,
                                                                            enableLiveAutocompletion: true,
                                                                            enableSnippets: true,
                                                                            showLineNumbers: true,
                                                                            tabSize: 4,
                                                                        }}
                                                                    />
                                                                </div>}
                                                            {/* Embeddding a gddamn JSON editor which honestly I dont know how I am going to do */}

                                                        </div>

                                                    </div>
                                                </div>

                                                <div className="output w-2/5 mt-4">
                                                    <h3>Output</h3>
                                                    <textarea name="" value={newTestCase.output} id="" cols="10" rows="10" style={{ resize: 'none' }} className="output w-full h-2/3 p-3
                                 mt-2  mb-3 rounded-lg bg-base border-2 border-dark-500 focus:outline-none" onChange={(e) => {
                                                            setNewTestCase({ ...newTestCase, output: e.target.value }
                                                            )
                                                        }}>
                                                    </textarea>
                                                </div>

                                            </div>

                                        </div>
                                    </div>
                                </TabPane>

                            </Tabs>


                        </div>
                        : undefined}

                    {current === 4 ?
                        <div className="wrapper p-5 items-center justify-center flex">
                            <div className="preview overflow-hidden pointer-events-none h-[300px] w-[500px] rounded-lg">
                                <AceEditor
                                    style={{
                                        height: '100vh',
                                        width: '100%',
                                    }}
                                    placeholder='Start Coding'
                                    mode='python'
                                    theme='monokai'
                                    name='basic-code-editor'
                                    onChange={currentCode => setCode(currentCode)}
                                    fontSize={18}
                                    showPrintMargin={true}
                                    showGutter={true}
                                    highlightActiveLine={true}
                                    value={generateCodeStubs()}
                                    setOptions={{
                                        enableBasicAutocompletion: true,
                                        enableLiveAutocompletion: true,
                                        enableSnippets: true,
                                        showLineNumbers: true,
                                        tabSize: 4,
                                    }}
                                />
                            </div>
                            
                        </div>

                        : undefined}
                </div>
            </div>

        </>

        // </div>
    )
}

export default QuestionEditor