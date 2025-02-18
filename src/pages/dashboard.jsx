import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Image } from 'antd'
import logo from '../assets/lexLogo.png'
import DashTraining from '../components/dashTraining.jsx'
import DashSettings from '../components/dashSettings.jsx'
import DashAchievements from '../components/dashAchive.jsx'
import DashBilling from '../components/dashBilling.jsx'
import DashPerformance from '../components/dashPerfRecords.jsx'
import DashCustomize from '../components/dashCustLesson.jsx'
import axios from 'axios';


export default function Dashboard() {
  // Add states, hooks, and other functions
  // Example: const [state, setState] = useState(initialState)
  // Example: useEffect(() => { /* effect logic */ }, [dependencies])
  // Example: const handleChange = () => { /* handle change logic */ }

  const [userData, setUserData] = useState({})
  const [panel, setPanel] = useState('training')

  const user = {
    name: 'Lorem Ipsum',
    email: 'loremepsium@gmail.com',
    proPic: 'https://icon-library.com/images/famous_character_-_add_on_1-27-512.png',
    coverPic: 'https://xansan.com/wp-content/uploads/2018/10/default-cover.gif'
  }

  const fallbacks = {
    proPic: 'https://ik.imagekit.io/75mgj6y0wrj/https://flickchartavatars.blob.core.windows.net/web/97cb634b-efa1-47cc-b511-10edc1b73f5a.png',
    coverPic: 'https://greenwipes.com.my/wp-content/uploads/2021/06/Hero-Banner-Placeholder-Light-2500x1172-1-1536x720.png'
  }

  useEffect(() => {
    fetchUserData();
  }, [])

  const fetchUserData = async () => {
    // Fetch user data from the server
    try {

      //const res = await axios.get(`http://localhost:5000/api/user/${id}`)
      const res = { status: 200, data: user }

      if (res.status === 200) {
        setUserData(res.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handlelogout = () => {
    //localStorage.removeItem('token')
    window.location.href = '/login'
  }

  const handleProPicEdit = () => { }
  const handleCoverPicEdit = () => { }

  const togglePanel = (panelProp) => {
    switch (panelProp) {
      case 'training':
        setPanel('training')
        break;
      case 'performance':
        setPanel('performance')
        break;
      case 'achievements':
        setPanel('achievements')
        break;
      case 'billings':
        setPanel('billings')
        break;
      case 'customize':
        setPanel('customize')
        break;
      case 'settings':
        setPanel('settings')
        break;

      default:
        setPanel('training')
        break;
    }
  }

  return (
    <div className='la-container flex'>

      <div className='w-[360px] h-screen primary-color-bg z-10 flex flex-col justify-between'>

        <div className='flex items-center justify-start px-2 py-2'>
          <div className='w-[50px] h-[50px] mr-2'>
            <img src={logo} alt='LexAyudha logo' />
          </div>
          <h2 className='h-fit m-0'>LexAyudha</h2>
        </div>
        <div className='flex flex-col items-center h-[calc(100%-90px)] justify-between'>
          <div className='w-full flex flex-col items-center'>
            <div className='relative w-fit '>
              <div className='w-[150px] h-[150px] rounded-full shadow-[0px_0px_5px_1px_rgba(0,_0,_0,_0.1)] overflow-hidden'>
                <i className="fas fa-pencil-alt rounded-full p-1.5 primary-color-bg main-border-color shadow-[0px_0px_2px_1px_rgba(0,_0,_0,_0.1)] border-2 absolute right-1 bottom-1 z-20 cursor-pointer" onClick={handleProPicEdit}></i>
                <Image src={userData.proPic ? userData.proPic : fallbacks.proPic} alt='profile picture' />
              </div>

            </div>
            <div className='flex flex-col items-center justify-between'>
              <div className='flex items-center group cursor-pointer '>
                <h2 className='mb-0.8'>{userData?.name}</h2>
                <i className="fas fa-pencil-alt ml-5 mt-3 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300" onClick={handleProPicEdit}></i>
              </div>
              <div className='flex'>
                <h4 className='m-0 text-gray-500'>{userData?.email}</h4>
              </div>

            </div>
          </div>
          <div className='w-full h-full mt-[32px] flex flex-col justify-between '>
            <div className='flex flex-col items-start mb-5 w-full'>
              <div className={`pl-4 flex flex-row items-center py-2 cursor-pointer w-full ${panel === 'training' ? 'bg-gray-200' : 'hover:bg-gray-200'}`} onClick={() => togglePanel('training')}>
                <i className="fas fa-chalkboard-user mr-2"></i>
                <p className='m-0 pl-2'>Training</p>
              </div>
              <div className={`pl-4 flex flex-row items-center py-2 cursor-pointer w-full ${panel === 'performance' ? 'bg-gray-200' : 'hover:bg-gray-200'}`} onClick={() => togglePanel('performance')}>
                <i className="fas fa-chart-column mr-2"></i>
                <p className='m-0 pl-2'>Performance Records</p>
              </div>
              <div className={`pl-4 flex flex-row items-center py-2 cursor-pointer w-full ${panel === 'achievements' ? 'bg-gray-200' : 'hover:bg-gray-200'}`} onClick={() => togglePanel('achievements')}>
                <i className="fas fa-trophy mr-2"></i>
                <p className='m-0 pl-2'>Achievements</p>
              </div>
              <div className={`pl-4 flex flex-row items-center py-2 cursor-pointer w-full ${panel === 'billings' ? 'bg-gray-200' : 'hover:bg-gray-200'}`} onClick={() => togglePanel('billings')}>
                <i className="fas fa-wallet mr-2"></i>
                <p className='m-0 pl-2'>Billings</p>
              </div>
              <div className={`pl-4 flex flex-row items-center py-2 cursor-pointer w-full ${panel === 'customize' ? 'bg-gray-200' : 'hover:bg-gray-200'}`} onClick={() => togglePanel('customize')}>
                <i className="fas fa-pen-ruler mr-2"></i>
                <p className='m-0 pl-2'>Customize Lessons</p>
              </div>
              <div className={`pl-4 flex flex-row items-center py-2 cursor-pointer w-full ${panel === 'settings' ? 'bg-gray-200' : 'hover:bg-gray-200'}`} onClick={() => togglePanel('settings')}>
                <i className="fas fa-cog mr-2"></i>
                <p className='m-0 pl-2'>Settings</p>
              </div>

            </div>
            <div className='py-[20px]'>
              <div className='flex w-full justify-center  flex-row items-center text-red-500 self-center py-2 cursor-pointer' onClick={handlelogout}>
                <i className="fas fa-sign-out-alt mr-2"></i>
                <p className='m-0'>Logout</p>
              </div>
            </div>

          </div>

        </div>

      </div>
      <div className=' w-full relative bg-gray-200 flex flex-col items-center justify-center'>
        <div className='w-full h-[320px] z-[0] group relative'>
          <img src={userData.coverPic ? userData.coverPic : fallbacks.coverPic} className='w-full h-full object-cover' alt='cover picture' />
          <div className='absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center items-center'>
            <button className='border border-white text-white px-4 py-2 rounded-md' onClick={handleCoverPicEdit}>Change Cover</button>
          </div>
        </div>
        <div className='w-full p-[14px] h-[calc(100vh-320px)] flex items-center justify-center'>
          <div className='primary-color-bg w-full  bottom-0 px-10 py-5 z-[5]   rounded-md '>
            {panel === 'training' && (
              <DashTraining />
            )}
            {panel === 'performance' && (
              <DashPerformance />
            )}
            {panel === 'achievements' && (
              <DashAchievements />
            )}
            {panel === 'billings' && (
              <DashBilling />
            )}
            {panel === 'customize' && (
              <DashCustomize />
            )}
            {panel === 'settings' && (
              <DashSettings />
            )}
          </div>

        </div>

      </div>

    </div>
  )
}