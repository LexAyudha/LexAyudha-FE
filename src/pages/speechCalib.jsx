import React, { useEffect, useRef, useState } from 'react'
import ChangeThemeFB from '../components/changeThemeFB'
import { useVoiceVisualizer, VoiceVisualizer } from "react-voice-visualizer";
import axios from 'axios';

export default function SpeechCalibPage() {
    const [sentenceCount, setSentenceCount] = useState(2);
    const [currentStep, setCurrentStep] = useState(1);
    const [textColor, setTextColor] = useState('');
    const [progressContainerWidth, setProgressContainerWidth] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const progressContainerRef = useRef(null);
    const recorderControls = useVoiceVisualizer();

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
        setTextColor(getTextColor())
    }, []);

    // Get the recorded audio blob and send it to Audio
    useEffect(() => {
        if (!recordedBlob) return;

        sendAudioToAPI(recordedBlob);
        downloadAudio(recordedBlob);
    }, [recordedBlob, error]);

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
            console.log('Current step and sentence count: ', currentStep, sentenceCount)
        }
    };

    const sendAudioToAPI = async (blob) => {
        const formData = new FormData();
        formData.append('file', new File([blob], 'speechAudio.wav', { type: 'audio/wav' }));

        try {
            console.log('API call has been made to upload the audio file');
            //   const response = await axios.post('/api/upload', formData, {
            //     headers: {
            //       'Content-Type': 'multipart/form-data',
            //     },
            //   });
            //   console.log('File uploaded successfully:', response.data);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const handleFinish =()=>{
        window.location.href = '/selectTraining'
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

    return (
        <div className='la-container flex h-screen  flex-col justify-center items-center'>
            <ChangeThemeFB />
            <div className='flex h-[650px] w-[1200px] text-wrap  flex-col justify-between relative'>
                <div className='absolute flex right-0 top-0'>
                    {/* Need insert training selection page link */}
                    <a href='#' className='theme-txt-color py-[5px] primary-color-bg rounded-md px-[30px]'> Skip</a>
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
                        <h3 className={`${currentStep <= sentenceCount  ? 'hidden' : ''}`}>Hurray! You have done the test</h3>
                    </div>
                    <div className={`flex justify-center ${currentStep > sentenceCount ? 'hidden' : ''}`}>
                        <VoiceVisualizer height='80' mainBarColor={textColor} defaultAudioWaveIconColor={textColor} isDefaultUIShown='false' onlyRecording='true' controls={recorderControls} ref={audioRef} />
                    </div>
                    <div className={`flex justify-center mt-[20px] ${currentStep <= sentenceCount  ? 'hidden' : ''}`}>
                        <button onClick={handleFinish} className='py-[10px] px-[20px] primary-color-bg rounded-md'>Finish</button>
                    </div>
                </div>
            </div>
        </div>
    )
}