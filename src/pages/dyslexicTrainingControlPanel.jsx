import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ChangeThemeFB from '../components/changeThemeFB'
import axios from 'axios';
import ChromaticModel from '../components/chromaticModel';
import AlternativeHeader from '../components/alternativeHeader';


// const lessonList = [
//   {
//     id: '01',
//     name: 'Lesson 1',
//     description: 'A simple start with two-word sentences.',
//     example: 'Cat sleeps.',
//     chromaticTheme: 'chromTheme_1',
//     chapters: [
//       'Cat runs.',
//       'Dog barks.',
//       'Bird flies.',
//       'Sun shines.',
//       'Rain falls.',
//       'Wind blows.',
//       'Tree grows.',
//       'Fish swims.',
//       'Clock ticks.',
//       'Leaf drops.',
//       'Baby laughs.'
//     ]
//   },
//   {
//     id: '02',
//     name: 'Lesson 2',
//     description: 'Slightly longer sentences with three words.',
//     example: 'The dog barks.',
//     chromaticTheme: 'chromTheme_2',
//     chapters: [
//       'The cat sleeps.',
//       'She runs fast.',
//       'Birds fly high.',
//       'He eats apples.',
//       'The sun sets.',
//       'Clouds move slowly.',
//       'Fish swim deep.',
//       'Wind blows strong.',
//       'Flowers bloom beautifully.',
//       'The dog jumps.',
//       'Rain falls gently.'
//     ]
//   },
//   {
//     id: '03',
//     name: 'Lesson 3',
//     description: 'Building up complexity with four-word sentences.',
//     example: 'She quickly ran away.',
//     chromaticTheme: 'chromTheme_3',
//     chapters: [
//       'The boy runs fast.',
//       'She drinks warm tea.',
//       'Clouds cover the sky.',
//       'They play outside happily.',
//       'The baby smiles brightly.',
//       'He reads a book.',
//       'Waves crash on rocks.',
//       'The sun rises early.',
//       'Leaves fall in autumn.',
//       'The dog barks loudly.',
//       'A cat sleeps peacefully.'
//     ]
//   },
//   {
//     id: '04',
//     name: 'Lesson 4',
//     description: 'Introducing five-word sentence structures.',
//     example: 'The flowers bloom in spring.',
//     chromaticTheme: 'chromTheme_2',
//     chapters: [
//       'The bird sings every morning.',
//       'She walks to school daily.',
//       'The baby laughs so loudly.',
//       'Raindrops fall on the ground.',
//       'The wind blows very strong.',
//       'He quickly runs to work.',
//       'The car moves very fast.',
//       'They enjoy playing outside together.',
//       'Leaves turn red in autumn.',
//       'The sun sets behind mountains.',
//       'A dog chases the ball.'
//     ]
//   },
//   {
//     id: '05',
//     name: 'Lesson 5',
//     description: 'Challenging six-word sentence patterns.',
//     example: 'He carefully placed the books neatly.',
//     chromaticTheme: 'chromTheme_3',
//     chapters: [
//       'She happily danced in the rain.',
//       'The birds chirped in the trees.',
//       'He quickly ran towards the bus.',
//       'A cat jumped onto the sofa.',
//       'Leaves rustled in the autumn wind.',
//       'The sun slowly disappeared behind clouds.',
//       'She read a book before bed.',
//       'The dog wagged its tail happily.',
//       'Children played joyfully in the park.',
//       'A train passed through the tunnel.',
//       'The waves crashed against the rocks.'
//     ]
//   }
// ];

//sinhala lang
const lessonList = [
  {
    id: '01',
    name: 'Lesson 1',
    description: 'A simple start with two-word sentences.',
    example: 'බල්ලා බුරයි.',
    chromaticTheme: 'chromTheme_1',
    chapters: [
      'පූසා දුවයි.',
      'බල්ලා බුරයි.',
      'කුරුල්ලා පියාඹයි.',
      'ඉර බබළයි.',
      'වැස්ස වසී.',
      'සුළඟ හමයි.',
      'ගස වැඩෙයි.',
      'මාළුවා පිහිනයි.',
      'ඔරලෝසුව ටික් ටික් ගායි.',
      'කොළය වැටෙයි.',
      'දරුවා සිනාසෙයි.'
    ]
  },
  {
    id: '02',
    name: 'Lesson 2',
    description: 'Slightly longer sentences with three words.',
    example: 'ඇය වේගයෙන් දුවයි.',
    chromaticTheme: 'chromTheme_2',
    chapters: [
      'පූසා නිදයි.',
      'ඇය වේගයෙන් දුවයි.',
      'කුරුල්ලෝ ඉහළින් පියාඹති.',
      'ඔහු ඇපල් කයි.',
      'ඉර බසියි.',
      'වලාකුළු සෙමින් ගමන් කරයි.',
      'මාළුවෝ ගැඹුරට පිහිනති.',
      'සුළඟ තදින් හමයි.',
      'මල් ලස්සනට පිපෙයි.',
      'බල්ලා පනියි.',
      'වැස්ස සෙමින් වසී.'
    ]
  },
  {
    id: '03',
    name: 'Lesson 3',
    description: 'Building up complexity with four-word sentences.',
    example: 'පිරිමි ළමයා වේගයෙන් දුවයි.',
    chromaticTheme: 'chromTheme_3',
    chapters: [
      'පිරිමි ළමයා වේගයෙන් දුවයි.',
      'ඇය උණුසුම් තේ බොයි.',
      'වලාකුළු අහස වසයි.',
      'ඔවුන් සතුටින් එළිමහනේ සෙල්ලම් කරයි.',
      'දරුවා දීප්තිමත්ව සිනාසෙයි.',
      'ඔහු පොතක් කියවයි.',
      'රළ පර්වත මත ගැටෙයි.',
      'ඉර උදේ පායා එයි.',
      'කොළ සරත් කාලයේ වැටෙයි.',
      'බල්ලා හඬ නගා බුරයි.',
      'පූසා සාමයෙන් නිදයි.'
    ]
  },
  {
    id: '04',
    name: 'Lesson 4',
    description: 'Introducing five-word sentence structures.',
    example: 'කුරුල්ලා සෑම උදෑසනක්ම ගී ගයයි.',
    chromaticTheme: 'chromTheme_2',
    chapters: [
      'කුරුල්ලා සෑම උදෑසනක්ම ගී ගයයි.',
      'ඇය දිනපතා පාසල වෙත ඇවිදයි.',
      'දරුවා ඉතා හඬනගා සිනාසෙයි.',
      'වැසි බිංදු පොළොව මත වැටෙයි.',
      'සුළඟ ඉතා තදින් හමයි.',
      'ඔහු වේගයෙන් වැඩට දුවයි.',
      'මෝටර් රථය ඉතා වේගයෙන් ගමන් කරයි.',
      'ඔවුන් එකට එළිමහනේ සෙල්ලම් කිරීම සතුටු වෙයි.',
      'කොළ සරත් කාලයේ රතු පැහැ ගනී.',
      'ඉර කඳු පසුපස බැස යයි.',
      'බල්ලෙක් බෝලය පසුපස පන්නයි.'
    ]
  },
  {
    id: '05',
    name: 'Lesson 5',
    description: 'Challenging six-word sentence patterns.',
    example: 'ඇය සතුටින් වැස්සේ නැටුවාය.',
    chromaticTheme: 'chromTheme_3',
    chapters: [
      'ඇය සතුටින් වැස්සේ නැටුවාය.',
      'කුරුල්ලෝ ගස්වල කිචි බිචි ගෑවෝය.',
      'ඔහු වේගයෙන් බස් එක දෙසට දිව්වේය.',
      'පූසෙක් සෝෆාව මතට පැන්නේය.',
      'කොළ සරත් සුළඟේ සළිත වූවාය.',
      'ඉර සෙමින් වලාකුළු පිටුපස නැති වුණි.',
      'ඇය නිදාගැනීමට පෙර පොතක් කියවීය.',
      'බල්ලා සතුටින් වලිගය වනන්නට විය.',
      'දරුවෝ උද්යානයේ සතුටින් සෙල්ලම් කළහ.',
      'දුම්රියක් උමඟ හරහා ගමන් කළේය.',
      'රළ පර්වත මත හැපී ගියේය.'
    ]
  }
];

export default function DyslexicTrainingControlPanel() {

  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(lessonList[0])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [selectedChromaticTheme, setSelectedChromaticTheme] = useState(lessonList[0]?.chromaticTheme)

  const navigate = useNavigate()

  useEffect(() => {
    setLessons(lessonList);

  }, []);


  const handleClickedLesson = (index) => {
    setSelectedLesson(lessons[index]);
    setSelectedIndex(index)
    setSelectedChromaticTheme(lessons[index].chromaticTheme)
  }

  const handleStartLesson = () => {

    navigate(`/screen-reader-lessons/${selectedLesson?.id}`)

  }
  const updateChromaticTheme = async (theme) => {
    const paylaod = {
      id: selectedLesson?.id,
      chromaticTheme: theme
    }
    try {
      const res = await axios.patch('', paylaod)
      if (res.status === 200) {
        //Recall or update the lessonList here
      }
    } catch (error) {
      console.error(error)
    }

    //Only a dev test. Remove this later on
    setSelectedLesson((prevLesson)=>({
      ...prevLesson,
      chromaticTheme:theme
    }))
    
    console.log('This is payload: ', paylaod)
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
        <AlternativeHeader title='Screen Reader'/>
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
              <div className=' mt-[20px]  px-[20px] py-[10px] rounded-md'>
                <p>Ex: </p>
                <p className={`m-0 text-[36px] ${selectedLesson.chromaticTheme}`} data-attribute="chromatic">{selectedLesson?.example}</p>
              </div>
            </div>
            <div className='flex justify-between items-center'>
              <div className='cursor-pointer'>
                <ChromaticModel initialChromaticTheme={selectedLesson?.chromaticTheme} updateChromaticTheme={updateChromaticTheme} />
              </div>
              <a target='' onClick={handleStartLesson} className='flex cursor-pointer items-center justify-center primary-color-bg rounded-md py-[10px] px-[35px] '>
                <div className='flex group relative items-center'>
                  <p className='m-0'>Start</p>
                  <i className="fa-solid fa-chevron-right ml-[5px]"></i>
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