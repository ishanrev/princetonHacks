import axiosLink from '../axiosInstance'
import axios from 'axios'
import React, { useState, useEffect, useContext } from 'react'
import NavBar from '../components/General/NavBar'
import QuestionEditor from '../components/TestMaker/QuestionEditor'
import TestMaker from '../components/TestMaker/TestMaker.js'
import { Modal, Button, Collapse, Empty, message } from 'antd';
import { EditFilled, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import SidebarDrawer from '../components/General/sidebarDrawer'
import { useNavigate } from 'react-router-dom'
import { LoggedInContext } from '../contexts'
const { Panel } = Collapse
//#region 

function QuestionElement() {
  return (
    <div className="questionElement">

    </div>
  )
}
// #endregion
function TestMakerPage() {
  // const [first, setfirst] = useState(second)
  const navigate = useNavigate()

  const { loggedIn, setLoggedIn } = useContext(LoggedInContext)
  const [questions, setQuestions] = useState([])
  const [section, setSection] = useState('questions')
  const [qEditor, setQEditor] = useState(false)
  const [newQuestion, setNewQuestion] = useState({})
  const [editMode, setEditMode] = useState(false)
  const [editModeQuestion, setEditModeQuestion] = useState({})

  const [newEdit, setNewEdit] = useState({})
  const [newEditIndex, setNewEditIndex] = useState({})

  // console.log(questions)
  const addQuestion = () => {
    // console.log('new question', newQuestion)
    let reqKeys = ['name', 'funcName', 'questionText', 'testCases']
    for (let key of reqKeys) {
      //console.log(newQuestion[key])
      if (newQuestion[key] === undefined || newQuestion[key] === null) {
        //console.log('questiion error')
        message.error("not all information has been entered for the new quesiton")
        return
      }
    }
    let temp = [...questions, {...newQuestion, num: questions.length}]
    // console.log('temp in theparent component', temp)
    setQuestions(temp)
    setNewQuestion({})
    setQEditor(false)
  }

  const openQuestionEditor = () => {
    setQEditor(true)
  }
  function handleOk() {
    setQEditor(false)
  }
  function handleCancel() {
    setQEditor(false)
  }
  function editQuestion(index) {
    setEditModeQuestion(questions[index])
    setEditMode(true)
  }
  function deleteQuestion(index) {
    // // //console.log(index)
    let temp = []
    for (let x = 0; x < questions.length; x++) {
      if (x !== index) {
        temp.push((questions[x]))
      }
    }
    setQuestions(temp)
  }

  const editQuestionFunc = (index, updatedQuestion) => {
    setNewEdit(updatedQuestion)

  }
  const saveChanges = () => {
    let temp = [...questions];
    temp[newEditIndex] = newEdit;
    //console.log(temp)
    setQuestions(temp)
  }
  useEffect(() => {
    if (loggedIn === undefined) {
      navigate('/home')
    }
  }, [])

  return (
    <div className=" h- h-[150vh] bg-base">
      {/* <NavBar /> */}

      <div className='h-14'></div>

      <div className=" h-[15vh] rounded-lg shadow-xl bg-sub-500 border-2 border-sub-300  mx-[192px]  
       px-10 flex justify-between items-center text-center gap-12 ">
        <SidebarDrawer />
        <div className='flex justify-center items-center pr-[45%]'>

          <span className=' text-2xl text-white'>
            Create A Test
          </span>
        </div>
      </div>
      <div className="wrapper w-full h-[90vh] gap-8 px-48 py-16 flex justify-around ">
        <div className="left w-1/3">
          <TestMaker questions={questions} />

          {/* {qEditor ===true?<QuestionEditor />:undefined} */}

          {/* <div className="questions">
            {section === 'questions' ? questions : undefined}
          </div> */}
          <div className="leaderboard">

          </div>




        </div>
        <div className="w-2/3">
          <div className="right  border-2 border-dark-400 rounded-lg p-5 h-[90%] overflow-y-scroll">
            <div className="">
              <div className="w-full pb-2 border-b-2 border-b-gray-200">

                <span className='text-lg m-2 mb-4 pb-2'>Questions</span>
              </div>
              <div className="collapse my-2">
                {questions.length > 0 ?
                  <Collapse defaultActiveKey={['1']} >
                    {questions.map((qt, index) => {
                      let header = (<span className='flex w-full justify-between'>
                        <div className="det">
                          {qt.name + '   '}
                        </div>
                        <div className="icons ">

                          <button className='edit '
                            onClick={() => { editQuestion(index); setNewEditIndex(index); }}><EditOutlined /></button>
                          {/* Add edit feature */}
                          <Modal visible={editMode} onOk={() => {
                            saveChanges();
                            setEditMode(false)
                          }} onCancel={() => setEditMode(false)}
                            width={1200}
                            okText={'Save Changes'} style={{ top: 15 }}>
                            <QuestionEditor setNewQuestion={setNewQuestion}
                              mode='edit'
                              originalDetails={editModeQuestion}
                              editQuestionFunc={editQuestionFunc}
                              editIndex={index}
                              editMode={editMode}
                              qEditor={qEditor}
                            />
                          </Modal>
                          {/* Add delete feature */}
                          <button className='deleteQuestion mx-4 '
                            onClick={() => { deleteQuestion(index);  }}><DeleteOutlined /></button>
                        </div>

                      </span>)
                      return (
                        <Panel key={index} header={header}>
                          <div className='questionPreview'>
                            <h1>{qt.name}</h1>
                            <br />
                            <h1>{qt.funcName + '()'}</h1>
                            <br />
                            {qt.parameterNames !== undefined ?
                              <ul>
                                {
                                  qt.parameterNames.map((param, index) => {
                                    return (
                                      <li key={index} className=''>{param + ' - ' + qt.parameterTypes[index]}</li>
                                    )
                                  })
                                }
                              </ul> : undefined}
                            <br />
                            {qt.testCasses !== undefined ?
                              <ul>
                                {qt.testCases.map((tc, index) => {
                                  return (
                                    <li key={index} className=''>{tc.name}</li>
                                  )
                                })}
                              </ul>
                              : undefined}
                          </div>
                        </Panel>
                      )
                    })}
                  </Collapse> :
                  <span className="w-full h-full"><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></span>
                }

              </div>
            </div>
          </div>
          <div className="mt-4">
            <button className="adQuestion text-white border-4 border-transparent p-2 px-4 bg-dark-500 hover:bg-primary-400 rounded-lg
          active:border-4 active:border-slate-500
          " onClick={openQuestionEditor}>Add Question</button>


            <Modal visible={qEditor} onOk={addQuestion} onCancel={handleCancel} width={1200}
              okText={'Save'} style={{ top: 15 }}>
              {qEditor === true ?
                <QuestionEditor setNewQuestion={setNewQuestion} newQuestion={newQuestion} qEditor={qEditor} editMode={editMode} />
                : undefined}
            </Modal>
          </div>
        </div>

      </div>
    </div>
  )
}

export default TestMakerPage