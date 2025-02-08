// Dynamically applying colorful text effects depending on the selected theme
import React, { useEffect, useRef } from 'react';

export default function ChromaticEffect({ themeName, themeColors, children }) {
  const elementRef = useRef(null);

  const applyChromatic = () => {
    if (!elementRef.current) return;

    const text = elementRef.current.textContent;
    let fragments;
    
    // Determine the splitting method based on theme
    switch(themeName) {
      case 'chromTheme_1':
        // Split by words, preserve whitespace
        fragments = text.split(/(\s+)/);
        break;
      case 'chromTheme_2':
        // Split by pair of characters
        fragments = text.match(/.{1,2}/gs) || [];
        break;
      case 'chromTheme_3':
        // Split by individual characters
        fragments = text.match(/./gs) || [];
        break;
      default:
        fragments = [text];
    }

    let colorIndex = 0;
    const newContent = fragments.map((fragment) => {
      // Skip applying colors to whitespace for word theme
      if (themeName === 'chromTheme_1' && fragment.trim() === '') {
        return fragment;
      }

      const color = themeColors ? 
        themeColors[colorIndex % themeColors.length] : 
        'var(--text-color)';
      
      colorIndex++;
      return `<span style="color: ${color};">${fragment}</span>`;
    }).join('');

    elementRef.current.innerHTML = newContent;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      applyChromatic();
    }, 100);
    return () => clearTimeout(timer);
  }, [themeName, themeColors]);

  return (
    <p ref={elementRef} className={themeName}>
      {children}
    </p>
  );
}