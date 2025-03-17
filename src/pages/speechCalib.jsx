import React, { useEffect, useRef, useState } from 'react'
import ChangeThemeFB from '../components/changeThemeFB'
import { useVoiceVisualizer, VoiceVisualizer } from "react-voice-visualizer";
import { decodeToken } from '../utils/tokenUtils';
import axiosInstance from '../api/axiosInstance';
import toWav from 'audiobuffer-to-wav';
import ThankYouPopUp from '../components/thankYouPopUp';

export default function SpeechCalibPage() {
    const [sentenceCount, setSentenceCount] = useState(2);
    const [currentStep, setCurrentStep] = useState(1);
    const [textColor, setTextColor] = useState('');
    const [progressContainerWidth, setProgressContainerWidth] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [decodedToken, setDecodedToken] = useState()
    const progressContainerRef = useRef(null);
    const recorderControls = useVoiceVisualizer();
    const [collectedBlobs, setCollectedBlobs] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [apiError, setApiError] = useState(false)

    // Converts raw recorded blob into WAV format using audiobuffer-to-wav
    const processAudioBlob = async (blob) => {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const arrayBuffer = await blob.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            const wavArrayBuffer = toWav(audioBuffer); // Convert AudioBuffer to WAV format

            return new Blob([wavArrayBuffer], { type: 'audio/wav' });
        } catch (error) {
            console.error('Error converting blob to WAV:', error);
            return null;
        }
    };

    // Collect and process recorded audio
    const constructAudioForm = async (blob) => {
        const wavBlob = await processAudioBlob(blob);
        if (wavBlob) {
            setCollectedBlobs((prevBlobs) => [...prevBlobs, wavBlob]);
            console.log('Processed WAV blob added:', wavBlob);
        }
    };

    const handleAudioSubmit = async () => {
        try {
            // Create FormData inside the submit function to ensure it's fresh
            const formData = new FormData();
            
            // Add all your files to the FormData
            collectedBlobs.forEach((blob, index) => {
                // Convert Blob into File before appending to FormData
                const file = new File([blob], `speechAudio_${index}.wav`, { type: 'audio/wav' });
                formData.append('file', file);
            });

            // Send the request with all files
            const res = await axiosInstance.post(`/speech/uploads/${decodedToken?.userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res?.status === 200) {
                updateUserFirstTime()
            }
        } catch (error) {
            setApiError(true)
            console.log(error)
        }
    }

    const getTextColor = () => {
        const root = document.documentElement;
        const textColor = getComputedStyle(root).getPropertyValue('--text-color');
        return textColor.trim().toString();
    };

    const sentencesList = [
        'The quick brown fox jumps over the lazy dog.',
        'She sells seashells by the seashore.',
        'How much wood would a woodchuck chuck if a woodchuck could chuck wood?',
        'Peter Piper picked a peck of pickled peppers.',
        'Betty Botter bought some butter but she said the butter’s bitter.',

    ]

    const {
        // ... (Extracted controls and states, if necessary)
        recordedBlob,
        error,
        audioRef,
        isProcessingRecordedAudio,
    } = recorderControls;

    useEffect(() => {
        const updateWidth = () => {
            if (progressContainerRef.current) {
                setProgressContainerWidth(progressContainerRef.current.offsetWidth);
            }
        };

        setSentenceCount(sentencesList.length);
        updateWidth();
        window.addEventListener('resize', updateWidth);

        return () => {
            window.removeEventListener('resize', updateWidth);
        };
    }, []);

    useEffect(() => {
        setDecodedToken(decodeToken('accessToken'))

        setTextColor(getTextColor())
    }, []);

    // Get the recorded audio blob and send it to Audio
    useEffect(() => {
        if (recorderControls.recordedBlob) {
            constructAudioForm(recorderControls.recordedBlob);
        }
    }, [recorderControls.recordedBlob]);

    // Get the error when it occurs
    useEffect(() => {
        if (!error) return;

        console.log(error);
    }, [error]);

    useEffect(() => {

        if (isProcessingRecordedAudio) {
            handleNextStep();
        }

    }, [isProcessingRecordedAudio]);

    const handleNextStep = () => {
        if (currentStep <= sentenceCount) {
            setCurrentStep(currentStep + 1);
            
        }
    };



    const updateUserFirstTime = async () => {

        try {
            const payload = {
                isFirstTimeUser: false
            }

            const res = await axiosInstance.patch(`/user/${decodedToken?.userId}`, payload);

            if (res?.status === 200) {
                setIsLoading(false)
                setIsComplete(true)
            } else {
                setApiError(true)
            }
        } catch (error) {
            setApiError(true)
           console.log(error)
        }
    }
    const handleFinish = async () => {
        setIsLoading(true)
        await handleAudioSubmit()
    }
    const downloadAudio = (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'audio.wav';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const handleErrorPop = () => {
        window.location.href = '/selectTraining'
    }

    return (
        <div className='la-container flex h-screen  flex-col justify-center items-center'>
           { isComplete ?  <ThankYouPopUp
                    message="Your speech sample has been submitted successfully."
                    redirectMessage="You will be redirected to the training selection menu shortly."
                    redirectDelay={5}
                    redirectUrl="/selectTraining"
            />: ''}
            <div className={`w-screen h-screen absolute z-40 items-center justify-center bg-black bg-opacity-70 ${isLoading?'flex':'hidden'}`}>
                <div className=' flex flex-col text-center items-center justify-center rounded-md p-[20px_30px] bg-[var(--background-color)]'>
                    <h4 className='my-[20px]'>Please wait. Your voice is being analzed</h4>
                    <div className='custom-loader my-[30px]'></div>
                </div>
            </div>
            <div className={`w-screen h-screen absolute z-40 items-center justify-center bg-black bg-opacity-70 ${apiError?'flex':'hidden'}`}>
                <div className=' flex flex-col text-center items-center justify-center rounded-md p-[20px_30px] bg-[var(--background-color)]'>
                    <h4 className='my-[20px]'>Hmm... Something went wrong.</h4>
                    <div className=' my-[10px]'>
                        <button onClick={handleErrorPop} className='py-[10px] px-[20px] primary-color-bg rounded-md'>Okay</button>
                    </div>
                </div>
            </div>
            <ChangeThemeFB />
            <div className='flex h-[650px] w-[1200px] text-wrap  flex-col justify-between relative'>
                <div className='absolute flex right-0 top-0'>
                    {/* Need insert training selection page link */}
                    <a href='/selectTraining' className='theme-txt-color py-[5px] primary-color-bg rounded-md px-[30px]'> Skip</a>
                </div>
                <div className='flex flex-col'>
                    <h1 className='w-full text-center my-[32px]'>Speech Calibration</h1>
                    <div className='flex flex-col'>
                        <h3 className='mb-[20px]'>Instructions:</h3>
                        <ul className='list-disc pl-[40px]'>
                            <li>Read each sentence below aloud and clearly in your normal speaking speed.</li>
                            <li>Click 'Next' once you have finished reading a sentence.</li>
                            <li>This test contains {sentenceCount} sentences.</li>
                            <li><span className='flex items-center'>Make sure your microphone is connected and working. <i class="fa-solid fa-microphone ml-[15px]"></i><i class="fa-solid fa-check ml-[5px]"></i> </span></li>
                        </ul>
                    </div>
                    <div className='py-[20px]'>
                        <h4>Calibration Progress:</h4>
                    </div>
                    <div className='flex justify-center items-center' ref={progressContainerRef}>
                        <div className='w-full flex justify-between items-center '>
                            {Array.from({ length: sentenceCount }, (_, index) => (
                                <div key={index} className='flex items-center relative'>
                                    <div className={`w-[30px] h-[30px] z-30 rounded-full flex justify-center items-center ${index < currentStep ? 'bg-green-500' : 'bg-gray-300'}`}>{index + 1}</div>
                                    {index < sentenceCount - 1 && <div className={`w-[calc(100%)] absolute translate-x-[15px]  h-[5px] ${index < currentStep - 1 ? 'bg-green-500' : 'bg-gray-300'}`} style={{ width: `${(progressContainerWidth - 15) / (sentenceCount - 1)}px` }}></div>}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='py-[10px] px-[10px] mt-[15px] primary-color-bg rounded-md'>

                        <h3 className={`${currentStep > sentenceCount ? 'hidden' : ''}`}>{sentencesList[currentStep - 1]}</h3>
                        <h3 className={`${currentStep <= sentenceCount ? 'hidden' : ''}`}>Hurray! You have done the test</h3>
                    </div>
                    <div className={`flex justify-center ${currentStep > sentenceCount ? 'hidden' : ''}`}>
                        <VoiceVisualizer height='80' mainBarColor={textColor} defaultAudioWaveIconColor={textColor} isDefaultUIShown='false' onlyRecording='true' controls={recorderControls} ref={audioRef} />
                    </div>
                    <div className={`flex justify-center mt-[20px] ${currentStep <= sentenceCount ? 'hidden' : ''}`}>
                        <button onClick={handleFinish} className='py-[10px] px-[20px] primary-color-bg rounded-md'>Finish</button>
                    </div>
                </div>
            </div>
        </div>
    )
}