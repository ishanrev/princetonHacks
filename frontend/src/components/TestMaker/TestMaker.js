import axios from 'axios'
import React, { useState, useEffect, useContext } from 'react'
import axiosLink from '../../axiosInstance'
import { Switch } from 'antd';
import { UploadOutlined } from '@ant-design/icons'
import { Image } from 'cloudinary-react'
import { UserContext } from '../../contexts';



function TestMaker({ questions }) {
  const [testDetails, setTestDetails] = useState({ public: false })

  const [saveSuccess, setSaveSuccess] = useState(false)
  const [imageSelected, setImageSelected] = useState()
  const { user, updateUser } = useContext(UserContext)

  const changeName = (e) => {
    setTestDetails({ ...testDetails, name: e.target.value })
  }
  const changeCreator = (e) => {
    setTestDetails({ ...testDetails, creator: e.target.value })
  }
  const changePublic = (bool) => {
    setTestDetails({ ...testDetails, public: bool })
  }

  const save = async () => {

    try {
      let finaltest = { ...testDetails, questions, creator: user._id.toString() }
      console.log('final test', finaltest)

      let res = await axios.post(axiosLink + "/test/", finaltest)
      console.log(res);
      let previousMyTests = user.myTests
      updateUser({ myTests: [...previousMyTests, res.data.test._id.toString()] })
      setSaveSuccess(true)
    } catch (createError) {
      setSaveSuccess(false)
      console.log(createError)
    }
    console.log()

  }
  useEffect(() => {
    setSaveSuccess(undefined)
  }, [])


  return (
    <div className="QuestionMaker ">

      <div className="wrapper border-2 border-dark-400 p-4 rounded-lg mb-4">
        <div className="my-3">

          <label htmlFor="" className="name" id="name">Name</label>
          <input type="text" name="" id="" className="name bg-gray-50 border 
                        border-gray-300 text-gray-900 text-sm rounded-lg  focus:outline-none
                        focus:border-2 focus:border-gray-300 block w-full p-2.5" value={testDetails.name} onChange={changeName} />
          <label htmlFor="" className="name" id="name">Description</label>
          <textarea rows="3" type="text" name="" id="" className="name bg-gray-50 border 
                        border-gray-300 text-gray-900 text-sm rounded-lg  focus:outline-none
                        focus:border-2 focus:border-gray-300 block w-full p-2.5" value={testDetails.decription} onChange={(e) => { setTestDetails({ ...testDetails, description: e.target.value }) }}></textarea>
        </div>
        {/* <div className="my-3">
          <label htmlFor="" className="creator" id="creator">Creator</label>
          <input type="text" name="" id="" className="creator bg-gray-50 border 
                        border-gray-300 text-gray-900 text-sm rounded-lg  focus:outline-none
                        focus:border-2 focus:border-gray-300 block w-full p-2.5" value={testDetails.creator} onChange={changeCreator} />
        </div> */}
        <div className="my-3">
          <label htmlFor="" className="Public" id="Public">Public</label>
          <span className="m-2">
            <Switch defaultChecked size='small ml-3 ' onChange={(change) => { changePublic(change) }} />
          </span>
        </div>
        <button className="save rounded-lg p-2 bg-sub-500 text-white" onClick={save}>Save</button>




        {saveSuccess === true ? <h3 className='w-full p-2 bg-green-200 rounded-lg my-4 border-2 border-green-300'>{'Successfully Saved'}</h3>
          : undefined}

      </div>
      <div className="wrapper border-2 border-dark-400 p-4 rounded-lg mb-4">
        <input type="file" className='mb-4' accept='' name="" id="" onChange={async (e) => {
          var pattern = /image-*/;

          if (!e.target.files[0].type.match(pattern)) {
            alert('Invalid format');
            return;
          }
          setImageSelected(e.target.files[0])
          const formData = new FormData()
          formData.append('file', e.target.files[0])
          formData.append("upload_preset", "hextree")
          let res = await axios.post("https://api.cloudinary.com/v1_1/dhlxchjon/image/upload", formData)
          setTestDetails({ ...testDetails, img: res.data.url })
        }
        } />

        <div className="bg-white rounded-lg w-full h-[10rem] flex justify-center items-center overflow-hidden">

          {imageSelected === undefined ? <UploadOutlined style={{ fontSize: '3rem', color: 'gray' }} /> :
            <Image
              style=
              {{
                width: 'full',
                height: 'full',
                marginLeft: '1rem',
                objectFit: 'cover'
              }}
              cloudName="hextree" publicId={testDetails.img} />}
        </div>
        {/* <div className="my-3">

          <label htmlFor="" className="name" id="name">Name</label>
          <input type="text" name="" id="" className="name bg-gray-50 border 
                        border-gray-300 text-gray-900 text-sm rounded-lg  focus:outline-none
                        focus:border-2 focus:border-gray-300 block w-full p-2.5" value={testDetails.name} onChange={changeName} />
        </div>
        <div className="my-3">
          <label htmlFor="" className="creator" id="creator">Creator</label>
          <input type="text" name="" id="" className="creator bg-gray-50 border 
                        border-gray-300 text-gray-900 text-sm rounded-lg  focus:outline-none
                        focus:border-2 focus:border-gray-300 block w-full p-2.5" value={testDetails.creator} onChange={changeCreator} />
        </div> */}





      </div>
    </div>
  )
}

export default TestMaker