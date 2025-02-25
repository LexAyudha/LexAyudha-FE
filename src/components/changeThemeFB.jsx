import React, { useEffect, useState } from 'react';
import { FloatButton } from "antd";
import Draggable from 'react-draggable';
import { themes, fonts } from '../configs/theme.js';

export default function ChangeThemeFB({ initialThemeName, initialFontName }) {
  const [selectedFont, setSelectedFont] = useState(localStorage.getItem('selectedFont') || initialFontName || '');
  const [selectedTheme, setSelectedTheme] = useState(localStorage.getItem('selectedTheme') || initialThemeName || '');

  useEffect(() => {
    if (selectedFont) {
      applyFont(selectedFont);
    }
    if (selectedTheme) {
      applyTheme(selectedTheme);
    }
  }, [selectedFont, selectedTheme]);

  const applyFont = (fontName) => {
    const theme = fonts[fontName];
    Object.entries(theme).forEach(([property, value]) => {
      document.documentElement.style.setProperty(property, value);
    });
  };

  const applyTheme = (themeName) => {
    const theme = themes[themeName];
    Object.entries(theme).forEach(([property, value]) => {
      document.documentElement.style.setProperty(property, value);
    });
  };

  const handleFontChange = (fontName) => {
    setSelectedFont(fontName);
    localStorage.setItem('selectedFont', fontName);
    applyFont(fontName);
  };

  const handleThemeChange = (themeName) => {
    setSelectedTheme(themeName);
    localStorage.setItem('selectedTheme', themeName);
    applyTheme(themeName);
  };

  return (
    <Draggable>
      <FloatButton.Group
        trigger="click"
        type="primary"
        icon=''
        description="Select Theme"
        style={{ insetInlineEnd: 170, padding: '10px' }}
      >
        <div className='flex'>
          <div className='bg-[#918aff] flex justify-center items-center w-64 p-2 rounded-md flex-col'>
            <p className='text-white font-bold my-2 text-lg'>Choose font</p>
            <div className='flex justify-evenly items-center flex-wrap'>
              {Object.keys(fonts).map((fontName, index) => {
                const font = fonts[fontName];
                return (
                  <button
                    key={fontName}
                    onClick={() => handleFontChange(fontName)}
                    style={{
                      backgroundColor: "#fff",
                      color: '#02020c',
                      fontFamily: font["--font-family"],
                      padding: '10px 20px',
                      border: selectedFont === fontName ? '2px solid red' : 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      margin: '5px',
                      fontWeight: 'bold',
                    }}
                    className={`font-${index + 1}-btn`}
                  >
                    {`${fontName}`}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className='bg-[#918AFF] p-2 rounded-md flex justify-center items-center w-64 flex-col'>
          <p className='text-white font-bold my-2 text-lg'>Choose theme</p>
          <div className='flex justify-evenly items-center flex-wrap'>
            {Object.keys(themes).map((themeName, index) => {
              const theme = themes[themeName];
              return (
                <button
                  key={themeName}
                  onClick={() => handleThemeChange(themeName)}
                  style={{
                    backgroundColor: theme["--background-color"],
                    color: theme["--text-color"],
                    padding: '10px 20px',
                    border: selectedTheme === themeName ? '2px solid red' : 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    margin: '5px',
                    fontWeight: 'bold'
                  }}
                  className={`theme-${index + 1}-btn`}
                >
                  {`Theme ${index + 1}`}
                </button>
              );
            })}
          </div>
        </div>
      </FloatButton.Group>
    </Draggable>
  );
}