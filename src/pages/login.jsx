import React, { useEffect, useState } from 'react'
import MinimalHeader from '../components/minimalHeader'
import ChangeThemeFB from '../components/changeThemeFB'
import SignInWithGoogleBtn from '../components/signInWithGoogle'
import axios from 'axios'
import { ToastContainer, toast, Bounce } from 'react-toastify'



export default function Login() {
  const [userEmail, setUserEmail] = useState('');
  const [psw, setPsw] = useState('');
  const [error, setError] = useState('')

  useEffect(() => {


  }, []);

  const handleEmail = (e) => {
    setUserEmail(e.target.value.trim())
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

      // const res = await axios.post('http://localhost:5000/api/auth/login', user)

      const res = {status : 200,data:{id:10}} // Mock response

      if (res.status === 200) {
       // localStorage.setItem('token', res.data.token)

        toast.success('Login Successful!')
        setTimeout(() => {
          window.location.href = `/dashboard/${res?.data?.id}`
        },5000)
        
      }else{
        toast.error('Login Failed!')
      }
    }
  }

  return (
    <div className='la-container h-[calc(100vh-80px)] flex-col'>
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
      <MinimalHeader />
      <ChangeThemeFB />
      <div className='flex h-full w-full  justify-center'>
        <div className='  w-[50%] flex justify-center items-center z-10 shadow-[0px_0px_10px_5px_rgba(0,_0,_0,_0.1)] rounded-[0px_20px_20px_0px]'>
          <div className=' flex flex-col w-[400px] shadow-[0px_0px_2px_1px_rgba(0,_0,_0,_0.1)] p-6 rounded-[20px] '>
            <h1 className=' font-bold'>Hi there,</h1>
            <p className=''>Welcome back to LexAyudha</p>
            <input type='email' placeholder='email' onChange={handleEmail} required className='my-2 p-2 shadow-[0px_0px_2px_1px_rgba(0,_0,_0,_0.1)] rounded-full px-4' />
            <input type='password' placeholder='password' onChange={handlePsw} required className='my-2 p-2 shadow-[0px_0px_2px_1px_rgba(0,_0,_0,_0.1)] rounded-full px-4' />
            <div>
              <a href='/forgotPassword' className='text-sm underline'>Forgot Password?</a>
            </div>
            <div className='error-div'>
              <p className='m-0 text-red-500'>{error}</p>
            </div>
            <div>
              <div className=' flex justify-center'>
                <button type='submit' onClick={handleSubmit} className='btn btn-primary m-0 px-4 py-1 rounded-xl w-full text-center mt-5 main-border-color'>Sign in</button>
              </div>
              <div className='flex items-center justify-evenly py-2'>
                <div className='w-[35%] h-[2px] bg-slate-900'></div>
                <p className='m-0'>or</p>
                <div className='w-[35%] h-[2px] bg-slate-900'></div>
              </div>
              <div className=' flex justify-center py-2'>
                <SignInWithGoogleBtn />
              </div>
              <div className=' flex justify-center pt-10'>
                <p >Don't have an account? <a href='/register' className=' underline'>Sign up</a></p>
              </div>
            </div>

          </div>
        </div>
        <div className='  w-[50%] primary-color-bg la-login-right-panel'></div>
      </div>
    </div>
  )
}