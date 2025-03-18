import React, { useEffect, useState } from 'react'
import MinimalHeader from '../components/minimalHeader';
import axiosInstance from '../api/axiosInstance';
import { decodeToken } from '../utils/tokenUtils';
import { ToastContainer, toast, Bounce } from 'react-toastify'
import ScreenLoader from '../components/screenLoader';

export default function YourAccounts() {

  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const [loginPane, setLoginPane] = useState(false)
  const [userIndex, setUserIndex] = useState()
  const [userEmail, setUserEmail] = useState('');
  const [psw, setPsw] = useState('');
  const [error, setError] = useState('')

  useEffect(() => {

    getAccountList()

  }, []);

  const getAccountList = async () => {

    const parsedToken = decodeToken('refreshToken')
    setUserEmail(parsedToken?.email)
    try {
      if (parsedToken) {
        const res = await axiosInstance.get(`/user/list/${parsedToken?.email}`)

        if (res?.status === 200) {

          setUserList(res?.data)
          setIsLoading(false)
        }
      } else {
        setUserList([]);
        setIsLoading(false)
      }

    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }

  const handleLoginPane = (index) => {
    setUserIndex(index)
    
    setLoginPane(true)
  }

  const handlePsw = (e) => {
    setPsw(e.target.value)
  }


  const validateInput = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (userEmail === '') {
      setError('Email is required');
      return false;
    } else if (!emailRegex.test(userEmail)) {
      setError('Invalid email');
      return false;
    }

    if (psw === '') {
      setError('Password is required');
      return false;
    } else if (psw.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    setError(''); // Clear any previous error messages
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateInput()) {
      const user = {
        email: userEmail,
        password: psw
      }

      const res = await axiosInstance.post('/auth/login', user, {
        validateStatus: (status) => status < 500, // Accept any status under 500
      });

      if (res?.status === 200) {
        localStorage.setItem('accessToken', res?.data?.accessToken)
        localStorage.setItem('refreshToken', res?.data?.refreshToken)

        toast.success('Login Successful!')
        setTimeout(() => {
          const userId = JSON.parse(atob(res?.data?.accessToken.split('.')[1]))?.userId;
          window.location.href = `/dashboard/${userId}`
        }, 5000)

      } else if (res.status === 401) {
        // Handle unauthorized error gracefully
        toast.error('Unauthorized! Please check your credentials.');
      } else {
        toast.error('Login Failed!');
      }
    }
  }

  return (
    <><MinimalHeader />
       {isLoading ? <ScreenLoader/>:'' } 
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <div className='la-container  flex flex-col your-account-bg h-screen'>


        <div className=' flex w-full h-full justify-center items-center '>
          {userList.length === 0 ? (
            <div className=' flex flex-col p-5 primary-color-bg rounded-xl shadow-[0px_0px_6px_0px_rgba(0,_0,_0,_0.1)]  w-[400px] '>
              <h2 className='mt-1'>Hmm..,</h2>
              <p className='m-0'>Looks like it's your first time here.</p>

              <div className='flex justify-evenly items-center mt-10'>
                <a className='m-0 py-[5px] px-[16px] rounded-[6px] border border-[var(--primary-color)] hover:border-[#0066cc] text-[#0066cc] cursor-pointer transition duration-300' href='/login'>
                  login
                </a>
                <a className='m-0 bg-[#0066cc] hover:bg-[#0066cc99] text-white py-[8px] px-[16px] rounded-[6px] w-fit text-wrap text-center text-sm cursor-pointer transition duration-300' href='/register'>
                  Create account
                </a>
              </div>
            </div>
          ) : (
            <div className=' flex flex-col items-center p-5 primary-color-bg rounded-xl shadow-[0px_0px_6px_0px_rgba(0,_0,_0,_0.1)]  w-[400px] '>
              {loginPane ? (
                <div className='flex flex-col items-center w-full'>
                  <h1 className='mb-[25px]'>Sign In</h1>
                  <img src={userList[userIndex]?.proPic} alt='' className=' w-[150px] h-[150px] object-cover rounded-full'></img>
                  <p className='mt-[10px] text-lg'>{userList[userIndex]?.userName}</p>
                  <div className='flex flex-col items-center w-full mt-[25px]'>
                    <input type='password' placeholder='password' onChange={handlePsw} required className=' p-2 shadow-[0px_0px_2px_1px_rgba(0,_0,_0,_0.1)] w-[80%] rounded-md px-4' />
                    <div className='error-div'>
                      <p className='m-0 text-red-500'>{error}</p>
                    </div>
                    <div className=' flex justify-center w-[80%]'>
                      <button type='submit' onClick={handleSubmit} className=' w-full m-0 px-4 py-2 rounded-md text-center mt-5 bg-blue-600 text-white w-[200px] hover:bg-blue-700 '>Sign in</button>
                    </div>
                    
                  </div>

                  <div className='mt-[10px]'>
                    <a href='/forgotPassword' className='text-sm underline'>Forgot Password?</a>
                  </div>
                  <div className = 'pt-[25px]'>
                      <p className='m-0 cursor-pointer hover:text-[#0066cc] transition duration-300' onClick={() =>setLoginPane(false)}>Go back</p>
                    </div>
                </div>
              ) : (
                < div className=' w-full'>
                  <h2 className='mt-1'>Choose an account</h2>
                  <div className='flex flex-col overflow-x-hidden  overflow-y-auto h-[300px]'>
                    {userList.map((user, index) => {
                      return (
                        <div onClick={() => handleLoginPane(index)} >
                          <div key={index} className='flex flex-row justify-between align-middle   '>
                            <div className='flex flex-row items-center shadow-[0px_0px_2px_1px_rgba(0,_0,_0,_0.1)] px-2 w-[98%] m-1 rounded-md cursor-pointer hover:bg-[#00000010] transition duration-300'>
                              <img src={user.proPic} alt='profile-pic' className=' w-12 h-12 rounded-md mr-5' />
                              <div className='flex flex-col justify-around py-2'>
                                <p className='m-0 text-lg'>{user.userName}</p>
                                <p className='m-0 text-sm'>{user.email}</p>
                              </div>
                            </div>


                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className=' flex justify-center py-5'>
                    <p className='m-0 text-[#666] text-[14px]'>Don't see your account?</p>
                  </div>
                  <div className='flex justify-evenly items-center'>
                    <a className='m-0 py-[5px] px-[16px] rounded-[6px] border  border-[var(--primary-color)] hover:border-[#0066cc] text-[#0066cc] cursor-pointer transition duration-300' href='/login'>
                      login
                    </a>
                    <a className='m-0 bg-[#0066cc] hover:bg-[#0066cc99] text-white py-[8px] px-[16px] rounded-[6px] w-fit text-wrap text-center text-sm cursor-pointer transition duration-300' href='/register'>
                      Create account
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </>
  )
}