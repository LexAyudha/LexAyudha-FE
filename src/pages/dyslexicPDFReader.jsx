import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ChangeThemeFB from '../components/changeThemeFB'
import ChromaticModel from '../components/chromaticModel';
import AlternativeHeader from '../components/alternativeHeader';
import { FileUploader } from "react-drag-drop-files";
import axiosInstance from '../api/axiosInstance';
import chromaticThemes from '../configs/chromaticThemes';


const fileTypes = ["PDF"];


export default function DyslexicPDFReader() {

  const [sentences, setSentences] = useState([]);
  const [paragraphs, setParagraphs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [sentenceSelect, setSentenceSelect] = useState(true)
  const [paraSelect, setParaSelect] = useState(false)
  const [sentenceIndex, setSentenceIndex] = useState(0)
  const [paraIndex, setParaIndex] = useState(0)
  const [fontSize, setFontSize] = useState(12)
  const [selectedChromaticTheme, setSelectedChromaticTheme] = useState(chromaticThemes?.chromaticClasses[0][1])
  const [selectedColorTheme, setSelectedColorTheme] = useState('chromThemeColor_1')
  const [colorObj, setColorObj] = useState(chromaticThemes?.colors[0].chromThemeColor_1)

  useEffect(() => {
    if (file) {
      extractTextFromPDFServerSide()
      setColorTheme()
    }
  }, [file]);

  useEffect(() => {

    setColorTheme()
  }, [selectedColorTheme]);

  useEffect(() => {
    applyChromaticThemes()
  }, [colorObj, sentences, paragraphs, selectedChromaticTheme, sentenceIndex, paraIndex, sentenceSelect, paraSelect]);


  const setColorTheme = () => {
    const themeNumber = parseInt(selectedColorTheme.slice(-1));
    const colorTheme = chromaticThemes.colors[themeNumber - 1]?.[`${selectedColorTheme}`]
    setColorObj(colorTheme)
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
        let newContent;


        if (colorObj !== null) {
         
          const colorPattern = colorObj ? colorObj.map(color => color.trim()) : chromaticThemes?.colors[0].chromThemeColor_1;

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

  const extractTextFromPDFServerSide = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('pdf', file);

      const response = await axiosInstance.post('/user/pdf-extract', formData);

      if (response.status !== 200) {
        throw new Error('Failed to extract text from PDF');
      }

      const { text } = await response.data;

      // Process the extracted text
      const cleanedText = text.replace(/\s+/g, ' ').trim();

      // Extract paragraphs (split by empty new lines)
      const extractedParagraphs = text
        .split(/\n\s*\n+/)
        .map(p => p.replace(/\s+/g, ' ').trim())
        .filter(p => p.length > 10);

      // Extract sentences (split only after full stops followed by a space)
      const extractedSentences = cleanedText
        .split(/(?<=\.)\s+/)
        .map(s => s.trim())
        .filter(s => s.length > 5);

      setParagraphs(extractedParagraphs);
      setSentences(extractedSentences);
      setIsLoading(false);
    } catch (err) {
     
      setError('Error reading PDF: ' + err.message);
      setIsLoading(false);
    }
  };

  const handleSentenceSelect = () => {
    setParaSelect(false)
    setSentenceSelect(true)
  }

  const handleParaSelect = () => {
    setSentenceSelect(false)
    setParaSelect(true)
  }

  const handlePrevious = () => {
    if (sentenceSelect && sentenceIndex > 0) {
      setSentenceIndex(prevIndex => prevIndex - 1);
    }
    if (paraSelect && paraIndex > 0) {
      setParaIndex(prevIndex => prevIndex - 1);
    }
  };

  const handleNext = () => {
    if (sentenceSelect && sentenceIndex < sentences.length - 1) {
      setSentenceIndex(prevIndex => prevIndex + 1);
    }
    if (paraSelect && paraIndex < paragraphs.length - 1) {
      setParaIndex(prevIndex => prevIndex + 1);
    }
  };

  const handleChange = (file) => {
    setFile(file);
  };


  const handleTryAgain = () => {
    setFile(null)
    setError(null)
  }


  return (
    <div className='la-container relative flex flex-col h-screen justify-center items-center'>
      <ChangeThemeFB />
      <div className='flex justify-start w-full absolute top-0'>
        <AlternativeHeader title='PDF Reader' />
      </div>
      <div className='flex flex-col w-full  min-w-full justify-center'>
        <h3 className='my-[20px]'>PDF Reading Mode</h3>
        <div className='flex h-[500px]'>

          <div className='flex flex-col w-1/4 bg-black bg-opacity-5 p-2 justify-between space-y-2 rounded-lg'>
            <div className='flex flex-col space-y-4'>
              <div onClick={handleSentenceSelect} className={` cursor-pointer w-full flex justify-center p-4 bg-[var(--primary-color)] rounded ${sentenceSelect ? "border border-[var(--text-color)]" : ""}`} >
                <button>Sentence by Sentence</button>
              </div>
              <div onClick={handleParaSelect} className={` cursor-pointer w-full flex justify-center p-4 bg-[var(--primary-color)] rounded ${paraSelect ? "border border-[var(--text-color)]" : ""}`} >
                <button>Paragraph by Paragraph</button>
              </div>

              <div>
                <label className="text-sm  mb-2">Font Size: {fontSize}px</label>
                <input
                  type="range"
                  min="12"
                  max="40"
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  className="w-full h-2 bg-gray-400 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className='flex flex-col'>
                <label className="text-sm mb-1">Chromatic Theme</label>
                <select
                  value={selectedChromaticTheme}
                  onChange={(e) => setSelectedChromaticTheme(e.target.value)}
                  className="border bg-[var(--primary-color)] border-[var(--text-color)] rounded-md px-2 py-1"
                >
                  <option value="chromTheme_1">Theme 1</option>
                  <option value="chromTheme_2">Theme 2</option>
                  <option value="chromTheme_3">Theme 3</option>
                </select>
              </div>
              <div className='flex flex-col'>
                <label className="text-sm mb-1">Color Theme</label>
                <select
                  value={selectedColorTheme}
                  onChange={(e) => setSelectedColorTheme(e.target.value)}
                  className="border bg-[var(--primary-color)] border-[var(--text-color)] rounded-md px-2 py-1"
                >
                  <option value="chromThemeColor_1">Color 1</option>
                  <option value="chromThemeColor_2">Color 2</option>
                  <option value="chromThemeColor_3">Color 3</option>

                </select>
              </div>

            </div>
            <button onClick={handleTryAgain} className=' group cursor-pointer mt-4 flex justify-center items-center text-[var(--text-color)] border-[var(--text-color)] border rounded px-4 py-2'>
              <p className='m-0 '>Upload New PDF</p>

            </button>

          </div>
          <div className='w-[2px] h-full primary-color-bg mx-[20px]'></div>
          <div className='w-3/4 h-full'>
            <div className='flex p-2 rounded-xl h-full flex-col w-full justify-between bg-black bg-opacity-5'>

              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--text-color)]"></div>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-full text-red-500">
                  <p className='m-0 text-wrap'> Sorry, it seems like we cannot read the uploaded PDF. Try uploading again.</p>
                  <button onClick={handleTryAgain} className=' group cursor-pointer mt-4 flex justify-center items-center text-[var(--text-color)] border-[var(--text-color)] border rounded px-4 py-2'>
                    <p className='m-0  mr-[8px]'>Try Again</p>
                    <i className=' fa-solid fa-rotate-right group-hover:animate-spin'></i>
                  </button>
                </div>
              ) : file ? (
                <div className="h-full overflow-auto">


                  <div className='w-full h-full overflow-y-auto justify-center items-center flex'>
                    {sentenceSelect &&
                      <p data-attribute="chromatic" className={`m-0 ${selectedChromaticTheme}`} style={{ fontSize: `${fontSize}px` }}>{sentences[sentenceIndex]}</p>
                    }
                    {paraSelect &&
                      <p data-attribute="chromatic" className={`m-0 ${selectedChromaticTheme}`} style={{ fontSize: `${fontSize}px` }}>{paragraphs[paraIndex]}</p>
                    }
                  </div>




                  {/* Add your content display here */}
                </div>
              ) : (
                <FileUploader handleChange={handleChange} name="file" types={fileTypes} classes={'height-full'} >
                  <div className='flex rounded-lg justify-center items-center w-full h-full border-2 border-dashed border-[var(--text-color)]'>
                    <div className='flex justify-center items-center flex-col'>
                      <i className='fa-solid fa-upload text-7xl'></i>
                      <p className='m-0 py-4 font-bold text-xl'>Drag & drop to upload</p>
                      <p className='m-0 font-thin text-lg'>or browse</p>
                      <p className='m-0 font-extralight text-[12px] py-6'>&#40;Make sure your PDF has only text content.&#41;</p>
                    </div>
                  </div>
                </FileUploader>
              )}

            </div>
            {file &&
              <div className='flex justify-between items-center mt-2'>
                <button className='bg-[var(--primary-color)] px-[10px] py-[5px] rounded cursor-pointer' onClick={handlePrevious}>
                  <div className='flex group relative items-center'>
                    <p className='m-0'>Previous</p>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full"></span>
                  </div>
                </button>
                <p>Extracted {sentences.length} sentences - {paragraphs.length} paragraphs</p>
                <button className='bg-[var(--primary-color)] px-[10px] py-[5px] rounded cursor-pointer' onClick={handleNext}>
                  <div className='flex group relative items-center'>
                    <p className='m-0'>Next</p>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full"></span>
                  </div>
                </button>

              </div>
            }

          </div>
        </div>
      </div>
    </div>
  )
}