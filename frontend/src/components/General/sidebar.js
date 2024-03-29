import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import QuestionEditor from '../TestMaker/QuestionEditor'
import { MenuOutlined, LeftCircleOutlined, CompassOutlined, TeamOutlined, LineChartOutlined, HddOutlined, FolderAddOutlined, DribbbleOutlined } from '@ant-design/icons'
import { UserContext } from '../../contexts'
import HomeStructo from '../../images/home-structo.png'

function SideBar({ drawer }) {
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

            <div className={"SideBar h-full bg-sub-100 py-3 p-10 w-[16rem]  "}>
                {/* SideBar header */}
                <ul className=''>
                    {/* <div className="header flex justify-between "> */}
                    {/* <li className='pt-1 my-1 mb-[20px]'>
                        <img src={HomeStructo} alt="" />

                    </li> */}

                    <div className="search  my-5 w-full gap-2">

                        {/* <li className='searchBar '> */}
                        <input type="text" name="" id="" className={`rounded-3xl h-8 
                      bg-gray-50 w-[full]  border-1 shadow-md border-gray-400  
                        active: ring-none  border active:outline-none focus:outline-none
                      text-gray-900 text-sm px-[8px]  py-[10px]
                        block ` }
                            placeholder='Search Here'
                            onChange={(e) => {
                                let temp = e.target.value
                                setSearchText(temp)
                            }}
                            onKeyDown={handleKeyPress}
                        />
                        {/* <button className="searchIcon px-1 rounded-3xl py-1  bg-primary-300">Se</button> */}
                        {/* </li> */}
                    </div>
                    <div className="links ">

                        <li className=''><button className='create 
                        rounded-xl  bg-dark-500 my-3  text-white w-full h-10 hover:opacity-50'
                            onClick={() => {
                                navigate('/create')
                            }}
                        >Create Test</button></li>

                        <li className={'' + liClass}
                            onClick={() => { navigate('/testCenter') }}>
                            <i className="fa fa-file-text-o text-[18px] " ></i>
                            <div className='flex justify-start items-center'>
                                <FolderAddOutlined style={iconStyle} />
                                <span className='text-md'>My Tests</span>
                            </div>
                        </li>
                        <li className={'' + liClass}
                            onClick={() => { navigate('/browse') }}>
                            <i class="fa fa-magnifying-glass text-[18px]"></i>
                            <div className='flex justify-start items-center'>
                                <CompassOutlined style={iconStyle} />
                                <span className='text-md'>Browse Tests</span>
                            </div>

                        </li>
                        <li className={'' + liClass}
                            onClick={() => { navigate('/dashboard') }}>
                            <i class="fa fa-user-group text-[18px] "></i>
                            <div className='flex justify-start items-center'>
                                <TeamOutlined style={iconStyle} />
                                <span className='text-md'>Friends</span>
                            </div>
                        </li>
                        <li className={'' + liClass}
                            onClick={() => { navigate('/dashboard') }}
                        >
                            <i class="fa fa-user-group text-[18px] "></i>
                            <div className='flex justify-start items-center'>
                                <LineChartOutlined style={iconStyle} />
                                <span className='text-md'>Dashboard</span>
                            </div>
                        </li>
                        <li className={'' + liClass}
                            onClick={() => { navigate('/joinGame') }}
                        >
                            <i class="fa fa-user-group text-[18px] "></i>
                            <div className='flex justify-start items-center'>
                                <DribbbleOutlined style={iconStyle} />
                                <span className='text-md'>Join</span>
                            </div>
                        </li>
                        <li className={'' + liClass}
                            onClick={() => { navigate('/testCenter') }}
                        >
                            <i class="fa fa-user-group text-[18px] "></i>
                            <div className='flex justify-start items-center'>
                                <HddOutlined style={iconStyle} />
                                <span className='text-md'>Test Center</span>
                            </div>
                        </li>
                        <br /><br />
                        <li className={'' + liClass}
                            onClick={signOut}>
                            <LeftCircleOutlined style={{ marginTop: '-0.5rem', fontSize: '1rem' }} />
                            <span className='ml-2 pt-2'>Sign Out</span>
                        </li>
                    </div>
                </ul>

                {/* </div> */}


            </div>

        </div>
    )
}

export default SideBar