import React, { useEffect, useState, } from 'react'
import { useParams } from 'react-router-dom'
import ChangeThemeFB from '../../components/changeThemeFB';
import axios from 'axios';

const lessonsList = [
    {
        id: '01',
        name: 'Lesson 1',
        description: 'A simple start with two-word sentences.',
        example: 'Cat sleeps.',
        chromaticTheme: 'chromTheme 1',
        chapters: [
            'Cat runs.',
            'Dog barks.',
            'Bird flies.',
            'Sun shines.',
            'Rain falls.',
            'Wind blows.',
            'Tree grows.',
            'Fish swims.',
            'Clock ticks.',
            'Leaf drops.',
            'Baby laughs.'
        ]
    },
    {
        id: '02',
        name: 'Lesson 2',
        description: 'Slightly longer sentences with three words.',
        example: 'The dog barks.',
        chromaticTheme: 'chromTheme 2',
        chapters: [
            'The cat sleeps.',
            'She runs fast.',
            'Birds fly high.',
            'He eats apples.',
            'The sun sets.',
            'Clouds move slowly.',
            'Fish swim deep.',
            'Wind blows strong.',
            'Flowers bloom beautifully.',
            'The dog jumps.',
            'Rain falls gently.'
        ]
    },
    {
        id: '03',
        name: 'Lesson 3',
        description: 'Building up complexity with four-word sentences.',
        example: 'She quickly ran away.',
        chromaticTheme: 'chromTheme 3',
        chapters: [
            'The boy runs fast.',
            'She drinks warm tea.',
            'Clouds cover the sky.',
            'They play outside happily.',
            'The baby smiles brightly.',
            'He reads a book.',
            'Waves crash on rocks.',
            'The sun rises early.',
            'Leaves fall in autumn.',
            'The dog barks loudly.',
            'A cat sleeps peacefully.'
        ]
    },
    {
        id: '04',
        name: 'Lesson 4',
        description: 'Introducing five-word sentence structures.',
        example: 'The flowers bloom in spring.',
        chromaticTheme: 'chromTheme 4',
        chapters: [
            'The bird sings every morning.',
            'She walks to school daily.',
            'The baby laughs so loudly.',
            'Raindrops fall on the ground.',
            'The wind blows very strong.',
            'He quickly runs to work.',
            'The car moves very fast.',
            'They enjoy playing outside together.',
            'Leaves turn red in autumn.',
            'The sun sets behind mountains.',
            'A dog chases the ball.'
        ]
    },
    {
        id: '05',
        name: 'Lesson 5',
        description: 'Challenging six-word sentence patterns.',
        example: 'He carefully placed the books neatly.',
        chromaticTheme: 'chromTheme 5',
        chapters: [
            'She happily danced in the rain.',
            'The birds chirped in the trees.',
            'He quickly ran towards the bus.',
            'A cat jumped onto the sofa.',
            'Leaves rustled in the autumn wind.',
            'The sun slowly disappeared behind clouds.',
            'She read a book before bed.',
            'The dog wagged its tail happily.',
            'Children played joyfully in the park.',
            'A train passed through the tunnel.',
            'The waves crashed against the rocks.'
        ]
    }
];


export default function DyslexicScreenReader() {

    const paramObj = useParams()
    const lessonID = paramObj?.id //Check for parameter 'id'


    const [lesson, setLesson] = useState();
    const [currentChapter, setCurrentChapter] = useState();
    const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
    const [completedChapters, setCompletedChapters] = useState(0)
    const [speechRate, setSpeechRate] = useState(1);

    useEffect(() => {

        const selectedLesson = lessonsList.find((item) => item?.id === lessonID);
        setLesson(selectedLesson);
        setCurrentChapter(selectedLesson?.chapters[0])
        setCurrentChapterIndex(0);
        getLesson();


    }, []);

    useEffect(() => {
        if (lesson) {
            setCurrentChapter(lesson?.chapters[currentChapterIndex])
        }

    }, [currentChapterIndex]);

    const getLesson = async () => {
        // const res = await axios.get('');
        // if(res){
        //     setLesson(res.data)
        // }
    }

    const handleNext = () => {
        if (currentChapterIndex < lesson?.chapters.length - 1) {
            setCurrentChapterIndex(currentChapterIndex + 1);
        }
        setCompletedChapters(currentChapterIndex + 1)
    };
    const handleBack = () => {
        if (currentChapterIndex < lesson?.chapters.length - 1) {
            setCurrentChapterIndex(currentChapterIndex + 1);
        }
    };


    const handleSkip = () => {
        if (currentChapterIndex < lesson?.chapters.length - 1) {
            setCurrentChapterIndex(currentChapterIndex + 1);
        }
    }


    const handleSpeech = () => {
        const utterance = new SpeechSynthesisUtterance(currentChapter);
        utterance.rate = speechRate;
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className='la-container items-center h-screen flex flex-col relative'>
            <ChangeThemeFB />
            <div className='flex justify-start w-full absolute top-0'>
                <h2>Screen Reader</h2>
            </div>
            <div className='flex flex-col w-full h-screen items-center justify-center '>
                <div>
                    <h2>{lesson?.name}</h2>
                </div>
                <div className='flex w-full items-center flex-col'>
                    <div className='flex w-full justify-between mb-[20px]'>
                        <div className='flex'>
                            <div className={`cursor-pointer flex items-center  justify-start w-[100px] ${currentChapterIndex == 0 ? 'hidden' : 'flex'} `}>
                                <span className='relative group' onClick={handleBack}>
                                    <p className=' m-0'>Back</p>
                                    <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full"></span>
                                </span>

                            </div>
                        </div>
                        <div className='flex'>
                            <div className={`cursor-pointer flex items-center  justify-end w-[100px] ${currentChapterIndex == lesson?.chapters.length - 1 ? 'hidden' : 'flex'} `}>
                                <span className='relative group' onClick={handleSkip}>
                                    <p className=' m-0'>Skip</p>
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full"></span>
                                </span>

                            </div>
                            <div className={`cursor-pointer flex items-center  justify-end w-[100px] ${currentChapterIndex == lesson?.chapters.length - 1 ? 'hidden' : 'flex'} `}>
                                <span className='relative group' onClick={handleNext}>
                                    <p className=' m-0'>Next</p>
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full"></span>
                                </span>
                            </div>

                            <div className={`cursor-pointer flex items-center  justify-end w-[100px] ${currentChapterIndex == lesson?.chapters.length - 1 ? 'flex' : 'hidden'} `}>
                                <span className='relative group' onClick={handleNext}>
                                    <p className=' m-0'>Finish</p>
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full"></span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className=' text-wrap overflow-x-hidden overflow-y-auto relative bg-black bg-opacity-5 w-full h-[300px] rounded-lg flex justify-center items-center'>
                        <span className='p-[20px]'>{currentChapter || 'Sorry, No chapters in this lesson'}</span>
                        <span className=' absolute bottom-3 right-6' >{completedChapters}/{lesson?.chapters.length - 1}</span>
                    </div>
                    <div className='flex flex-col items-center mt-[20px]'>
                        <button onClick={handleSpeech} className='py-[10px] px-[20px] primary-color-bg rounded-md  mb-[10px]'>Play Audio</button>
                        <label htmlFor='speechRate' className='mb-[10px]'>Speech Rate: {speechRate}</label>
                        <input
                            type='range'
                            id='speechRate'
                            min='0.5'
                            max='2'
                            step='0.1'
                            value={speechRate}
                            onChange={(e) => setSpeechRate(e.target.value)}
                            className='w-[200px]'
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}