import React, { useEffect, useState } from 'react'
import NavBar from '../components/General/NavBar'
import Home from '../images/home-image.png'
import HomeLogo from '../images/logoMain.png'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import axiosLink from '../axiosInstance';
import { message } from 'antd';


function HomePage() {
    let navigate = useNavigate()
    const [mail, setMail] = useState({})
    const [transporter, setTransporter] = useState()
    const sendMail = async () => {
        // try {
        //     //console.log(mailOptions)
        //     let res = await axios.post(axiosLink + '/mail', mailOptions)
        //     //console.log(res)
        // } catch (EmailError) {
        //     //console.log(EmailError)                  
        // }
        message.success('Thank you for contacting us') 
    }
    useEffect(() => {


    }, [])
    return (
        <div className='wrapper'>
            <div className="topBar bg-[#fafafafa]">
                {/* <NavBar /> */}
                <header>
                    <nav class="bg-white border-gray-200 px-4 lg:px-6 py-2.5 ">
                        <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                            <a href="https://
                            .com" class="flex items-center">
                                {/* <img src="https://flowbite.com/docs/images/logo.svg" class="mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
                                <span class="self-center text-xl font-semibold whitespace-nowrap dark-cancel:text-white">Structo</span> */}
                                <img src={HomeLogo} alt="" className=' w-[35%]' />
                            </a>
                            <div class="flex items-center lg:order-2 animate__animated animate__fadeInUp">
                                <a class="text-gray-800 dark-cancel:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark-cancel:hover:bg-gray-700 focus:outline-none dark-cancel:focus:ring-gray-800 animate__animated animate__fadeInUp" onClick={() => { navigate('/login') }}>Log in</a>
                                <a class="text-gray bg-primary-700 hover:bg-primary-800 hover:bg-gray-50  font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark-cancel:bg-primary-600 dark-cancel:hover:bg-primary-700 focus:outline-none dark-cancel:focus:ring-primary-800 animate__animated animate__fadeInUp" onClick={() => { navigate('/signUp') }}>Get started</a>
                                <button data-collapse-toggle="mobile-menu-2" type="button" class="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark-cancel:text-gray-400 dark-cancel:hover:bg-gray-700 dark-cancel:focus:ring-gray-600" aria-controls="mobile-menu-2" aria-expanded="false">
                                    <span class="sr-only">Open main menu</span>
                                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
                                    <svg class="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                </button>
                            </div>
                            <div class="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1" id="mobile-menu-2  animate__animated animate__fadeInUp">
                                <ul class="flex flex-col mt-4 text-lg font-medium lg:flex-row lg:space-x-8 lg:mt-0 pt-4">
                                    {/* <li>
                                        <a class="block py-2 pr-4 pl-3 text-gray-700 rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark-cancel:text-white animate__animated animate__fadeInUp" aria-current="page">Home</a>
                                    </li> */}
                                    {/* <li>
                                        <a class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100
                                         hover:bg-gray-50 lg:hover:bg-transparent lg:border-0
                                          lg:hover:text-primary-700 lg:p-0 dark-cancel:text-gray-400 
                                          lg:dark-cancel:hover:text-white dark-cancel:hover:bg-gray-700
                                           dark-cancel:hover:text-white lg:dark-cancel:hover:bg-transparent
                                            dark-cancel:border-gray-700 animate__animated animate__fadeInUp">Company</a>
                                    </li>
                                    <li>
                                        <a class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100
                                         hover:bg-gray-50 lg:hover:bg-transparent lg:border-0
                                          lg:hover:text-primary-700 lg:p-0 dark-cancel:text-gray-400 
                                          lg:dark-cancel:hover:text-white dark-cancel:hover:bg-gray-700
                                           dark-cancel:hover:text-white lg:dark-cancel:hover:bg-transparent
                                            dark-cancel:border-gray-700 animate__animated animate__fadeInUp">Marketplace</a>
                                    </li> */}
                                    {/* <li>
                                        <a href='#middle' class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100
                                         hover:bg-gray-50 lg:hover:bg-transparent lg:border-0
                                          lg:hover:text-primary-700 lg:p-0 dark-cancel:text-gray-400 
                                          lg:dark-cancel:hover:text-white dark-cancel:hover:bg-gray-700
                                           dark-cancel:hover:text-white lg:dark-cancel:hover:bg-transparent
                                            dark-cancel:border-gray-700 animate__animated animate__fadeInUp">Features</a> */}
                                    {/* </li> */}
                                    {/* <li>
                                        <a class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100
                                         hover:bg-gray-50 lg:hover:bg-transparent lg:border-0
                                          lg:hover:text-primary-700 lg:p-0 dark-cancel:text-gray-400 
                                          lg:dark-cancel:hover:text-white dark-cancel:hover:bg-gray-700
                                           dark-cancel:hover:text-white lg:dark-cancel:hover:bg-transparent
                                            dark-cancel:border-gray-700 animate__animated animate__fadeInUp">Team</a>
                                    </li> */}
                                    {/* <li>
                                        <a href='#contact' class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100
                                         hover:bg-gray-50 lg:hover:bg-transparent lg:border-0
                                          lg:hover:text-primary-700 lg:p-0 dark-cancel:text-gray-400 
                                          lg:dark-cancel:hover:text-white dark-cancel:hover:bg-gray-700
                                           dark-cancel:hover:text-white lg:dark-cancel:hover:bg-transpar
                                           ent dark-cancel:border-gray-700 animate__animated animate__fadeInUp">Contact</a>
                                    </li> */}
                                </ul>
                            </div>
                        </div>
                    </nav>
                </header>
            </div>
            {/* <div className=" bg-slate-300 h-[65vh] flex justify-around">
                <div className="topLeft  items-center pt-24 ">
                    <h2 className='text-3xl block '>Structo</h2>
                    
                    <span className='text-lg '>Quicksort your way to the top!</span>
                </div>
                <div className="topRight">

                </div>

            </div> */}
            <section class="bg-whie fwfbg-gray-900 px-12 bg-[#57687a] " id='top'>
                <div class="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 text-[#f4f7f7]">
                    <div class="mr-auto place-self-center lg:col-span-7">
                        <span class="max-w-2xl mb-4 text-2xl  tracking-tight
                         leading-none md:text-5xl xl:text-6xl fwftext-white"><b>Learnin'</b><span style={{ fontWeight: 100 }}>Wave</span> - Quicksort your way to the top</span>
                        <br />
                        <p class="max-w-2xl mb-6 font-light text-[#f4f7f7] lg:mb-8 md:text-lg lg:text-xl 
                        fwftext-gray-400 pt-10  ">
                            Learnin' Wave is the one mode platform for you to improve your coding skills through all possible modes.</p>
                        <button href="#" onClick={() => navigate('/signUp')} class="inline-flex items-center justify-center px-5 py-3 mr-3 text-sm 
                        font-medium text-center text-[#f4f7f7] rounded-lg bg-dark-500 hover:bg-dark-500
                        focus:ring-4 focus:ring-dark-300 fwffocus:ring-dark-900" >
                            Get started
                            <svg class="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                        </button>
                        <button href="#" class="inline-flex items-center justify-center px-5 py-2 
                         font-medium text-center  border bg-[#f4f7f7] rounded-lg
                          hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 text-dark-500
                           fwfborder-gray-700 fwfhover:bg-gray-700 fwffocus:ring-gray-800" onClick={() => navigate('/login')}>
                            Login
                        </button>
                    </div>
                    <div class="hidden lg:mt-0 lg:col-span-5 lg:flex">
                        <img className='w-4/5' src={Home} alt="mockup" />
                    </div>
                </div>
            </section>


            {/* <div className="middle" id='middle'>
                <section class="bg-base dark-cancel:bg-gray-900">
                    <div class="container px-6 py-10 mx-auto">
                        <h1 class="text-3xl font-semibold text-gray-800 capitalize lg:text-4xl dark-cancel:text-white">
                            explore our <br /> awesome <span class="text-dark-500">Features</span></h1>


                        <div class="grid grid-cols-1 gap-8 mt-8 xl:mt-12 xl:gap-12 md:grid-cols-2">
                            <div class="p-6 border rounded-xl border-gray-400 dark-cancel:border-gray-700 animate__animated animate__fadeInUp">
                                <div class="md:flex md:items-start md:-mx-4">
                                    <span class="inline-block p-2 text-dark-500 bg-blue-100 rounded-xl md:mx-4 dark-cancel:text-white dark-cancel:bg-blue-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                        </svg>
                                    </span>

                                    <div class="mt-4 md:mx-4 md:mt-0">
                                        <h1 class="text-2xl font-medium text-gray-700 capitalize dark-cancel:text-white">
                                            Live Challenges</h1>

                                        <p class="mt-3 text-gray-500 dark-cancel:text-gray-300 text-lg">
                                            Structo incorporates one of the novel yet crucial elements into teaching coding, an essetial skill for the
                                            21st century. Students can challenge their friends or participate in live games making the whoole experience fun
                                            and engaging while improving their skills in coding. Structo is also the best solution for teachers looking
                                            to customize learning in their classes


                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div class="p-6 border rounded-xl border-gray-400 dark-cancel:border-gray-700 animate__animated animate__fadeInUp">
                                <div class="md:flex md:items-start md:-mx-4">
                                    <span class="inline-block p-2 text-dark-500 bg-blue-100 rounded-xl md:mx-4 dark-cancel:text-white dark-cancel:bg-blue-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                        </svg>
                                    </span>

                                    <div class="mt-4 md:mx-4 md:mt-0">
                                        <h1 class="text-2xl font-medium text-gray-700 capitalize dark-cancel:text-white">Personal Progress</h1>

                                        <p class="mt-3 text-gray-500 dark-cancel:text-gray-300 text-lg">
                                            Track your daily progress and create custmized playlists with specific challenges u find difficult while practicing the language in a variety of offered programming languages.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div class="p-6 border rounded-xl border-gray-400 dark-cancel:border-gray-700 animate__animated animate__fadeInUp">
                                <div class="md:flex md:items-start md:-mx-4">
                                    <span class="inline-block p-2 text-dark-500 bg-blue-100 rounded-xl md:mx-4 dark-cancel:text-white dark-cancel:bg-blue-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                                        </svg>
                                    </span>

                                    <div class="mt-4 md:mx-4 md:mt-0">
                                        <h1 class=" text-2xl font-medium text-gray-700 capitalize dark-cancel:text-white">Live Games</h1>

                                        <p class="mt-3 text-gray-500 dark-cancel:text-gray-300 text-lg">
                                            Host Live games for for your classroom or your
                                            group of friends and create an interactive environment for an engaging
                                            learning session while simulataneously improving you coding skills                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div class="p-6 border rounded-xl border-gray-400 dark-cancel:border-gray-700 animate__animated animate__fadeInUp">
                                <div class="md:flex md:items-start md:-mx-4">
                                    <span class="inline-block p-2 text-dark-500 bg-blue-100 rounded-xl md:mx-4 dark-cancel:text-white dark-cancel:bg-blue-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                        </svg>
                                    </span>

                                    <div class="mt-4 md:mx-4 md:mt-0">
                                        <h1 class="text-2xl font-medium text-gray-700 capitalize dark-cancel:text-white">Design</h1>

                                        <p class="mt-3 text-gray-500 dark-cancel:text-gray-300 text-lg">
                                            Create custom coding challenges for your students or friends.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div> */}
            
            <div className="footer">
                <footer class="p-4 bg-dark-200 text-white md:p-8 lg:p-10 dark-cancel:bg-gray-800">
                    <div class="mx-auto max-w-screen-xl text-center">
                        <a href="#" class="flex justify-center items-center text-2xl font-semibold text-gray-900 dark-cancel:text-white">
                            <img src={HomeLogo} alt="" className=' w-1/5' />

                        </a>

                    </div>
                </footer>
            </div>

        </div>
    )
}

export default HomePage