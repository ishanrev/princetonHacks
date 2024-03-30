import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import QuestionEditor from '../TestMaker/QuestionEditor'
import { MenuOutlined, LeftCircleOutlined, CompassOutlined, TeamOutlined, LineChartOutlined, HddOutlined, FolderAddOutlined, DribbbleOutlined } from '@ant-design/icons'
import { UserContext } from '../../contexts'
import HomeStructo from '../../images/home-structo.png'
import { Collapse } from 'antd';
import SidebarDrawer from './sidebarDrawer'
const { Panel } = Collapse;

function SideBar({ modules, updateCurrentMode }) {
    const navigate = useNavigate()
    const [closed, setClosed] = useState(false)
    const [searchText, setSearchText] = useState('')
    const liClass = 'hover:border-primary-500 border-2 border-transparent hover:transition hover:delay-25 hover:duration-300 hover:ease-in-out px-2 rounded-xl  hover:cursor-pointer  text-gray-500 my-3 py-[6px]'
    const { user, setUser } = useContext(UserContext)
    const iconStyle = { fontSize: '1.3rem', paddingRight: '7px', paddingTop: '2px' }

    const search = () => {
        console.log(searchText)
    }
    const handleKeyPress = (e) => {
        if (e.keyCode === 13) {
            if (searchText !== '') {
                search()
            }
        }
    }
    const signOut = () => {
        let userId = localStorage.getItem("userId");
        if (userId === user._id.toString()) {
            localStorage.setItem("userId", '')
        }
        navigate('/')
    }
    return (
        <div className="wrapper ">

            <div className={"SideBar h-full bg-sub-100 py-3 p-10 w-[24rem]  overflow-y-scroll"}>
                {/* SideBar header */}
                <SidebarDrawer />
                <br />
                <ul className=''>
                    {/* <div className="header flex justify-between "> */}
                    {/* <li className='pt-1 my-1 mb-[20px]'>
                        <img src={HomeStructo} alt="" />

                    </li> */}

                    
                    <div className="links ">

                        <Collapse defaultActiveKey={['1']} onChange={(key) => { }} >
                            {modules.map((module, index) => {
                                let x = 0;
                                return (
                                    <Panel header={`Module ${index + 1} `} key={index} >
                                        {module.videos.map((video, videoIndex) => {
                                            return (
                                                <li className={'' + liClass}
                                                    onClick={() => { updateCurrentMode(index, 'video', videoIndex) }}>
                                                    <i className="fa fa-file-text-o text-[18px] " ></i>
                                                    <div className='flex justify-start items-center'>
                                                        <FolderAddOutlined style={iconStyle} />
                                                        <span className='text-md'>Video: {video.title}</span>
                                                    </div>
                                                </li>
                                            )
                                        })}
                                        {module.articles.map((article, articleIndex) => {
                                            return (
                                                <li className={'' + liClass}
                                                    onClick={() => { updateCurrentMode(index, 'article', articleIndex) }}>
                                                    <i className="fa fa-file-text-o text-[18px] " ></i>
                                                    <div className='flex justify-start items-center'>
                                                        <FolderAddOutlined style={iconStyle} />
                                                        <span className='text-md'>Article: {article.title}</span>
                                                    </div>
                                                </li>
                                            )
                                        })}

                                        <li className={'' + liClass}
                                            onClick={() => { updateCurrentMode(index, 'test', 0) }}>
                                            <i className="fa fa-file-text-o text-[18px] " ></i>
                                            <div className='flex justify-start items-center'>
                                                <FolderAddOutlined style={iconStyle} />
                                                <span className='text-md'>Test {module.test.name}</span>
                                            </div>
                                        </li>

                                    </Panel>
                                )
                            })}
                        </Collapse>

                        

                    </div>
                </ul>

                {/* </div> */}


            </div>

        </div>
    )
}

export default SideBar