// Dyslexia screen reader quiz page
import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ChangeThemeFB from '../../components/changeThemeFB';
import chromaticThemes from '../../configs/chromaticThemes'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { decodeToken } from '../../utils/tokenUtils';
import axiosInstance from '../../api/axiosInstance';
import AlternativeHeader from '../../components/alternativeHeader';
import { useQuery } from '@tanstack/react-query';
import { getQuizzes } from '../../api/RecurringAPI';
import DysLexiaQuizReportPDFDoc from '../../components/dysLexiaQuizReportPDFDoc';


export default function DyslexicScreenReaderQuiz() {
    const paramObj = useParams()
    const lessonID = paramObj?.id //Check for parameter 'id'

    const [selectedChromTheme, setSelecetedChromeTheme] = useState(localStorage.getItem('selectedChromaticTheme'))
    const [selectedColPattern, setSelectedColPattern] = useState(localStorage.getItem('selectedColPattern'))
    const [lesson, setLesson] = useState();
    const [currentChapter, setCurrentChapter] = useState();
    const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
    const [chapterIndex, setChapterIndex] = useState(1)
    const [completedChapters, setCompletedChapters] = useState(0)
    const [speechRate, setSpeechRate] = useState(1);
    const [fontSize, setFontSize] = useState(24)
    const [isReadAloudEnabled, setIsReadAloudEnabled] = useState(true);
    const [personalizedRate, setPersonalizedRate] = useState(false)
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [user, setUser] = useState()
    const [totalMarks, setTotalMarks] = useState(0)
    const [myMarks, setMyMarks] = useState(0)
    const [currentTTS, setCurrentTTS] = useState(null)
    const [pdfPreview, setPdfPreview] = useState(false)
    const [quizEvalnObj, setQuizEvalObj] = useState({
        name: '',                    // Quiz name
        id: '',                      // Quiz ID
        userId: '',                  // User ID
        date: '',                    // Attempt date
        totalScore: 0,              // Total score achieved
        maxPossibleScore: 0,        // Maximum possible score
        timeSpent: 0,               // Total time spent in seconds
        totalAttempts: 0,           // Number of attempts made
        chapter_performance: [

        ],
        summary: {
            totalChapters: 0,       // Total number of chapters
            completedChapters: 0,   // Number of completed chapters
            averageAccuracy: 0,     // Average accuracy across all chapters
            strongestChapter: '',   // Chapter with highest score
            weakestChapter: '',     // Chapter with lowest score
            improvementAreas: []    // Array of areas needing improvement
        }
    });

    const navigate = useNavigate()

    const { data: lessonsList, isLoading, error } = useQuery({
        queryKey: ['quizzes'],
        queryFn: getQuizzes,
        staleTime: 120 * 60 * 1000,  // Data stays fresh for 5 minutes

    });

    useEffect(() => {

        const selectedLesson = lessonsList?.find((item) => item?.id === lessonID);
        setLesson(selectedLesson);
        setCurrentChapter(selectedLesson?.chapters[0])
        setCurrentChapterIndex(0);

        getUserDetails();
        // Small delay to ensure DOM is ready
        const timer = setTimeout(() => {
            applyChromaticThemes();
        }, 100);

        return () => clearTimeout(timer);

    }, [lessonsList]);

    useEffect(() => {
        calculateTotalAchievableMark();

    }, [lesson]);

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

    useEffect(() => {

        if (lesson && user && totalMarks) {
            initializeQuizEvaluation(lesson, user, totalMarks);
        }
    }, [lesson, user, totalMarks]);

    useEffect(() => {
      if(chapterIndex > lesson?.chapters.length)
      {
        saveRecord();
      }
    }, [quizEvalnObj]);

    //Save records to DB
    const saveRecord = async() => {
        const payload = quizEvalnObj;
        try {
            await axiosInstance.post('/user/records',payload)
        } catch (error) {
            console.log(error)
        }
    }
    
    const useDebounce = (callback, delay) => {
        const timeoutRef = useRef(null);

        return (...args) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                callback(...args);
            }, delay);
        };
    };

    const calculateTotalAchievableMark = () => {
        if (lesson) {
            const fullMark = lesson?.chapters?.length * 10
            setTotalMarks(fullMark);
        }

    }

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

    const initializeQuizEvaluation = (lesson, user, totalMarks) => {
        const today = new Date();
        const formattedDate = today.toLocaleDateString('en-GB');
        setQuizEvalObj(prev => ({
            ...prev,
            name: lesson?.name || '',
            id: lesson?.id || '',
            userId: user?._id || '',
            date: formattedDate,
            maxPossibleScore: totalMarks,
            totalChapters: lesson?.chapters?.length || 0,
        }));
    };

    const updateChapterPerformance = (chapterText, userPronounced, score) => {
        const chapterData = {
            chapter: chapterText,
            userPronounced: userPronounced,
            score: score,
            attempts: 1,
            mistakes: findMistakes(chapterText, userPronounced),
            accuracy: calculateAccuracy(chapterText, userPronounced),
            completedAt: new Date().toISOString()
        };

        setQuizEvalObj(prev => ({
            ...prev,
            totalScore: prev.totalScore + score,
            totalAttempts: prev.totalAttempts + 1,
            chapter_performance: [...prev.chapter_performance, chapterData]
        }));

    };

    const generateSummary = () => {
        const performance = quizEvalnObj.chapter_performance;

        // Find strongest and weakest chapters
        const sortedByScore = [...performance].sort((a, b) => b.score - a.score);
        const strongestChapter = sortedByScore[0]?.chapter || '';
        const weakestChapter = sortedByScore[sortedByScore.length - 1]?.chapter || '';

        // Calculate average accuracy
        const avgAccuracy = performance.reduce((acc, curr) => acc + curr.accuracy, 0) / performance.length;

        // Identify improvement areas
        const improvementAreas = [];
        if (avgAccuracy < 70) improvementAreas.push('Overall pronunciation accuracy');
        if (performance.some(p => p.mistakes.length > 3)) improvementAreas.push('Word pronunciation');

        setQuizEvalObj(prev => ({
            ...prev,
            summary: {
                totalChapters: lesson?.chapters?.length || 0,
                completedChapters: performance.length,
                averageAccuracy: Math.round(avgAccuracy),
                strongestChapter,
                weakestChapter,
                improvementAreas
            }
        }));

      
    };

    // Helper functions
    const findMistakes = (original, pronounced) => {
        const originalWords = original.toLowerCase().split(' ');
        const pronouncedWords = pronounced.toLowerCase().split(' ');
        return originalWords.filter((word, index) => word !== pronouncedWords[index]);
    };

    const calculateAccuracy = (original, pronounced) => {
        const originalWords = original.toLowerCase().split(' ');
        const pronouncedWords = pronounced.toLowerCase().split(' ');
        const correctWords = originalWords.filter((word, index) => word === pronouncedWords[index]);
        return Math.round((correctWords.length / originalWords.length) * 100);
    };

    const handleNext = () => {
        if (currentChapterIndex < lesson?.chapters.length) {
            
            setCurrentChapterIndex(currentChapterIndex + 1);
        }
        
        setChapterIndex(chapterIndex + 1)
        setCompletedChapters(currentChapterIndex + 1)
    };

    const handleBack = () => {
        if (currentChapterIndex <= lesson?.chapters.length ) {
            setCurrentChapterIndex(currentChapterIndex - 1);
        }
        
        setChapterIndex(chapterIndex - 1)
        
    };

    const handleSkip = () => {
        if (currentChapterIndex < lesson?.chapters.length) {
            setCurrentChapterIndex(currentChapterIndex + 1);
        }
       
        setChapterIndex(chapterIndex + 1)
        
    }


    const handleSpeech = async () => {

        const payload = {
            text: currentChapter,
            speechRate: speechRate,
            langCode: lesson?.langCode || 'en-US'
        }

        try {
            const res = await axiosInstance.post('/speech/tts', payload, {
                responseType: 'arraybuffer'  // This is the key change
            })

            if (res?.status === 200) {
                setCurrentTTS(res?.data)

                playAudio()
            }
        } catch (error) {
            console.log(error)
            const utterance = new SpeechSynthesisUtterance(currentChapter);
            utterance.rate = speechRate;
            window.speechSynthesis.speak(utterance);
        }

    };

    const playAudio = () => {


        const blob = new Blob([currentTTS], { type: 'audio/mp3' });
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);

        audio.play();

        audio.onended = () => {
            URL.revokeObjectURL(url);
        };

        audio.onerror = (error) => {
            console.error("Error playing audio:", error);
            URL.revokeObjectURL(url);
        };
    };

    const handlePersonalizedRate = () => {
        if (personalizedRate) {

            setSpeechRate(user?.speechRate)
        } else {
            setSpeechRate(1) //using default speech rate of 1
        }
    }

    const handleFinish = () => {

        navigate('/dyslexia-quiz')
    }
    const handleExit = () => {
        navigate('/dyslexia-quiz')
    }
    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

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

    const calculateScoreForChapter = () => {
        const currentChapterWords = currentChapter?.toLowerCase()
            .trim()
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
            .split(' ')
            .filter(word => word.length > 0);
        const transcriptWords = transcript.toLowerCase()
            .trim()
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
            .split(' ')
            .filter(word => word.length > 0);

        const totalAchievableScore = currentChapterWords.length;
        let matchingWordsCount = 0;

        transcriptWords.forEach((word, index) => {
            if (word === currentChapterWords[index]) {
                matchingWordsCount++;
            }
        });

        const score = Math.round((matchingWordsCount / totalAchievableScore) * 10); // Assuming full mark is 10


        resetTranscript();
        return score;
    };

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    const startListening = useDebounce(() => {
        if (!listening) {
            SpeechRecognition.startListening({ continuous: true });
        }
    }, 200);

    const stopListening = useDebounce(() => {
        if (listening) {
            setTimeout(() => {
                SpeechRecognition.stopListening();
            }, 200);
            
            if (myMarks <= totalMarks) {
                const chapterMark = calculateScoreForChapter();
                setMyMarks(myMarks + chapterMark);

                // Update chapter performance
                updateChapterPerformance(currentChapter, transcript, chapterMark);
               
            }
            handleNext();
        }
    }, 200);



    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    const handleSeePDFPreview = () => {
        generateSummary();

        setTimeout(() => {
            setPdfPreview(true)
        }, 200); 
    }
    return (
        <div className='la-container overflow-x-hidden items-center h-screen flex flex-col relative'>
            <AlternativeHeader title='Screen Reader' />
            <ChangeThemeFB />

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
                            {/* <div className={`cursor-pointer flex items-center  justify-end w-[100px] ${currentChapterIndex == lesson?.chapters.length - 1 ? 'hidden' : 'flex'} `}>
                                <span className='relative group' onClick={handleNext}>
                                    <p className=' m-0'>Next</p>
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full"></span>
                                </span>
                            </div> */}

                            <div className={`cursor-pointer flex items-center  justify-end w-[100px] ${currentChapterIndex == lesson?.chapters.length - 1 ? 'flex' : 'hidden'} `}>
                                <span className='relative group' onClick={handleFinish}>
                                    <p className=' m-0'>Finish</p>
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full"></span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className=' text-wrap overflow-x-hidden overflow-y-auto relative bg-black bg-opacity-5 w-full h-[300px] rounded-lg flex justify-center items-center'>
                        <p className={`p-[20px] m-0 ${chapterIndex > lesson?.chapters.length ? "block":"hidden"} `} style={{ fontSize: `${fontSize}px` }}>Quiz Completed</p>
                        <p className={`p-[20px] m-0 ${selectedChromTheme} ${chapterIndex <= lesson?.chapters.length ? "block":"hidden"} `} style={{ fontSize: `${fontSize}px` }} data-attribute="chromatic">{currentChapter || 'Sorry, No chapters in this lesson'}</p>
                        <span className={`absolute bottom-3 right-6 ${chapterIndex > lesson?.chapters.length ? "hidden":"block"}`} >{chapterIndex}/{lesson?.chapters.length}</span>
                        <span className=' absolute top-3 right-6' >Score: {myMarks}/{totalMarks}</span>
                    </div>
                    <div className=' flex p-[15px_20px] w-full bg-black bg-opacity-5 rounded-lg mt-[20px]'>
                        <div className='flex flex-col items-center justify-center  p-[10px_20px]  w-full '>
                            <div className={` flex-col justify-start w-full ${chapterIndex <= lesson?.chapters.length  ? "flex" : "hidden"} `} >

                                <p> {listening ? 'LexAyudha is now listening' : ''}</p>

                                <div className='h-[80px] items-center justify-center flex'>
                                    <p>{listening || transcript ? '' : 'Please start the lesson to evaluate the student'}</p>
                                    <p> {transcript}</p>
                                </div>

                            </div>

                            <div className='w-full flex justify-evenly items-center'>

                                <div className={`flex space-x-4 ${listening ? 'block' : 'hidden'}`}>
                                    <span className={`relative group cursor-pointer w-fit bg-[var(--primary-color)] rounded p-[5px_10px] hover:bg-black hover:bg-opacity-10 transition duration-200`} onClick={stopListening}>
                                        <p className=' m-0'>Finish chapter</p>

                                    </span>
                                    <span className={`relative group cursor-pointer w-fit bg-[var(--primary-color)] rounded p-[5px_10px] hover:bg-black hover:bg-opacity-10 transition duration-200`} onClick={resetTranscript}>
                                        <p className=' m-0'>Reset</p>

                                    </span>
                                </div>

                                <div className={`flex space-x-4 ${chapterIndex > lesson?.chapters.length   ? 'block' : 'hidden'}`}>
                                    <span className={`relative group cursor-pointer w-fit bg-[var(--primary-color)] rounded p-[5px_10px] hover:bg-black hover:bg-opacity-10 transition duration-200`} onClick={handleSeePDFPreview}>
                                        <p className=' m-0'>See Feedback</p>

                                    </span>
                                    <span className={`relative group cursor-pointer w-fit bg-[var(--primary-color)] rounded p-[5px_10px] hover:bg-black hover:bg-opacity-10 transition duration-200`} onClick={handleFinish}>
                                        <p className=' m-0'>Finish Attempt</p>

                                    </span>
                                </div>


                                <span className={`relative group cursor-pointer w-fit bg-[var(--primary-color)] rounded hover:bg-black hover:bg-opacity-10 transition duration-200 p-[5px_10px] ${!transcript && !listening && chapterIndex <= lesson?.chapters.length  ? 'block' : 'hidden'} `} onClick={startListening}>
                                    <p className=' m-0'>Start chapter</p>

                                </span>

                            </div>

                        </div>

                        {/* <div className={`flex flex-col items-center justify-center mt-[20px]  ${isReadAloudEnabled ? 'flex' : 'hidden'}`}>

                            <div className='flex flex-col justify-center '>
                                <label htmlFor='speechRate' className='mb-[10px] text-sm'>Speech Rate: {speechRate}</label>
                                <input
                                    type='range'
                                    id='speechRate'
                                    min='0.25'
                                    max='1.25'
                                    step='0.01'
                                    value={speechRate}
                                    onChange={(e) => setSpeechRate(e.target.value)}
                                    className='w-[200px]'
                                />
                            </div>
                            <button onClick={handleSpeech} className='py-[10px] mt-[20px] px-[20px] primary-color-bg rounded-md mr-[15px] hover:bg-black hover:bg-opacity-10 transition duration-200'>Read Aloud</button>
                        </div> */}

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
            <div className={` absolute z-20 right-0 top-1/2 transform -translate-y-1/2 rounded-[20px_0px_0px_20px] w-[400px] h-[550px] primary-color-bg transition-transform duration-300 ${isPanelOpen ? 'translate-x-0' : 'translate-x-[390px]'}`}>

                <div id='side_panel' className={`cursor-pointer flex items-center justify-center absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-[20px] rounded-[5px] primary-color-bg px-[10px] py-[20px] transition-transform duration-300 ${isPanelOpen ? 'rotate-180' : ''}`} onClick={togglePanel}>
                    <i className="fa-solid fa-chevron-left"></i>
                </div>
                {/* Header */}
                <div className="bg-black bg-opacity-10 rounded-[20px_0px_0px_0px] p-4 mb-6">
                    <h2 className=" text-xl font-bold">Accessibility Settings</h2>
                </div>
                {/* Main settings panel */}
                <div className=" rounded-lg  flex flex-col items-center">


                    {/* Font Size Section */}
                    <div className="mb-8 w-full px-[20px]">
                        <div className="flex justify-between items-center mb-2">
                            <div>
                                <h3 className="text-lg font-semibold ">Font Size</h3>
                                <p className="text-[12px] ">Adjust text size for better readability</p>
                            </div>
                            <div className="bg-black bg-opacity-15 rounded-full px-3 py-1 text-center min-w-[40px]">
                                {fontSize}
                            </div>
                        </div>

                        <input
                            type="range"
                            id="fontSize"
                            min="8"
                            max="96"
                            step="1"
                            value={fontSize}
                            onChange={(e) => setFontSize(e.target.value)}
                            className="w-full h-2 bg-black bg-opacity-15 rounded-lg appearance-none cursor-pointer accent-[var(--text-color)]"
                        />
                    </div>

                    {/* Divider */}
                    <div className="border-b border-[var(--text-color)] mb-[18px] w-[calc(100%-40px)] "></div>

                    {/* Read Aloud Section */}
                    {/* <div className='px-[20px]'>
                        <h3 className="text-lg font-semibold  mb-2">Read Aloud Features</h3>
                        <p className="text-[12px] mb-4">Configure text-to-speech settings</p>

           
                        <div className="flex justify-between items-center mt-[32px] mb-4">
                            <label htmlFor="enableReadAloud" className="">Enable read aloud</label>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    id="enableReadAloud"
                                    className="sr-only peer"
                                    checked={isReadAloudEnabled}
                                    onChange={(e) => setIsReadAloudEnabled(e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-black bg-opacity-5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-[var(--text-color)] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[var(--background-color)] after:border-[var(--text-color)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--text-color)]"></div>
                            </label>
                        </div>

                        
                        <div className="flex justify-between items-center">
                            <label htmlFor="personalizedRate" className="">Enable personalized speech rate</label>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    id="personalizedRate"
                                    className="sr-only peer"
                                    checked={personalizedRate}
                                    onChange={(e) => setPersonalizedRate(e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-black bg-opacity-5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-[var(--text-color)] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[var(--background-color)] after:border-[var(--text-color)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--text-color)]"></div>
                            </label>
                        </div>
                    </div> */}

                </div>
            </div>

            {pdfPreview && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">

                    <DysLexiaQuizReportPDFDoc
                        quizEvalnObj={quizEvalnObj}
                        closeWindow={() => setPdfPreview(false)}
                    />
                </div>
            )}
        </div>
    )
}