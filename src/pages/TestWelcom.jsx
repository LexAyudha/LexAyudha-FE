import React, { useEffect, useState } from 'react'
import ChangeThemeFB from '../components/changeThemeFB.jsx'
import dyl_t_bg from '../assets/Dyslexic_t_bg.png'
import dyc_t_bg from '../assets/Dyscalculic_t_bg.png'


export default function Pagename() {

    useEffect(() => {

    }, []);

    return (
        <div className='  w-screen h-screen flex justify-center'>
            <div id='LA-container' className='  flex flex-col justify-center  w-full mx-44'>
                <h1 className=' text-5xl text-center my-12'>Select the Training Type</h1>
                <div className=' w-full px-20 py-10 flex justify-between items-center'>
                    <div className='dyl-choose-training-bg w-[350px] h-[350px] flex justify-center items-center primary-color-bg rounded-lg '>
                        <a href='#' target='' >
                            <div className=' px-10 py-5 main-border-color rounded-md'>

                                <p>Dyslexic training</p>


                            </div>
                        </a>
                    </div>

                    <div className='dysc-choose-training-bg w-[350px] h-[350px] flex justify-center items-center primary-color-bg align-middle rounded-lg'>
                        <a href='#' target='' >
                            <div className=' px-10 py-5 main-border-color rounded-md  '>

                                <p>Dyscalculia training</p>


                            </div>
                        </a>
                    </div>
                </div>

                <ChangeThemeFB />

            </div>

        </div>
    )
}