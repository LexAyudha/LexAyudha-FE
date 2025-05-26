// Dyslexia practice outcome pdf
import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import logo from '../assets/lexLogo.png';
import ChangeThemeFB from '../components/changeThemeFB'
import chromaticThemes from '../configs/chromaticThemes'

const DysLexiaPracticePDFDoc = ({ chromTheme, chromColor, fontSize, selectedLesson, closeWindow }) => {
  const pdfContentRef = useRef(null);
  const [selectedColPattern, setSelectedColPattern] = useState()


  const generatePDF = async () => {
    if (!pdfContentRef.current) return;

    try {
      // Get the element to capture
      const element = pdfContentRef.current;

      // Create canvas from the element
      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
    
        width: element.scrollWidth,
        height: element.scrollHeight,
      });

      // Calculate dimensions for A4
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = 297; // A4 height in mm
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      // Handle multiple pages if content is too tall
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      // Save the PDF
      pdf.save(`${selectedLesson?.name || 'lesson'}-practice.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  useEffect(() => {
    setColorTheme();
  }, [chromColor]); // Add chromColor as dependency

  useEffect(() => {
    applyChromaticThemes();
  }, [selectedColPattern, chromTheme]);

  const closePreview = () => {
    closeWindow(false)
  }
  const setColorTheme = () => {
    const colorTheme = chromaticThemes.colors[0]?.[`${chromColor}`]
    
    setSelectedColPattern(colorTheme)
  }

  const applyChromaticThemes = () => {
    const pTags = document.querySelectorAll('p[data-attribute="chromatic"]');
    console.log('Ptags found: ', pTags)
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
          console.log('Seleceted color pattern: ', selectedColPattern)
          const colorPattern = selectedColPattern ? selectedColPattern.map(color => color.trim()) : chromaticThemes?.colors[0].chromThemeColor_1;

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


  return (
    <div className="pdf-generator-container h-full overflow-auto py-12 flex justify-center">
      {/* PDF Content - This will be captured */}
      <ChangeThemeFB />
      <div
        ref={pdfContentRef}
        className="la-container pdf-content w-[794px] min-h-[1123px] h-fit p-[40px] relative bg-[var(--background-color)]"
        style={{
          width: '794px', // A4 width in pixels (210mm * 3.78)
          minHeight: '1123px', // A4 height in pixels (297mm * 3.78)
          padding: '40px',
          fontFamily: 'Arial, sans-serif',
          position: 'relative',
        }}
      >
        {/* Header with Logo */}
        <div
          className='flex items-center mb-[30px] border-b-[1px] border-[var(--text-color)] pb-[15px]'

        >
          <img
            src={logo}
            alt="LexAyudha Logo"
            style={{
              width: '50px',
              height: '50px',
            }}
          />
          <h1
            className='ml-[15px] text-[24px] font-bold text-[var(--text-color)]'

          >
            LexAyudha
          </h1>
        </div>

        {/* Lesson Title */}
        <h2
          className='text-[24px] flex justify-center font-bold text-[var(--text-color)] mb-[40px]'

        >
          {selectedLesson?.name || 'Untitled Lesson'}
        </h2>

        {/* Content */}
        <div className="content-container overflow-y-auto">
          {selectedLesson?.chapters?.map((sentence, index) => (
            <p
              key={index}
              className={`sentence ${chromTheme}`}
              style={{
                marginBottom: '15px',
                padding: '12px 18px',
                fontSize: `${Number(fontSize) || 16}px`,
                lineHeight: '1.6',

              }}
              data-attribute="chromatic"
            >
              {sentence}
            </p>
          ))}
        </div>
      </div>

      {/* Generate PDF Button */}
      <div className='h-screen flex flex-col space-y-4 items-center justify-center pl-10'>
        <button
          onClick={generatePDF}
          style={{
            padding: '12px 24px',
            backgroundColor: '#1574F9',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: '500',
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#0d5cbf';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#1574F9';
          }}
        >
          Download PDF
        </button>
        <button
          onClick={closePreview}
          style={{
            padding: '12px 24px',
            backgroundColor: '#1574F9',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: '500',
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#0d5cbf';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#1574F9';
          }}
        >
          Close Preview
        </button>
      </div>

    </div>
  );
};

export default DysLexiaPracticePDFDoc;