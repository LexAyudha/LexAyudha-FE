import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import chromaticThemes from '../configs/chromaticThemes'

export default function ChromaticModel({ initialChromaticTheme, updateChromaticTheme }) {
  const chromaticClasses = chromaticThemes.chromaticClasses
  const colors = chromaticThemes.colors


  const [open, setOpen] = useState(false);
  const [chromaticTheme, setChromaticTheme] = useState('');
  const [selectedChromaticTheme, setSelectedChromaticTheme] = useState(localStorage.getItem('selectedChromaticTheme') || initialChromaticTheme || 'chromTheme_1');
  const [selectedColPattern, setSelectedColPattern] = useState(colors[0]?.chromThemeColor_1)

  // Update selected theme when initialChromaticTheme changes
  useEffect(() => {
    if (initialChromaticTheme) {
      setSelectedChromaticTheme(initialChromaticTheme);
      localStorage.setItem('selectedChromaticTheme', initialChromaticTheme);
      localStorage.setItem('selectedColPattern', selectedColPattern);
    }
  }, [initialChromaticTheme]);

  // Apply chromatic themes whenever the component mounts or selected theme changes
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      applyChromaticThemes();
    }, 100);

    return () => clearTimeout(timer);
  }, [selectedChromaticTheme]);

  // Apply chromatic themes to modal examples when modal opens
  useEffect(() => {
    if (open) {
      // Small delay to ensure modal content is rendered
      const timer = setTimeout(() => {
        applyChromaticThemes();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    // Small delay to ensure modal content is rendered
    const timer = setTimeout(() => {
      applyChromaticThemes();
    }, 100);
    return () => clearTimeout(timer);
  }, [selectedColPattern]);

  useEffect(() => {
    // Small delay to ensure modal content is rendered
    const timer = setTimeout(() => {
      applyChromaticThemes();
    }, 100);
    return () => clearTimeout(timer);
  }, [updateChromaticTheme]);

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
          const colorPattern = selectedColPattern || colors.chromThemeColor_1;
          
          newContent = fragments.map((fragment) => {
            // Skip applying colors to whitespace for word theme
            if (originalClass === 'chromTheme_1' && fragment.trim() === '') {
              return fragment; // Return whitespace as is
            }

            const color = colorPattern[colorIndex % colorPattern.length];
            colorIndex++;
            
            return `<span style="color: ${color};">${fragment}</span>`;
          }).join(''); // Join without adding spaces
        }else{
         
         
          newContent = fragments.map((fragment) => {
            // Skip applying colors to whitespace for word theme
            if (originalClass === 'chromTheme_1' && fragment.trim() === '') {
              return fragment; // Return whitespace as is
            }

            return `<span style="color: var(--text-color);">${fragment}</span>`;
          }).join(''); // Join without adding spaces
        }


        pTag.innerHTML = newContent;
      }
    });
  };

  // Deep comparison function for arrays
  const arraysEqual = (a, b) => {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    if (chromaticTheme) {
      setSelectedChromaticTheme(chromaticTheme[1]);
      localStorage.setItem('selectedChromaticTheme', chromaticTheme[1]);
    }
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleThemeChange = (theme) => {
    
    setChromaticTheme(theme);

    updateChromaticTheme(theme[1])
    localStorage.setItem('selectedChromaticTheme', theme[1])
  };

  const handleColorChange = (number) => {
    const newPattern = colors[number - 1]?.[`chromThemeColor_${number}`];
    if (arraysEqual(selectedColPattern, newPattern)) {
      setSelectedColPattern(null);
      localStorage.removeItem('selectedColPattern');
    } else {
      setSelectedColPattern(newPattern);
      localStorage.setItem('selectedColPattern', newPattern);
    }
  }

  return (
    <div>
      <div className='flex items-center justify-center relative group cursor-pointer' onClick={showModal}>
        <p className='m-0'>Customize lesson</p>
        <i className="fa-solid fa-wrench ml-2"></i>
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full"></span>
      </div>
      <Modal
        title="Choose Chromatic Variation for the lesson"
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className=' flex justify-evenly mt-[20px]'>
          <div className='flex flex-col w-1/2 '>
            <p>Select a chromatic theme:</p>
            <div className='flex flex-col h-[300px] overflow-y-auto overflow-x-hidden w-full px-[20px]'>
              {chromaticClasses.map((theme, index) => (
                <div
                  key={index}
                  className={`p-4 m-2 w-full cursor-pointer rounded-md border ${chromaticTheme && chromaticTheme[1] === theme[1] ? 'border-blue-500 border-2' : 'border-gray-300'
                    }`}
                  onClick={() => handleThemeChange(theme)}
                >
                  <p
                    className={`m-0 ${theme[1]}`}
                    data-attribute="chromatic"
                  >
                    {theme[0]}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className='flex flex-col w-1/2'>
            <p>Select a color pattern:</p>
            <div className='flex flex-col h-[300px] overflow-y-auto overflow-x-hidden w-full px-[20px]'>
              {colors.map((theme, index) => (
                <div
                  key={index}
                  className={`p-[17px] m-2 w-full flex cursor-pointer rounded-md border ${selectedColPattern && arraysEqual(selectedColPattern, theme[`chromThemeColor_${index + 1}`]) ? 'border-blue-500 border-2' : 'border-gray-300'}`}
                  onClick={() => handleColorChange(index + 1)}
                >

                  {theme[`chromThemeColor_${index + 1}`].map((color) => (
                    <div
                      key={color}
                      className="w-[20px] h-[20px] mx-[5px] rounded-md"
                      style={{ backgroundColor: color }}
                    ></div>
                  ))}
                </div>
              ))}
            </div>
          </div>

        </div>


      </Modal>
    </div>
  );
}