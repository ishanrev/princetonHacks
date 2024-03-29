import React, { useState } from 'react'
import QuestionEditor from '../TestMaker/QuestionEditor'

function NavBar() {
    const [closed, setClosed] = useState(false)
    const [searchText, setSearchText] = useState('')


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
    return (
        <div className="wrapper ">

            <div className="navbar w-full bg-gray-200 h-14 py-3 px-5 ">
                {/* navbar header */}
                <ul className='flex justify-around'>
                    {/* <div className="header flex justify-between px-3"> */}

                    <li className='pt-1'>TestMon</li>
                    <li className='searchBar flex'>
                        <button className="searchIcon px-3 rounded-3xl mr-2 bg-primary-300">Search</button>
                        <input type="text" name="" id="" className='rounded-3xl h-8 p-2 pl-3
                      bg-gray-50 w-[400px] border-1 shadow-md border-gray-400  
                        active: ring-none  border active:outline-none focus:outline-none
                      text-gray-900 text-sm g mr-10
                        block '
                            placeholder='Search Here'
                            onChange={(e) => {
                                let temp = e.target.value
                                setSearchText(temp)
                            }}
                            onKeyDown={handleKeyPress}
                        />
                    </li>
                    <div className="links flex justify-between flex-row-reverse">

                        <li className='text-center'><button className='create rounded-3xl bg-primary-300 mx-3 -mt-1 text-white w-36 h-10
                        hover:bg-primary-main'

                        >Create Test</button></li>

                        <li className='hover:bg-gray-300 px-3'>
                            <i class="fa fa-file-text-o text-[18px] pr-2" ></i>
                            My tests
                        </li>
                        <li className='hover:bg-gray-300 px-3'>
                            <i class="fa fa-magnifying-glass text-[18px] pr-2"></i>
                            Browse tests
                        </li>
                        <li className='hover:bg-gray-300 px-3'>
                            <i class="fa fa-user-group text-[18px] pr-2"></i>
                            Friends
                        </li>
                    </div>
                </ul>

                {/* </div> */}


            </div>

        </div>
    )
}

export default NavBar