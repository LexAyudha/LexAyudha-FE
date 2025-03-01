import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';

export default function ChromaticModel({ initialChromaticTheme, onChromaticThemeChange }) {
  const [open, setOpen] = useState(false);
  const [chromaticTheme, setChromaticTheme] = useState(initialChromaticTheme);

  useEffect(() => {
    setChromaticTheme(initialChromaticTheme);
  }, [initialChromaticTheme]);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    onChromaticThemeChange(chromaticTheme);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleThemeChange = (e) => {
    setChromaticTheme(e.target.value);
  };

  return (
    <div>
      <div className='flex items-center justify-center relative group' onClick={showModal}>
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
        <p>Select a chromatic theme:</p>
        <div className='flex flex-col h-[300px] overflow-y-auto overflow-x-hidden w-full px-[20px] '>
          {['chromTheme 1', 'chromTheme 2', 'chromTheme 3', 'chromTheme 4', 'chromTheme 5'].map((theme) => (
            <div
              key={theme}
              className={`p-4 m-2 w-full cursor-pointer rounded-md border ${chromaticTheme === theme ? 'border-blue-500' : 'border-gray-300'}`}
              onClick={() => handleThemeChange(theme)}
            >
              {theme}
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}