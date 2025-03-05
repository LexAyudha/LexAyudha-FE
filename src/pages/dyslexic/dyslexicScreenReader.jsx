import React, { useEffect, useState, } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ChangeThemeFB from '../../components/changeThemeFB';
import axios from 'axios';
import chromaticThemes from '../../configs/chromaticThemes'

const lessonsList = [
    {
        id: '01',
        name: 'Lesson 1',
        description: 'A simple start with two-word sentences.',
        example: 'Cat sleeps.',
        chromaticTheme: 'chromTheme_1',
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
        chromaticTheme: 'chromTheme_2',
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
        chromaticTheme: 'chromTheme_3',
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
        chromaticTheme: 'chromTheme_4',
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
        chromaticTheme: 'chromTheme_5',
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

    const [selectedChromTheme, setSelecetedChromeTheme] = useState(localStorage.getItem('selectedChromaticTheme'))
    const [selectedColPattern, setSelectedColPattern] = useState(localStorage.getItem('selectedColPattern'))
    const [lesson, setLesson] = useState();
    const [currentChapter, setCurrentChapter] = useState();
    const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
    const [completedChapters, setCompletedChapters] = useState(0)
    const [speechRate, setSpeechRate] = useState(1);
    const [fontSize, setFontSize] = useState(24)
    const [isReadAloudEnabled, setIsReadAloudEnabled] = useState(true);
    const [personalizedRate, setPersonalizedRate] = useState(false)
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {

        const selectedLesson = lessonsList.find((item) => item?.id === lessonID);
        setLesson(selectedLesson);
        setCurrentChapter(selectedLesson?.chapters[0])
        setCurrentChapterIndex(0);
        getLesson();

        // Small delay to ensure DOM is ready
        const timer = setTimeout(() => {
            applyChromaticThemes();
        }, 100);

        return () => clearTimeout(timer);

    }, []);

    useEffect(() => {
        if (lesson) {
            setCurrentChapter(lesson?.chapters[currentChapterIndex])

            // Small delay to ensure DOM is ready
            const timer = setTimeout(() => {
                applyChromaticThemes();
            }, 0);

            return () => clearTimeout(timer);
        }

    }, [currentChapterIndex]);

    useEffect(() => {
        handlePersonalizedRate()
    }, [personalizedRate]);

    const applyChromaticThemes = () => {
        const pTags = document.querySelectorAll('p[data-attribute="chromatic"]');

        pTags.forEach(pTag => {
            // First reset any previously applied styles
            const originalClass = Array.from(pTag.classList).find(cls => cls.startsWith('chromTheme_'));

            if (originalClass) {
                // Save original text content
                const originalText = pTag.textContent;
                let fragments;

                // Determine splitting method based on theme
                if (originalClass === 'chromTheme_1') {
                    // Split by words, but capture the whitespace
                    fragments = originalText.split(/(\s+)/);
                } else if (originalClass === 'chromTheme_2') {
                    // Split by pairs of characters
                    fragments = originalText.match(/.{1,2}/gs) || [];
                } else if (originalClass === 'chromTheme_3') {
                    // Split by individual characters
                    fragments = originalText.match(/./gs) || [];
                }

                let colorIndex = 0;
                // Get the correct color pattern based on the theme
                // const themeNumber = originalClass.split('_')[1];
                let newContent;

                if (selectedColPattern != null) {
                    const colorPattern = selectedColPattern ? selectedColPattern.split(',').map(color => color.trim()) : chromaticThemes?.colors[0].chromThemeColor_1;

                    newContent = fragments.map((fragment) => {
                        // Skip applying colors to whitespace for word theme
                        if (originalClass === 'chromTheme_1' && fragment.trim() === '') {
                            return fragment; // Return whitespace as is
                        }

                        const color = colorPattern[colorIndex % colorPattern.length];

                        colorIndex++;

                        return `<span style="color: ${color};">${fragment}</span>`;
                    }).join(''); // Join without adding spaces
                } else {

                    newContent = originalText
                }
                pTag.innerHTML = newContent;
            }
        });
    };

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

    const handlePersonalizedRate = () => {
        if (personalizedRate) {
            setSpeechRate(0.5)
        } else {
            setSpeechRate(1) //using default speech rate of 1
        }
    }

    const handleFinish = () => {
        navigate('/dyslexic-training')
    }
    const handleExit = () => {
        navigate('/dyslexic-training')
    }
    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    return (
        <div className='la-container overflow-x-hidden items-center h-screen flex flex-col relative'>
            <ChangeThemeFB />
            <div className='flex justify-start w-full absolute top-0'>
                <h2>Screen Reader</h2>
            </div>
            <div className='flex flex-col w-full h-screen items-center justify-center pr-[50px] '>
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
                                <span className='relative group' onClick={handleFinish}>
                                    <p className=' m-0'>Finish</p>
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full"></span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className=' text-wrap overflow-x-hidden overflow-y-auto relative bg-black bg-opacity-5 w-full h-[300px] rounded-lg flex justify-center items-center'>
                        <p className={`p-[20px] m-0 ${selectedChromTheme} `} style={{ fontSize: `${fontSize}px` }} data-attribute="chromatic">{currentChapter || 'Sorry, No chapters in this lesson'}</p>
                        <span className=' absolute bottom-3 right-6' >{completedChapters}/{lesson?.chapters.length - 1}</span>
                    </div>
                    <div className='h-[150px]'>
                        <div className={`flex-col  items-center mt-[20px] ${isReadAloudEnabled ? 'flex' : 'hidden'}`}>
                            <button onClick={handleSpeech} className='py-[10px] px-[20px] primary-color-bg rounded-md  mb-[40px]'>Read Aloud</button>
                            <label htmlFor='speechRate' className='mb-[10px] text-sm'>Speech Rate: {speechRate}</label>
                            <input
                                type='range'
                                id='speechRate'
                                min='0.1'
                                max='1.25'
                                step='0.01'
                                value={speechRate}
                                onChange={(e) => setSpeechRate(e.target.value)}
                                className='w-[200px]'
                            />
                        </div>
                    </div>

                    <div className='flex w-full'>
                        <div className='w-fit mt-[20px]'>
                            <span className='  w-[100px] cursor-pointer relative group' onClick={handleExit}>
                                <p className='m-0'>Exit</p>
                                <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full"></span>
                            </span>
                        </div>
                    </div>

                </div>
            </div>
            <div className={`px-[20px] absolute z-20 right-0 top-1/2 transform -translate-y-1/2 rounded-[20px_0px_0px_20px] w-[400px] h-[500px] primary-color-bg transition-transform duration-300 ${isPanelOpen ? 'translate-x-0' : 'translate-x-[390px]'}`}>
                <div id='side_panel' className={`cursor-pointer flex items-center justify-center absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-[20px] rounded-[5px] primary-color-bg px-[10px] py-[20px] transition-transform duration-300 ${isPanelOpen ? 'rotate-180' : ''}`} onClick={togglePanel}>
                    <i className="fa-solid fa-chevron-left"></i>
                </div>
                <div className='flex flex-col items-center mt-[20px]'>
                    <div className=' w-full'><p>Adjsut font size: </p></div>
                    <label htmlFor='FontSize' className='mb-[10px] text-sm'>Font Size: {fontSize}</label>
                    <input
                        type='range'
                        id='speechRate'
                        min='8'
                        max='96'
                        step='1'
                        value={fontSize}
                        onChange={(e) => setFontSize(e.target.value)}
                        className='w-[200px]'
                    />
                </div>
                <div className='flex flex-col mt-[40px]'>
                    <div className=' w-full'><p>Read Aloud Feature settings: </p></div>
                    <div className='flex justify-between w-[75%] mt-[10px]'>
                        <label htmlFor='enableReadAloud' className='mb-[10px] text-sm'>Enable feature?</label>
                        <input
                            type='checkbox'
                            id='enableReadAloud'
                            checked={isReadAloudEnabled}
                            onChange={(e) => setIsReadAloudEnabled(e.target.checked)}
                            className='mb-[10px]'
                        />
                    </div>
                    <div className='flex justify-between w-[75%] mt-[10px]'>
                        <label htmlFor='enableReadAloud' className='mb-[10px] text-sm'>Enable personalized speach rate?</label>
                        <input
                            type='checkbox'
                            id='enableReadAloud'
                            checked={personalizedRate}
                            onChange={(e) => setPersonalizedRate(e.target.checked)}
                            className='mb-[10px]'
                        />
                    </div>

                </div>
            </div>
        </div>
    )
}