import React, { useEffect, useState } from 'react'
import MinimalHeader from '../components/minimalHeader';
import ChangeThemeFB from '../components/changeThemeFB';

export default function YourAccounts() {

  const [userList, setUserList] = useState([]);
  //Placeholder object to replicate actual user obj
  const obj = {
    'name': 'Lorem Ipsume',
    'email': 'loremipsume@gmail.com',
    'proPic': 'https://superherotar.framiq.com/assets/examples/superherotar02.png'
  }
  let ul = [];
  useEffect(() => {

    for (let i = 0; i < 10; i++) {
      ul.push(obj);
    }
    setUserList(ul);
  }, []);

  return (
    <div className='la-container flex flex-col your-account-bg h-screen'>

      <MinimalHeader />
      <div className=' flex w-full h-full justify-center items-center '>
        {userList.length === 0 ? (
          <div className=' flex flex-col p-5 primary-color-bg rounded-xl shadow-[0px_0px_6px_0px_rgba(0,_0,_0,_0.1)]  w-[400px] '>
          <h2 className='mt-1'>Hmm..,</h2>
          <p className='m-0'>Looks like it's your first time here.</p>
          
          <div className='flex justify-evenly items-center mt-10'>
            <a className='btn btn-primary m-0 px-4 py-1 rounded-3xl main-border-color cursor-pointer' href='/login'>login</a>
            <p className='m-0'>or</p>
            <a className='m-0 underline underline-offset-1 w-fit text-wrap text-center text-sm cursor-pointer' href='/register'>Click here to Register</a>
          </div>
        </div>
        ) : (
          <div className=' flex flex-col p-5 primary-color-bg rounded-xl shadow-[0px_0px_6px_0px_rgba(0,_0,_0,_0.1)]  w-[400px] '>
          <h2 className='mt-1'>Your accounts,</h2>
          <div className='flex flex-col overflow-x-hidden  overflow-y-auto h-[300px]'>
            {userList.map((user, index) => {
              return (
                <a href='#' target='' >
                  <div key={index} className='flex flex-row justify-between align-middle '>
                    <div className='flex flex-row items-center shadow-[0px_0px_2px_1px_rgba(0,_0,_0,_0.1)] px-2 w-[98%] m-1 rounded-md main-border-color'>
                      <img src={user.proPic} alt='profile-pic' className=' w-12 h-12 rounded-md mr-5' />
                      <div className='flex flex-col justify-around py-2'>
                        <p className='m-0 text-lg'>{user.name}</p>
                        <p className='m-0 text-sm'>{user.email}</p>
                      </div>
                    </div>


                  </div>
                </a>
              )
            })}
          </div>
          <div className=' flex justify-center py-5'>
            <p className='m-0'>Account not listed here?</p>
          </div>
          <div className='flex justify-evenly items-center'>
            <a className='btn btn-primary m-0 px-4 py-1 rounded-3xl main-border-color cursor-pointer' href='/login'>login</a>
            <p className='m-0'>or</p>
            <a className='m-0 underline underline-offset-1 w-fit text-wrap text-center text-sm cursor-pointer' href='/register'>Click here to Register</a>
          </div>
        </div>
        )}
        
      </div>
     
    </div>
  )
}