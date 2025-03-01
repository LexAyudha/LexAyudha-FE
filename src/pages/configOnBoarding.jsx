import React, { useEffect, useState } from 'react'
import ChangeThemeFB from '../components/changeThemeFB'
import { Button, Checkbox } from 'antd'

export default function ConfigOnBoardingPage() {

    const [agreeTerms, setAgreeTerms] = useState(false)

    const handleAgreeTerms = (e) => {
        setAgreeTerms(e.target.checked);
    }

    const user = {
        id: '10',
        name: 'Lorem Ipsum',
        email: ''
    }

    return (
        <div className='la-container flex h-screen  flex-col justify-center items-center'>
            <ChangeThemeFB />
            <div className='flex h-[650px] w-[1200px] text-wrap  flex-col justify-between relative'>
                <div className='absolute flex right-0 top-0'>
                    {/* Need insert training selection page link */}
                    <a href='/selectTraining' className='theme-txt-color py-[5px] primary-color-bg rounded-md px-[30px]'> Skip</a>
                </div>
                <div className='flex flex-col'>
                    <h1 className='my-[32px]'>Before we start,</h1>
                    <div className='flex flex-col px-[20px]'>
                        <p>we'll run a few quick tests to tailor the experience just for you. These tests will help us understand your unique strengths and adapt the tool to your needs.</p>
                        <div className='flex flex-col'>
                            <h3>Here's what to expect:</h3>
                            <ul className='list-disc pl-[40px]'>
                                <li>A brief speaking test</li>
                                <li>A quick visual test with different colors</li>
                                <li>A short color perception test</li>
                            </ul>
                        </div>
                        <p className='pt-[32px] pb-[16px]'>Don't worry, these aren't graded! They're simply to help us customize your learning experience.</p>
                        <p className='pb-[32px]'>After these tests, you'll be able to choose between reading skills or math skills training.</p>

                        <div className='flex items-center'>
                            <Checkbox onChange={handleAgreeTerms} checked={agreeTerms} className=' mr-[10px]'></Checkbox>
                            <p className='m-0'>By checking you agree to the LexAyudha's <a href='/terms' target='_blank' className='text-blue-500'>Terms & Conditions</a> and <a href='/privacy' target='_blank' className='text-blue-500'>Privacy Policy</a></p>
                        </div>
                    </div>

                </div>
                <div className='flex items-center w-full justify-center'>
                    <div className='flex flex-col text-center items-center'>
                        <a href='/speechCalibration' className={`py-[5px] w-[200px] rounded-md ${!agreeTerms ? 'bg-gray-200 cursor-not-allowed border-[#d9d9d9] border-2 text-[#00000040] bg-[#0000000A]' : 'primary-color-bg'}`}> Start Tests <i className="fa-solid fa-chevron-right ml-[5px]"></i></a>
                        <a href={`/dashboard/${user.id}`} className='theme-txt-color mt-[10px]'><i className="fa-solid fa-chevron-left mr-[5px]"></i> go back</a>
                    </div>

                </div>
            </div>

        </div>
    )
}