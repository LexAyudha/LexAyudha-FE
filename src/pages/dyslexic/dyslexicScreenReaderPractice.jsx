// Dyslexia screen reader main page
import React, { useEffect, useState, } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ChangeThemeFB from '../../components/changeThemeFB';
import chromaticThemes from '../../configs/chromaticThemes'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { decodeToken } from '../../utils/tokenUtils';
import axiosInstance from '../../api/axiosInstance';
import AlternativeHeader from '../../components/alternativeHeader';
import { useQuery } from '@tanstack/react-query';
import { getLessons } from '../../api/RecurringAPI';


export default function DyslexicScreenReaderPractice() {

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
    const [user, setUser] = useState()
    const [totalMarks, setTotalMarks] = useState(0)
    const [myMarks, setMyMarks] = useState(0)
    const [currentTTS, setCurrentTTS] = useState(null)
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackData, setFeedbackData] = useState({
        correct: 0,
        incorrect: 0,
        highlightedText: '',
        mispronounced: [],
        missingWords: []
    });
    const navigate = useNavigate()

    const { data: lessonsList, isLoading, error } = useQuery({
        queryKey: ['practiceLessons'],
        queryFn: getLessons,
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
    const calculateTotalAchievableMark = () => {
        if (lesson) {
            const fullMark = lesson?.chapters?.length * 10
            setTotalMarks(fullMark);
        }

    }

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

    const handleNext = () => {
        if (myMarks <= totalMarks) {
            const chapterMark = calculateScoreForChapter()
            setMyMarks(myMarks + chapterMark);
        }

        if (currentChapterIndex < lesson?.chapters.length - 1) {
            setCurrentChapterIndex(currentChapterIndex + 1);
        }
        setCompletedChapters(currentChapterIndex + 1)
    };
    const handleBack = () => {
        if (currentChapterIndex < lesson?.chapters.length - 1) {
            setCurrentChapterIndex(currentChapterIndex - 1);
        }
    };


    const handleSkip = () => {
        if (currentChapterIndex < lesson?.chapters.length - 1) {
            setCurrentChapterIndex(currentChapterIndex + 1);
        }
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
        navigate('/dyslexia-practice')
    }
    const handleExit = () => {
        navigate('/dyslexia-practice')
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
        const currentChapterWords = currentChapter?.split(' ');
        const transcriptWords = transcript.split(' ');

        const totalAchievableScore = currentChapterWords.length;
        let matchingWordsCount = 0;

        transcriptWords.forEach((word, index) => {
            if (word === currentChapterWords[index]) {
                matchingWordsCount++;
            }
        });

        const score = Math.round((matchingWordsCount / totalAchievableScore) * 10); // full mark is 10
        resetTranscript();
        return score;
    };

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();
    const startListening = () => SpeechRecognition.startListening({ continuous: true });
    const stopListening = () => {
        SpeechRecognition.stopListening();
        feedBackOnPronunciation()
    }

    //Feedback function
    //Feedback function
    const feedBackOnPronunciation = () => {
        // Remove punctuation and normalize text
        let userPronuncedWords = transcript.toLowerCase()
            .trim()
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
            .split(' ')
            .filter(word => word.length > 0);

        let chapterWords = currentChapter.toLowerCase()
            .trim()
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
            .split(' ')
            .filter(word => word.length > 0);

        let correctCount = 0;
        let incorrectCount = 0;
        let mispronounced = [];
        let missingWords = [];
        let highlightedText = '';

        // Handle empty user input
        if (userPronuncedWords.length === 0) {
            missingWords = [...chapterWords];
            highlightedText = chapterWords.map(word =>
                `<span class="border-b-2 border-yellow-500 px-1 rounded opacity-50">${word}</span>`
            ).join(' ');

            setFeedbackData({
                correct: correctCount,
                incorrect: incorrectCount,
                highlightedText,
                mispronounced,
                missingWords
            });
            setShowFeedback(true);
            return;
        }

        // Determine if we have missing words or misspelled words based on array lengths
        if (userPronuncedWords.length < chapterWords.length) {
            // Missing words scenario - use advanced matching algorithm
            let userIndex = 0;
            let chapterIndex = 0;
            let processedWords = [];

            while (chapterIndex < chapterWords.length) {
                if (userIndex < userPronuncedWords.length &&
                    userPronuncedWords[userIndex] === chapterWords[chapterIndex]) {
                    // Perfect match
                    correctCount++;
                    processedWords.push({
                        word: userPronuncedWords[userIndex],
                        type: 'correct'
                    });
                    userIndex++;
                    chapterIndex++;
                } else {
                    // Check if current user word matches any upcoming chapter word (within next 3 words)
                    let foundMatch = false;
                    if (userIndex < userPronuncedWords.length) {
                        for (let lookAhead = 1; lookAhead <= Math.min(3, chapterWords.length - chapterIndex - 1); lookAhead++) {
                            if (userPronuncedWords[userIndex] === chapterWords[chapterIndex + lookAhead]) {
                                // Found match ahead - mark intermediate words as missing
                                for (let i = 0; i < lookAhead; i++) {
                                    missingWords.push(chapterWords[chapterIndex + i]);
                                    processedWords.push({
                                        word: chapterWords[chapterIndex + i],
                                        type: 'missing'
                                    });
                                }
                                // Add the matched word
                                correctCount++;
                                processedWords.push({
                                    word: userPronuncedWords[userIndex],
                                    type: 'correct'
                                });
                                chapterIndex += lookAhead + 1;
                                userIndex++;
                                foundMatch = true;
                                break;
                            }
                        }
                    }

                    if (!foundMatch) {
                        // No match found - current chapter word is missing
                        missingWords.push(chapterWords[chapterIndex]);
                        processedWords.push({
                            word: chapterWords[chapterIndex],
                            type: 'missing'
                        });
                        chapterIndex++;
                    }
                }
            }

            // Handle any remaining user words (extra words)
            while (userIndex < userPronuncedWords.length) {
                incorrectCount++;
                processedWords.push({
                    word: userPronuncedWords[userIndex],
                    type: 'extra'
                });
                userIndex++;
            }

            // Generate highlighted text
            highlightedText = processedWords.map(item => {
                switch (item.type) {
                    case 'correct':
                        return `<span class="border-b-2 border-green-500 px-1 rounded">${item.word}</span>`;
                    case 'missing':
                        return `<span class="border-b-2 border-yellow-500 px-1 rounded opacity-50">${item.word}</span>`;
                    case 'extra':
                        return `<span class="border-b-2 border-red-500 px-1 rounded">${item.word}</span>`;
                    default:
                        return item.word;
                }
            }).join(' ');

        } else {
            // Equal length or user spoke more words - likely misspelled words scenario
            let processedWords = [];

            // Compare word by word up to the length of chapter words
            for (let i = 0; i < chapterWords.length; i++) {
                if (i < userPronuncedWords.length) {
                    if (userPronuncedWords[i] === chapterWords[i]) {
                        correctCount++;
                        processedWords.push({
                            word: userPronuncedWords[i],
                            type: 'correct'
                        });
                    } else {
                        incorrectCount++;
                        mispronounced.push({
                            spoken: userPronuncedWords[i],
                            correct: chapterWords[i]
                        });
                        processedWords.push({
                            word: userPronuncedWords[i],
                            type: 'mispronounced',
                            correct: chapterWords[i]
                        });
                    }
                }
            }

            // Handle extra words if user spoke more than chapter length
            for (let i = chapterWords.length; i < userPronuncedWords.length; i++) {
                incorrectCount++;
                processedWords.push({
                    word: userPronuncedWords[i],
                    type: 'extra'
                });
            }

            // Generate highlighted text
            highlightedText = processedWords.map(item => {
                switch (item.type) {
                    case 'correct':
                        return `<span class="border-b-2 border-green-500 px-1 rounded">${item.word}</span>`;
                    case 'mispronounced':
                        return `<span class="border-b-2 border-red-500 px-1 rounded" title="Should be: ${item.correct}">${item.word}</span>`;
                    case 'extra':
                        return `<span class="border-b-2 border-red-500 px-1 rounded">${item.word}</span>`;
                    default:
                        return item.word;
                }
            }).join(' ');
        }

        setFeedbackData({
            correct: correctCount,
            incorrect: incorrectCount,
            highlightedText,
            mispronounced,
            missingWords
        });

        setShowFeedback(true);
    };

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
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
                        {/* <span className=' absolute top-3 right-6' >Score: {myMarks}/{totalMarks}</span> */}
                    </div>
                    <div className=' flex p-[15px_20px] w-full bg-black bg-opacity-5 rounded-lg mt-[20px]'>
                        <div className='flex flex-col items-center justify-center  p-[10px_20px]  w-full '>
                            <div className='flex flex-col justify-start w-full'>

                                <p> {listening ? 'LexAyudha is now listening' : ''}</p>

                                <div className='h-[80px] items-center justify-center flex'>
                                    <p>{listening || transcript ? '' : 'Please start the lesson to evaluate the student'}</p>
                                    <p> {transcript}</p>
                                </div>

                            </div>

                            <div className='w-full flex justify-evenly items-center'>
                                <span className={`relative group cursor-pointer w-fit bg-[var(--primary-color)] rounded p-[5px_10px] hover:bg-black hover:bg-opacity-10 transition duration-200 ${transcript && !listening ? 'block' : 'hidden'}`} onClick={resetTranscript}>
                                    <p className=' m-0'>Restart chapter</p>

                                </span>
                                <span className={`relative group cursor-pointer w-fit bg-[var(--primary-color)] rounded p-[5px_10px] hover:bg-black hover:bg-opacity-10 transition duration-200 ${listening ? 'block' : 'hidden'}`} onClick={stopListening}>
                                    <p className=' m-0'>Finish chapter</p>

                                </span>
                                <span className={`relative group cursor-pointer w-fit bg-[var(--primary-color)] rounded hover:bg-black hover:bg-opacity-10 transition duration-200 p-[5px_10px] ${!transcript && !listening ? 'block' : 'hidden'}`} onClick={startListening}>
                                    <p className=' m-0'>Start chapter</p>

                                </span>

                            </div>

                        </div>

                        <div className={`flex flex-col items-center justify-center mt-[20px]  ${isReadAloudEnabled ? 'flex' : 'hidden'}`}>

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
                    <div className="mb-8 px-[20px]">
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
                    <div className='px-[20px]'>
                        <h3 className="text-lg font-semibold  mb-2">Read Aloud Features</h3>
                        <p className="text-[12px] mb-4">Configure text-to-speech settings</p>

                        {/* Toggle for Enable Read Aloud */}
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

                        {/* Toggle for Speech Rate */}
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
                    </div>

                </div>
            </div>
            {showFeedback && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[var(--background-color)] rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Chapter Feedback</h2>

                        <div className="mb-4">
                            <p className="font-semibold mb-2">Your pronunciation:</p>
                            <div
                                className="p-3 bg-[var(--primary-color)] rounded leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: feedbackData.highlightedText }}
                            />
                        </div>

                        <div className="mb-4">
                            <p className="font-semibold mb-2">Original text:</p>
                            <p className="p-3 bg-[var(--primary-color)] rounded">{currentChapter}</p>
                        </div>

                        <div className="mb-4 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-green-400">✓ Correct: {feedbackData.correct} words</p>
                            </div>
                            <div>
                                <p className="text-red-400">✗ Incorrect: {feedbackData.incorrect} words</p>
                            </div>
                        </div>

                        {feedbackData.missingWords?.length > 0 && (
                            <div className="mb-4">
                                <p className="font-semibold mb-2 text-yellow-500">Missing words ({feedbackData.missingWords.length}):</p>
                                <div className="p-3 bg-[var(--primary-color)] rounded">
                                    <div className="flex flex-wrap gap-2">
                                        {feedbackData.missingWords.map((word, index) => (
                                            <span key={index} className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                                                {word}
                                                <button
                                                    onClick={() => {
                                                        const utterance = new SpeechSynthesisUtterance(word);
                                                        window.speechSynthesis.speak(utterance);
                                                    }}
                                                    className="text-yellow-600 hover:text-yellow-800 ml-1"
                                                    title="Listen to pronunciation"
                                                >
                                                    <i className="fas fa-volume-up text-xs"></i>
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {feedbackData.mispronounced?.length > 0 && (
                            <div className="mb-4">
                                <p className="font-semibold mb-2 text-red-500">Mispronounced words ({feedbackData.mispronounced.length}):</p>
                                <div className="space-y-2">
                                    {feedbackData.mispronounced.map((word, index) => (
                                        <div key={index} className="flex items-center gap-2 p-2 bg-[var(--primary-color)] rounded">
                                            <span className="text-red-400 font-medium">{word.spoken}</span>
                                            <i className="fas fa-arrow-right text-gray-400"></i>
                                            <span className="text-green-400 font-medium">{word.correct}</span>
                                            <button
                                                onClick={() => {
                                                    const utterance = new SpeechSynthesisUtterance(word.correct);
                                                    window.speechSynthesis.speak(utterance);
                                                }}
                                                className="ml-2 text-blue-500 hover:text-blue-700 p-1"
                                                title="Listen to correct pronunciation"
                                            >
                                                <i className="fas fa-volume-up"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Legend for understanding the highlights */}
                        <div className="mb-4 p-3 bg-gray-500 rounded">
                            <p className="font-semibold mb-2 text-sm">Legend:</p>
                            <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                    <span>Correct - </span>
                                    <span className="border-b-2 border-green-500 px-1 rounded text-xs">correct</span>
                                    
                                </div>
                                <div className="flex items-center gap-1">
                                    <span>, Mispronounced -</span>
                                    <span className="border-b-2 border-red-500 px-1 rounded text-xs">wrong</span>
                                    
                                </div>
                                <div className="flex items-center gap-1">
                                    <span>, Missing -</span>
                                    <span className="border-b-2 border-yellow-500 px-1 rounded opacity-50 text-xs">missing</span>
                                    
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowFeedback(false)}
                                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    // Speak the entire correct chapter
                                    const utterance = new SpeechSynthesisUtterance(currentChapter);
                                    window.speechSynthesis.speak(utterance);
                                }}
                                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
                                title="Listen to full chapter"
                            >
                                <i className="fas fa-volume-up"></i>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}