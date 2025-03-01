import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ChangeThemeFB from '../components/changeThemeFB'
import axios from 'axios';
import ChromaticModel from '../components/chromaticModel';


const lessonList = [
  {
    id: '01',
    name: 'Lesson 1',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    example: 'The cat is orange and is so sweet.',
    chromaticTheme: 'chromTheme_1'
  },
  {
    id: '02',
    name: 'Lesson 2',
    description: 'Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula.',
    example: 'The dog barked loudly at the stranger.',
    chromaticTheme: 'chromTheme_2'
  },
  {
    id: '03',
    name: 'Lesson 3',
    description: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Fusce id purus. Ut varius tincidunt libero. Phasellus dolor. Maecenas vestibulum mollis diam.',
    example: 'She quickly ran towards the bus stop.',
    chromaticTheme: 'chromTheme_3'
  },
  {
    id: '04',
    name: 'Lesson 4',
    description: 'Donec quis dui at dolor tempor interdum. Vivamus mollis hendrerit ex. Sed et nisi sit amet sapien feugiat convallis. Morbi ultricies justo quis orci pharetra, nec lacinia elit sagittis.',
    example: 'The flowers bloomed beautifully in the garden.',
    chromaticTheme: 'chromTheme_4'
  },
  {
    id: '05',
    name: 'Lesson 5',
    description: 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed bibendum, ante vitae aliquet volutpat, quam ligula vehicula nunc, eu tincidunt justo erat ut augue.',
    example: 'He carefully placed the books on the shelf.',
    chromaticTheme: 'chromTheme_5'
  }
];

export default function DyslexicTrainingControlPanel() {

  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(lessonList[0])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [selectedChromaticTheme, setSelectedChromaticTheme] = useState(lessonList[0].chromaticTheme)

  const navigate = useNavigate()

  useEffect(() => {
    setLessons(lessonList);
    
  }, []);


  const handleClickedLesson = (index) => {
    setSelectedLesson(lessons[index]);
    setSelectedIndex(index)
    setSelectedChromaticTheme(lessons[index].chromaticTheme)
  }

  const handleStartLesson = ()=>{
    
    navigate(`/screen-reader-lessons/${selectedLesson?.id}`)
 
  }
  // const getLessons = async()=>{

  //   const res = await axios.get('api-call');

  //   if(res?.success){
  //     setLessons(res?.data);
  //   }
  // }

  return (
    <div className='la-container relative flex flex-col h-screen justify-center items-center'>
      <ChangeThemeFB />
      <div className='flex justify-start w-full absolute top-0'>
        <h2>Screen Reader</h2>
      </div>
      <div className='flex flex-col w-full  min-w-full justify-center'>
        <h3 className='my-[20px]'>Lessons</h3>
        <div className='flex h-[500px]'>
          <div className='flex flex-col w-1/4 bg-black bg-opacity-5 rounded-lg'>
            <ul>
              {lessons.map((Item, index) => {
                return (
                  <li key={index} className={`shadow-md ${index === selectedIndex ? ' inset-0 bg-black bg-opacity-10 pointer-events-none' : ''}`} >
                    <div className='flex justify-center py-[10px] cursor-pointer' onClick={() => handleClickedLesson(index)}>
                      {Item?.name}
                    </div>
                    
                  </li>
                )
              })}
            </ul>
          </div>
          <div className='w-[2px] h-full primary-color-bg mx-[20px]'></div>
          <div className='flex flex-col w-3/4 justify-between'>
            <div className='flex flex-col justify-between'>
              <h3 className='pb-[16px]'>{selectedLesson?.name}</h3>
              <p className='h-[150px] overflow-x-hidden'>{selectedLesson?.description}</p>
              <div className=' mt-[20px]'>
                <p>Ex: </p>
                <span className=' text-[36px]'>{selectedLesson?.example}</span>
              </div>
            </div>
            <div className='flex justify-between items-center'>
              <div className='cursor-pointer'>
                <ChromaticModel initialChromaticTheme={''} onChromaticThemeChange={''} />
              </div>
              <a target='' onClick={handleStartLesson} className='flex cursor-pointer items-center justify-center primary-color-bg rounded-md py-[10px] px-[35px] '>
                <div className='flex group relative items-center'>
                  <p className='m-0'>Start</p>
                  <i class="fa-solid fa-chevron-right ml-[5px]"></i>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full"></span>
                </div>

              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}