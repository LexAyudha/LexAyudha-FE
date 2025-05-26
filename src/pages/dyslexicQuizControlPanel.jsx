// Dyslexia quiz page control panel
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import ChangeThemeFB from '../components/changeThemeFB'
import ChromaticModel from '../components/chromaticModel';
import AlternativeHeader from '../components/alternativeHeader';
import { useQuery } from '@tanstack/react-query';
import { getQuizzes } from '../api/RecurringAPI';
import DysLexiaPracitcePDFDoc from '../components/dysLexiaPracitcePDFDoc';


export default function DyslexicQuizControlPanel() {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedChromaticTheme, setSelectedChromaticTheme] = useState(null);
  const [previewContent, setPreviewContent] = useState(false)
  const [pdfDownloadMenu, setPdfDownloadMenu] = useState(false)
  const [pdfTxtSize, setPdfTxtSize] = useState(12)
  const [pdfChromaticTheme, setPdfChromaticTheme] = useState()
  const [pdfChromaticColor, setPdfChromaticColor] = useState()
  const [pdfPreview, setPdfPreview] = useState(null);

  const navigate = useNavigate();

  const { data: lessons, isLoading, error } = useQuery({
    queryKey: ['quizzes'],
    queryFn: getQuizzes,

  });

  useEffect(() => {
    setTimeout(() => {
      setSelectedLesson(lessons[0]);
      setSelectedChromaticTheme(lessons[0].chromaticTheme);

    }, 200);

  }, [lessons]);

  useEffect(() => {
    setPdfChromaticTheme(selectedLesson?.chromaticTheme)
    setPdfChromaticColor(selectedLesson?.colorTheme)
  }, [pdfDownloadMenu]);

  const handleClickedLesson = (index) => {
    if (lessons && lessons.length > index) {
      setSelectedLesson(lessons[index]);
      setSelectedIndex(index);
      setSelectedChromaticTheme(lessons[index].chromaticTheme);
    }
  }

  const handleStartLesson = () => {
    navigate(`/screen-reader-quiz/${selectedLesson?.id}`);
  }

  const updateChromaticTheme = async (theme) => {
   setSelectedChromaticTheme(theme)
  }

  const openPdfDownloadMenu = () => {
    setPreviewContent(false)
    setPdfDownloadMenu(true)
  }

  // Add this preview function
  const previewPdf = async () => {
    setPdfPreview(true)
  };

  return (
    <div className='la-container relative flex flex-col h-screen justify-center items-center'>
      <ChangeThemeFB />
      <div className='flex justify-start w-full absolute top-0'>
        <AlternativeHeader title='Screen Reader - Quiz' />
      </div>
      <div className='flex flex-col w-full min-w-full justify-center'>
        <h3 className='my-[20px]'>Lessons</h3>
        <div className='flex h-[500px]'>
          <div className='flex flex-col w-1/4 bg-black bg-opacity-5 rounded-lg'>
            {isLoading ? (
              <div className="flex px-2 flex-col items-center justify-center h-full space-y-4">
                <p className="text-sm text-center text-[var(--text-color)]">
                  Please wait while we generate the quizzes for you...
                </p>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--text-color)]"></div>
              </div>
            ) : error ? (
              <div className="flex px-2 flex-col items-center justify-center h-full">
                <p className="text-sm text-center text-red-500">
                  Error loading lessons. Please try again later.
                </p>
              </div>
            ) : lessons?.length > 0 ? (
              <ul>
                {lessons.map((Item, index) => (
                  <li key={index} className={`shadow-md ${index === selectedIndex ? 'inset-0 bg-black bg-opacity-10 pointer-events-none' : ''}`}>
                    <div className='flex justify-center py-[10px] cursor-pointer' onClick={() => handleClickedLesson(index)}>
                      {Item?.name}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex px-2 flex-col items-center justify-center h-full">
                <p className="text-sm text-center text-[var(--text-color)]">
                  No lessons available.
                </p>
              </div>
            )}
          </div>

          <div className='w-[2px] h-full primary-color-bg mx-[20px]'></div>

          <div className='w-3/4'>
            {isLoading ? (
              <div className="flex px-2 flex-col items-center justify-center h-full space-y-4">
                <p className="text-sm text-center text-[var(--text-color)]">
                  Loading quiz details...
                </p>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--text-color)]"></div>
              </div>
            ) : selectedLesson ? (
              <div className='w-full h-full flex flex-col justify-between'>
                <div className='flex flex-col justify-between'>
                  <div className='flex justify-between items-center w-full'>
                    <h3 className='pb-[16px]'>{selectedLesson?.name}</h3>
                    <button className='bg-[var(--primary-color)] px-[10px] py-[5px] rounded cursor-pointer' onClick={() => setPreviewContent(true)}>
                      <div className='flex group relative items-center'>
                        <p className='m-0'>Preview Content</p>
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full"></span>
                      </div>
                    </button>
                  </div>

                  <p className='h-[150px] overflow-x-hidden'>{selectedLesson?.description}</p>
                  <div className='mt-[20px] px-[20px] py-[10px] rounded-md'>
                    <p>Ex: </p>
                    <p className={`m-0 text-[36px] ${selectedChromaticTheme}`} data-attribute="chromatic">
                      {selectedLesson?.example}
                    </p>
                  </div>
                </div>
                <div className='flex justify-between items-center'>
                  <div className='cursor-pointer'>
                    <ChromaticModel
                      initialChromaticTheme={selectedLesson?.chromaticTheme}
                      updateChromaticTheme={updateChromaticTheme}
                    />
                  </div>
                  <a onClick={handleStartLesson} className='flex cursor-pointer items-center justify-center primary-color-bg rounded-md py-[10px] px-[35px]'>
                    <div className='flex group relative items-center'>
                      <p className='m-0'>Start Quiz</p>
                      <i className="fa-solid fa-chevron-right ml-[5px]"></i>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full"></span>
                    </div>
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex px-2 flex-col items-center justify-center h-full">
                <p className="text-sm text-center text-[var(--text-color)]">
                  Please select a quiz to view details.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {previewContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--background-color)] relative rounded-lg p-6 max-w-2xl flex flex-col justify-center items-center w-full mx-4">

            <div className='flex w-full justify-center relative pb-6'>
              <h3 className='m-0'>Quiz Content</h3>
              <i className='fa-x absolute z-20 top-50 right-0 cursor-pointer' onClick={() => setPreviewContent(false)}></i>
            </div>

            <div className='flex flex-col justify-center py-[20px] items-center text-start w-full h-[300px] overflow-y-auto'>
              {selectedLesson?.chapters.map((sentence, key) => (
                <div className='flex w-full justify-start'>
                  <p className='m-0'>{key}.</p>
                  <p key={key} className={`w-full ${selectedLesson.chromaticTheme}`} data-attribute="chromatic"> {sentence}</p>
                </div>

              ))}
            </div>
            <div className='flex w-full pt-6 justify-center items-center'>
              <button className='bg-[var(--primary-color)] px-[10px] py-[5px] rounded cursor-pointer' onClick={openPdfDownloadMenu} >
                <div className='flex group relative items-center'>
                  <p className='m-0'>Download as PDF</p>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full"></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {pdfDownloadMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--background-color)] relative rounded-lg p-6 max-w-2xl flex flex-col justify-center items-center w-full mx-4">

            <div className='flex w-full justify-center relative pb-6'>
              <h3 className='m-0'>PDF options</h3>
              <i className='fa-x absolute z-20 top-50 right-0 cursor-pointer' onClick={() => { setPdfDownloadMenu(false), setPreviewContent(true) }}></i>
            </div>

            <div className='flex flex-col justify-center text-wrap bg-[var(--primary-color)] px-2 rounded-lg  py-[20px] items-center text-start w-full h-[100px] overflow-y-auto'>

              <p className={`w-full ${pdfChromaticTheme}`} style={{ fontSize: `${pdfTxtSize}px` }} data-attribute="chromatic"> {selectedLesson?.example}</p>

            </div>
            <div className='flex py-8 w-full space-x-4'>
              <div className='flex flex-col w-1/3'>
                <label className="text-sm mb-2">Font Size: {pdfTxtSize}px</label>
                <input
                  type="range"
                  min="12"
                  max="40"
                  value={pdfTxtSize}
                  onChange={(e) => setPdfTxtSize(e.target.value)}
                  className="w-full h-2 bg-gray-400 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className='flex flex-col w-1/3'>
                <label className="text-sm mb-1">Chromatic Theme</label>
                <select
                  value={pdfChromaticTheme}
                  onChange={(e) => setPdfChromaticTheme(e.target.value)}
                  className="border bg-[var(--primary-color)] border-[var(--text-color)] rounded-md px-2 py-1"
                >
                  <option value="chromTheme_1">Theme 1</option>
                  <option value="chromTheme_2">Theme 2</option>
                  <option value="chromTheme_3">Theme 3</option>
                </select>
              </div>

              <div className='flex flex-col w-1/3'>
                <label className="text-sm mb-1">Color Theme</label>
                <select
                  value={pdfChromaticColor}
                  onChange={(e) => setPdfChromaticColor(e.target.value)}
                  className="border bg-[var(--primary-color)] border-[var(--text-color)] rounded-md px-2 py-1"
                >
                  <option value="chromThemeColor_1">Color 1</option>
                  <option value="chromThemeColor_2">Color 2</option>
                  <option value="chromThemeColor_3">Color 3</option>
                </select>
              </div>
            </div>
            <div className='flex w-full pt-6 justify-center items-center space-x-4'>
              <button
                className='bg-[var(--primary-color)] px-[10px] py-[5px] rounded cursor-pointer'
                onClick={previewPdf}
              >
                <div className='flex group relative items-center'>
                  <p className='m-0'>Preview PDF</p>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full"></span>
                </div>
              </button>
              
            </div>
          </div>
        </div>
      )}

      {pdfPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <DysLexiaPracitcePDFDoc
          chromTheme={pdfChromaticTheme}
          chromColor={pdfChromaticColor}
          fontSize={pdfTxtSize}
          selectedLesson={selectedLesson}
          closeWindow={()=>setPdfPreview(false)}
        />
        </div>
      )}
    </div>
  )
}