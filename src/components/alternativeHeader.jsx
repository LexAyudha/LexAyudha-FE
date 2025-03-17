import React, { useEffect, useState } from 'react'
import logo from '../assets/lexLogo.png'
import { decodeToken } from '../utils/tokenUtils';
import axiosInstance from '../api/axiosInstance';
import { DownOutlined, SettingOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';



export default function AlternativeHeader({ title = 'LexAyudha' }) {
    const [user, setUser] = useState()
    useEffect(() => {
        getUserDetails()
    }, []);
    const getUserDetails = async () => {
        const parsedToken = decodeToken('refreshToken')

        try {
            if (parsedToken) {
                const res = await axiosInstance.get(`/user/${parsedToken?.userId}`)

                if (res?.status === 200) {

                    setUser(res?.data)

                }
            }

        } catch (error) {
            console.log(error)
        }
    }

    const handleRedirect  = (redirectPath) => {
       
        window.location.href = redirectPath
    }

    const handleLogOut = () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
    }
    const items = [
        {
            key: '1',
            label: (<div >
                <p className='m-0 cursor-pointer' onClick={()=>handleRedirect(`/dashboard/${user?._id}`)}>Dashboard</p>
            </div>),
            
        },
    
        {
            key: '2',
            label: (<div >
                <p className='m-0' onClick={()=>handleRedirect(`/dyslexic-training`)}>Dyslexic Training</p>
            </div>),
    
        },
        {
            key: '3',
            label: (<div >
                <p className='m-0' onClick={()=>handleRedirect(`/dyscalculic-training`)}>Dyscalculic Training</p>
            </div>),
    
        },
        {
            key: '4',
            label: (<div >
                <p className='m-0' onClick={handleLogOut}>Log Out</p>
            </div>),
            danger: true,
        },
    
    ];
    

    return (
        <div className='w-full z-40 absolute top-0  flex h-20  items-center justify-center'>
            <div className='items-center la-container flex w-fit justify-between'>
                <div className='flex justify-start items-center'>
                    <div className='w-[50px] h-[50px] mr-2 cursor-pointer' onClick={()=>handleRedirect(`/dashboard/${user?._id}`)}>
                        <img src={logo} alt='LexAyudha logo' />
                    </div>
                    <h2 className='h-fit w-fit m-0'>{title}</h2>
                </div>
                <div className=' flex items-center'>
                    <div className='flex px-[20px] items-center'>
                        <Dropdown
                            menu={{
                                items,
                            }}

                        >
                            <a onClick={(e) => e.preventDefault()}>
                                <Space className=' w-[150px]'>
                                    <div className='w-fit flex '>
                                        <p className=' m-0 cursor-pointer '>Quick Links</p>
                                        <DownOutlined />
                                    </div>

                                </Space>
                            </a>
                        </Dropdown>
                    </div>
                    <img src={user?.proPic} alt='' className='w-[45px] h-[45px] rounded-full cursor-pointer' onClick={()=>handleRedirect(`/dashboard/${user?._id}`)}></img>
                </div>
            </div>


        </div>
    )
}