import React, { useEffect, useState } from 'react'
import MinimalHeader from '../components/minimalHeader'
import ChangeThemeFB from '../components/changeThemeFB'
import SignInWithGoogleBtn from '../components/signInWithGoogle'
import axios from 'axios'
import { ToastContainer, toast, Bounce } from 'react-toastify'
import { data } from 'react-router-dom'



export default function Register() {
    const [userEmail, setUserEmail] = useState('');
    const [psw, setPsw] = useState('');
    const [rePsw, setRePsw] = useState('');
    const [error, setError] = useState('');
    const [otp, setOtp] = useState();
    const [userOtp, setUserOtp] = useState();
    const [stepCompleted, setStepCompleted] = useState(false);

    useEffect(() => {


    }, []);

    const handleEmail = (e) => {
        setUserEmail(e.target.value.trim())
    }

    const handlePsw = (e) => {
        setPsw(e.target.value)
    }

    const handleRePsw = (e) => {
        setRePsw(e.target.value)
    }

    const validateInput = (param = null) => {
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

        if(param === null){
            if (rePsw !== psw) {
                setError('Passwords do not match');
                return false;
            }
        }
        
        setError(''); // Clear any previous error messages
        return true;
    };

    const generateOTP = async () => {
        const user = {
            email: userEmail
        }

        // const res = await axios.post('http://localhost:5000/api/auth/generateOTP', user)

        const res = {
            status: 200,
            data: {
                otp: 123456
            }
        } // Mock response

        if (res?.status === 200) {
            toast.success('OTP code sent!')
            setOtp(parseInt(res?.data?.otp,10));
            return true

        } else {
            toast.error('Failed to send OTP code!')
            return false
        }
    }

    const handleStepCompleted = async() => {
        if (validateInput()) {
            if( await generateOTP()){
                setStepCompleted(true);
            } 
        }
    }
    const handleVerifyOTP = async (e) => {
        if (verifyOTP(e)) {
            handleSubmit(e);
        }
    }

    const handleOtpInput = (e) => {
        setUserOtp(parseInt(e.target.value,10));
    }
    const verifyOTP = (e) => {
        if (userOtp == otp) {
            return true
        } else if (otp == '') {
            setError('OTP is required');
            return false;
        } else if (userOtp != otp) {
            console.log(userOtp, otp)
            setError('Invalid OTP');
            return false;
        }
        setError(''); // Clear any previous error messages 
    }

      const automatedLogin = async () => {
        
        if (validateInput('login')) {
          const user = {
            email: userEmail,
            password: psw
          }
    
          // const res = await axios.post('http://localhost:5000/api/auth/login', user)
    
          const res = {status : 200, data:{id:2}} // Mock response
          
          if (res.status === 200) {
           //localStorage.setItem('token', res.data.token)

            return res?.data?.id
          }else{
            return false
          }
        }
      }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateInput()) {
            const user = {
                email: userEmail,
                password: psw
            }

            // const res = await axios.post('http://localhost:5000/api/auth/register', user)

            const res = { status: 200 } // Mock response

            if (res.status === 200) {
                // localStorage.setItem('token', res.data.token)

                toast.success('Registration Successful!')
                setTimeout(async() => {
                    const id = await automatedLogin()
                    if(id){
                        window.location.href = `/dashboard/${id}`
                    }else{
                        window.location.href = '/login'
                    }
                }, 5000)

            } else {
                toast.error('Registration Failed!')
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
                <div className='  w-[50%] flex justify-center  items-center z-10 shadow-[0px_0px_10px_5px_rgba(0,_0,_0,_0.1)] rounded-[0px_20px_20px_0px]'>
                    <div className=' flex flex-col w-[400px] shadow-[0px_0px_2px_1px_rgba(0,_0,_0,_0.1)] rounded-[20px] p-6'>
                        
                        {!stepCompleted ? (
                            <>
                            <h1 className=' font-bold'>Register Now!</h1>
                            <p className=''>let's get you started...</p>
                                <input type='email' placeholder='email' onChange={handleEmail} required className='my-2 p-2 shadow-[0px_0px_2px_1px_rgba(0,_0,_0,_0.1)] rounded-full px-4' />
                                <input type='password' placeholder='password' onChange={handlePsw} required className='my-2 p-2 shadow-[0px_0px_2px_1px_rgba(0,_0,_0,_0.1)] rounded-full px-4' />
                                <input type='password' placeholder='re-enter password' onChange={handleRePsw} required className='my-2 p-2 shadow-[0px_0px_2px_1px_rgba(0,_0,_0,_0.1)] rounded-full px-4' />
                                <div className='error-div'>
                                    <p className='m-0 text-red-500'>{error}</p>
                                </div>
                                <div className=' flex justify-center'>
                                    <button type='submit' onClick={handleStepCompleted} className='btn btn-primary m-0 px-4 py-1 rounded-xl w-full text-center mt-5 main-border-color'>Sign up</button>
                                </div>
                            </>
                        ) : (
                            <>
                            <h1 className=' font-bold'>Verify Account</h1>
                            <p className=''>Please enter the OTP code sent to your email..</p>
                                <input type='number' placeholder='Enter OTP' onChange={handleOtpInput} required className='my-2 p-2 shadow-[0px_0px_2px_1px_rgba(0,_0,_0,_0.1)] rounded-full px-4' />
                                <div className='error-div'>
                                    <p className='m-0 text-red-500'>{error}</p>
                                </div>
                                <div className=' flex justify-center'>
                                    <button type='submit' onClick={handleVerifyOTP} className='btn btn-primary m-0 px-4 py-1 rounded-xl w-full text-center mt-5 main-border-color'>Verify</button>
                                </div>
                            </>
                        )}
                        <div className='flex items-center justify-evenly py-2'>
                            <div className='w-[35%] h-[2px] bg-slate-900'></div>
                            <p className='m-0'>or</p>
                            <div className='w-[35%] h-[2px] bg-slate-900'></div>
                        </div>
                        <div className=' flex justify-center py-2'>
                            <SignInWithGoogleBtn  />
                        </div>
                        <div className=' flex justify-center pt-10'>
                            <p >Already have an account? <a href='/login' className=' underline'>Sign in</a></p>
                        </div>
                    </div>
                </div>
                <div className='  w-[50%] primary-color-bg la-login-right-panel'></div>
            </div>
        </div>
    )
}