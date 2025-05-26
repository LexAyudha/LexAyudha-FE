// Customizable lesson dashboard
import React, { useEffect, useState } from 'react'
import axiosInstance from '../api/axiosInstance';
import chromaticThemes from '../configs/chromaticThemes';

export default function DashCustLessons() {

  const colors = chromaticThemes?.colors
  const [lessonData, setLessonData] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(lessonData[0]);
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [selectedColPattern, setSelectedColPattern] = useState(colors[0]?.chromThemeColor_1);
  const [selectedColorThemeName, setSelectedColorThemeName] = useState('chromThemeColor_1');
  const [selectedChromatic, setSelectedChromatic] = useState(selectedLesson?.chromaticTheme);
  const [editMode, setEditMode] = useState(false);
  const [editingSentenceIndex, setEditingSentenceIndex] = useState(null);
  const [editedSentence, setEditedSentence] = useState('');
  const [newLessonMode, setNewLessonMode] = useState(false)
  const [newLesson, setNewLesson] = useState({
   
    name: '',
    complexity: 2,
    description: '',
    example: '',
    points:0,
    chromaticTheme: 'chromTheme_1',
    colorTheme: 'chromThemeColor_1',
    chapters: []
  });
  const [newSentence, setNewSentence] = useState('');


  useEffect(() => {

    getLessonsList();

    // Small delay to ensure DOM content is rendered
    const timer = setTimeout(() => {
      applyChromaticThemes();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    applyChromaticThemes();
  }, [selectedChromatic]);

  /*API call functions
  API call to get Lessons list */
  const getLessonsList = async () => {
    try {
      const res = await axiosInstance.get('/user/lessons');
      if (res.status === 200) {
        setLessonData(res?.data);
      }
    } catch (error) {
      console.error('Error fetching lessons:', error);
    }
  }
  //API call to save updated lesson
  const handleSaveLesson = async () => {
    // Here you would make your API call to save all changes
    const payload = {

   
      name: selectedLesson.name,
      complexity: selectedLesson.complexity,
      description: selectedLesson.description,
      example: selectedLesson.example,

      chromaticTheme: selectedChromatic,
      colorTheme: selectedColorThemeName,
      chapters: selectedLesson.chapters
    }

    try {
      const res = await axiosInstance.put(`/user/lessons/${selectedLesson._id}`, payload);
      if (res.status === 200) {

        setLessonData(prevLessons => prevLessons.map(lesson => lesson._id === selectedLesson._id ? { ...lesson, ...payload } : lesson));
        setEditMode(false);
      }
    } catch (error) {
      console.error('Error saving lesson:', error);
    }


  };

  //API call to save new lesson
  const handleSaveNewLesson = async () => {

    const payload = {
     
      name: newLesson.name,
      complexity: newLesson.complexity,
      description: newLesson.description,
      example: newLesson.example,
      chromaticTheme: selectedChromatic,
      colorTheme: selectedColorThemeName,
      chapters: newLesson.chapters
    }

    try {
      const res = await axiosInstance.post('/user/lessons', payload);
      if (res.status === 201) {
        setLessonData(prevLessons => [...prevLessons, payload]);
        setNewLessonMode(false);
        setSelectedLesson(lessonData[lessonData?.length])
        setNewLesson({
          
          name: '',
          complexity: 2,
          description: '',
          example: '',
          chromaticTheme: 'chromTheme_1',
          colorTheme: 'chromThemeColor_1',
          chapters: []
        });
      }
    } catch (error) {
      console.error('Error saving new lesson:', error);
    }
  }

  //Helper functions 
  const handleEditToggle = () => {
    if (newLessonMode) {
      setNewLessonMode(false);
    }
    setEditMode(!editMode);
  };

  const handleLessonNameChange = (e) => {
    const updatedLesson = { ...selectedLesson, name: e.target.value };
    setSelectedLesson(updatedLesson);
  }

  const handleNewLessonNameChange = (e) => {
    const updatedLesson = { ...newLesson, name: e.target.value };
    setNewLesson(updatedLesson);
  }

  const handleLessonComplexityChange = (e) => {
    const updatedLesson = { ...selectedLesson, complexity: e.target.value };
    setSelectedLesson(updatedLesson);
  }

  const handleNewLessonComplexityChange = (e) => {
    const updatedLesson = { ...newLesson, complexity: e.target.value };
    setNewLesson(updatedLesson);
  }

  const handleEditSentence = (index, sentence) => {
    setEditingSentenceIndex(index);
    setEditedSentence(sentence);
  };

  const handleSaveSentence = (index) => {
    if (editedSentence.trim()) {
      const updatedChapters = [...selectedLesson.chapters];
      updatedChapters[index] = editedSentence;

      setSelectedLesson({
        ...selectedLesson,
        chapters: updatedChapters
      });

      setEditingSentenceIndex(null);
      setEditedSentence('');
    }
  };

  const handleDeleteSentence = (index) => {
    const updatedChapters = selectedLesson.chapters.filter((_, i) => i !== index);
    setSelectedLesson({
      ...selectedLesson,
      chapters: updatedChapters
    });
  };

  const handleDeleteNewSentence = (index) => {
    const updatedChapters = newLesson.chapters.filter((_, i) => i !== index);
    setNewLesson({
      ...newLesson,
      chapters: updatedChapters
    });
  };

  const handleExitOnEditMode = () => {
    setEditMode(false);
    setSelectedLesson(lessonList[0]);
  }

  const handleExitOnNewLessonMode = () => {
    setNewLessonMode(false);
    setNewLesson({
     
      name: '',
      complexity: 2,
      description: '',
      example: '',
      chromaticTheme: 'chromTheme_1',
      colorTheme: 'chromThemeColor_1',
      chapters: []
    })
    setSelectedLesson(lessonList[0]);

  }

  const handleLessonClick = (index) => {
    setSelectedLesson(lessonData[index]);
  }

  const handleNewLessonClick = () => {
    setEditMode(false);
    setNewLessonMode(true);
    setSelectedLesson(null);
  }

  // Function to apply chromatic themes
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
        } else {


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




  return (
    <div className='flex h-full space-x-[10px] justify-center items-center '>
      <div className=' px-[14px] pb-[8px] w-1/3 h-full bg-white rounded-[4px] shadow-[inset_0_0_2.5px_0px_rgba(0,0,0,0.2)]'>
        <h3 className='mb-[16px]'>My Lessons</h3>
        {lessonData.length === 0 ? (
          <div className='px-[16px] h-[450px] overflow-y-auto py-[12px] rounded-[4px] primary-color-bg shadow-[0_0_2.5px_0px_rgba(0,0,0,0.2)]'>
            <h4 className='text-lg m-0 py-[8px] cursor-pointer text-[var(--slate-gray)] '>No lessons available</h4>
            <h5 className='text-sm m-0 py-[8px] cursor-pointer text-[var(--slate-gray)] '>Click "Add New Lesson" to create one.</h5>
          </div>
        ) : (
          <div className='px-[16px] h-[450px] overflow-y-auto py-[12px] rounded-[4px] primary-color-bg shadow-[0_0_2.5px_0px_rgba(0,0,0,0.2)]'>
            {lessonData.map((lesson, index) => (
              <div key={index} onClick={() => handleLessonClick(index)} className={`flex border-b-2 items-center justify-center hover:bg-gray-200 ${selectedLesson?._id == lesson?._id ? 'bg-gray-200' : ''}`}>
                <h4 className='text-lg m-0 py-[8px] cursor-pointer text-[var(--slate-gray)] '>{lesson?.name}</h4>
              </div>
            ))}
          </div>
        )}

        <div className='h-fit py-[20px] flex justify-center items-center'>
          <button onClick={handleNewLessonClick} className=' text-white bg-[#1574F9] hover:bg-[#3E91F6] transition-all duration-300 rounded-[6px] px-[10px] py-[6px] text-sm'>Add New Lesson</button>
        </div>

      </div>
      <div className='px-[14px] pb-[8px] w-full h-full bg-white rounded-[4px] shadow-[inset_0_0_2.5px_0px_rgba(0,0,0,0.2)]'>
        <h3 className='mb-[16px]'>Lesson Dashboard</h3>
        { !selectedLesson ? (
          <div className=' w-full h-full flex justify-center items-center'>
            {/* Title div */}
            <div className='flex justify-between items-center '>
              <h4 className='text-lg m-0 py-[8px] cursor-pointer text-[var(--slate-gray)] '>Please select a lesson to preview</h4>
            </div>
          </div>
        ):(
           lessonData?.length == 0 && !newLessonMode ? (
          <div className=' w-full h-full flex justify-center items-center'>
            {/* Title div */}
            <div className='flex justify-between items-center '>
              <h4 className='text-lg m-0 py-[8px] cursor-pointer text-[var(--slate-gray)] '>No lessons available to preview</h4>
            </div>
          </div>
        ) : (

          <div className=' w-full'>
            {/* Title div */}
            <div className='flex justify-between items-center p-[8px] primary-color-bg shadow-[0_0_2.5px_0px_rgba(0,0,0,0.2)]'>
              <div className='flex items-center'>
                <p className='m-0 mr-2'>Title : </p>
                {newLessonMode ? (
                  <input type='text' className='border-2 border-gray-200 px-[8px] rounded-md' placeholder='Lesson title' onChange={handleNewLessonNameChange} value={newLesson?.name}></input>
                ) : editMode ? (
                  <input type='text' className='border-2 border-gray-200 px-[8px] rounded-md' placeholder={selectedLesson?.name} onChange={handleLessonNameChange} value={selectedLesson?.name}></input>
                ) : (
                  <div>
                    <p className='m-0 text-[var(--slate-gray)]'>{selectedLesson?.name}</p>
                  </div>
                )
                }
              </div>
              <div className='flex items-center ml-[20px]'>
                <p className='m-0 mr-2'>Complexity : </p>
                {newLessonMode ? (
                  <input type='number' max={20} min={2} className='border-2 border-gray-200 px-[8px] rounded-md' placeholder={newLesson?.complexity} onChange={handleNewLessonComplexityChange} value={newLesson?.complexity}></input>
                ) : editMode ? (
                  <input type='number' max={20} min={2} className='border-2 border-gray-200 px-[8px] rounded-md' placeholder={selectedLesson?.complexity} onChange={handleLessonComplexityChange} value={selectedLesson?.complexity}></input>
                ) : (
                  <div>
                    <p className='m-0 text-[var(--slate-gray)]'>{selectedLesson?.complexity}</p>
                  </div>
                )
                }
              </div>

            </div>

            {/* Add new sentence for edit mode */}
            {editMode && (
              <div className='flex mt-[12px] justify-between items-center px-[8px] py-[4px] primary-color-bg shadow-[0_0_2.5px_0px_rgba(0,0,0,0.2)]'>
                <p className='m-0 mr-2 text-nowrap'>Add new sentence : </p>
                <input type='text' className='border-2 w-full border-gray-200 h-full px-[8px] rounded-md py-[6px]' placeholder='Type here...' value={editedSentence} onChange={(e) => setEditedSentence(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && editedSentence.trim()) {
                      setSelectedLesson({
                        ...selectedLesson,
                        chapters: [...selectedLesson.chapters, editedSentence]
                      });
                      setEditedSentence('');
                    }
                  }}></input>
                <button onClick={() => {
                  if (editedSentence.trim()) {
                    setSelectedLesson({
                      ...selectedLesson,
                      chapters: [...selectedLesson.chapters, editedSentence]
                    });
                    setEditedSentence('');
                  }
                }} className=' text-white bg-[#1574F9] hover:bg-[#3E91F6] transition-all duration-300 rounded-[6px] px-[10px] py-[6px] ml-[2px]  text-sm'>Add</button>
              </div>
            )}
            {newLessonMode && (
              <div className='flex mt-[12px] justify-between items-center px-[8px] py-[4px] primary-color-bg shadow-[0_0_2.5px_0px_rgba(0,0,0,0.2)]'>
                <p className='m-0 mr-2 text-nowrap'>Add new sentence : </p>
                <input type='text' className='border-2 w-full border-gray-200 h-full px-[8px] rounded-md py-[6px]' placeholder='Type here...' value={newSentence} onChange={(e) => setNewSentence(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newSentence.trim()) {
                      setNewLesson({
                        ...newLesson,
                        chapters: [...newLesson.chapters, newSentence]
                      });
                      setNewSentence('');
                    }
                  }}></input>
                <button onClick={() => {
                  if (newSentence.trim()) {
                    setNewLesson({
                      ...newLesson,
                      chapters: [...newLesson.chapters, newSentence]
                    });
                    setNewSentence('');
                  }
                }} className=' text-white bg-[#1574F9] hover:bg-[#3E91F6] transition-all duration-300 rounded-[6px] px-[10px] py-[6px] ml-[2px]  text-sm'>Add</button>
              </div>
            )}
            {/* Content div */}
            <div className='flex flex-col my-[12px] justify-center items-center p-[8px] primary-color-bg shadow-[0_0_2.5px_0px_rgba(0,0,0,0.2)]'>
              <p className='m-0 mr-2 mb-2 px-[4px] w-full text-start'>Content </p>
              <div className='w-full h-fit bg-white rounded-[4px] shadow-[inset_0_0_2.5px_0px_rgba(0,0,0,0.2)] p-[8px]'>
                <div className='h-[250px] px-[1px] overflow-y-auto'>
                  {newLessonMode ? (

                    newLesson?.chapters.map((sentence, index) => (
                      <div key={index} className='flex primary-color-bg px-[4px] py-[4px] my-[4px] shadow-[0_0_2.5px_0px_rgba(0,0,0,0.2)] w-[99%] items-center justify-center'>
                        <div className='flex justify-between w-full items-center pr-[8px]'>
                          <input
                            className='text-lg pl-[8px] w-full m-0 text-start cursor-pointer text-[var(--slate-gray)]'
                            value={sentence}
                            readOnly

                          />

                          <div className='ml-[8px] flex justify-center w-fit'>

                            <i
                              className="fa-solid fa-trash-can text-[var(--red)] hover:text-red-500 cursor-pointer ml-[10px]"
                              onClick={() => handleDeleteNewSentence(index)}
                            ></i>
                          </div>
                        </div>

                      </div>
                    ))
                  ) : (selectedLesson?.chapters.map((sentence, index) => (
                    <div key={index} className='flex primary-color-bg px-[4px] py-[4px] my-[4px] shadow-[0_0_2.5px_0px_rgba(0,0,0,0.2)] w-[99%] items-center justify-center'>
                      {editMode ? (
                        <div className='flex justify-between w-full items-center pr-[8px]'>
                          {editingSentenceIndex === index ? (
                            <input
                              className='text-lg pl-[8px] bg-blue-100 w-full m-0 text-start cursor-pointer text-[var(--slate-gray)]'
                              value={editedSentence}
                              onChange={(e) => setEditedSentence(e.target.value)}
                              onBlur={() => handleSaveSentence(index)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSaveSentence(index)}
                              autoFocus
                            />
                          ) : (
                            <input
                              className='text-lg pl-[8px] w-full m-0 text-start cursor-pointer text-[var(--slate-gray)]'
                              value={sentence}
                              readOnly

                            />
                          )}
                          <div className='ml-[8px] flex justify-center w-fit'>
                            {editingSentenceIndex === index ? (
                              <i
                                className="fa-solid fa-check text-[var(--blue)] hover:text-blue-500 cursor-pointer"
                                onClick={() => handleSaveSentence(index)}
                              ></i>
                            ) : (
                              <i
                                className="fa-solid fa-pen-to-square text-[var(--blue)] hover:text-blue-500 cursor-pointer"
                                onClick={() => handleEditSentence(index, sentence)}
                              ></i>
                            )}
                            <i
                              className="fa-solid fa-trash-can text-[var(--red)] hover:text-red-500 cursor-pointer ml-[10px]"
                              onClick={() => handleDeleteSentence(index)}
                            ></i>
                          </div>
                        </div>
                      ) : (

                        <p className='text-lg pl-[8px] w-full m-0 text-start cursor-pointer text-[var(--slate-gray)]'>{sentence}</p>
                      )}

                    </div>
                  )
                  )
                  )}

                </div>

              </div>
            </div>
            {/* Chromatic Theme div */}
            <div className='flex p-[8px] justify-between items-center primary-color-bg shadow-[0_0_2.5px_0px_rgba(0,0,0,0.2)]'>
              <div className='flex items-center'>
                <p className='m-0 mr-2'>Chromatic Theme : </p>
                <div className='flex items-center'>
                  <div className="relative">
                    <button
                      onClick={() => setShowThemeDropdown(!showThemeDropdown)}
                      className="px-[8px] py-[4px] bg-white border-[2px] border-gray-200 rounded-md flex items-center gap-2"
                    >
                      <p
                        className={`${selectedChromatic} m-0`}
                        data-attribute="chromatic"
                      >
                        {chromaticThemes.chromaticClasses.find(theme => theme[1] === selectedChromatic)?.[0]}
                      </p>
                      <i className="fas fa-chevron-down"></i>
                    </button>

                    {showThemeDropdown && (
                      <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[200px]">
                        {chromaticThemes.chromaticClasses.map((theme, index) => (
                          <div
                            key={index}
                            className="p-[8px] hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setSelectedChromatic(theme[1]);
                              setShowThemeDropdown(false);
                              setTimeout(() => {
                                applyChromaticThemes();
                              }, 100);
                            }}
                          >
                            <p
                              className={`${theme[1]} m-0`}
                              data-attribute="chromatic"
                            >
                              {theme[0]}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className='flex items-center'>
                <p className='m-0 mr-2'>Theme Colors : </p>
                <div className="relative">
                  <button
                    onClick={() => setShowColorDropdown(!showColorDropdown)}
                    className="px-[8px] py-[4px] bg-white border-[2px] border-gray-200 rounded-md flex items-center gap-2"
                  >
                    <div className="flex items-center gap-2">
                      {selectedColPattern?.map((color, idx) => (
                        <div
                          key={idx}
                          className="w-[20px] h-[20px] rounded-md"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <i className="fas fa-chevron-down"></i>
                  </button>

                  {showColorDropdown && (
                    <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                      {colors.map((theme, index) => (
                        <div
                          key={index}
                          className="p-[4px] border-b-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                          onClick={() => {
                            setSelectedColPattern(theme[`chromThemeColor_${index + 1}`]);
                            setSelectedColorThemeName(`chromThemeColor_${index + 1}`);
                            setShowColorDropdown(false);
                          }}
                        >
                          {theme[`chromThemeColor_${index + 1}`].map((color, idx) => (
                            <div
                              key={idx}
                              className="w-[20px] h-[20px] rounded-md"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Edit lesson btn */}
            <div className='h-fit py-[20px] flex justify-center items-center'>
              {newLessonMode ? (

                <div className='flex space-x-[10px]'>
                  <button onClick={handleSaveNewLesson} className=' text-white bg-[#1574F9] hover:bg-[#3E91F6] transition-all duration-300 rounded-[6px] px-[10px] py-[6px] text-sm'>Save New Lesson</button>
                  <button onClick={handleExitOnNewLessonMode} className=' text-white bg-red-500 hover:bg-red-400 transition-all duration-300 rounded-[6px] px-[10px] py-[6px] text-sm'>Cancel</button>
                </div>
              ) : editMode ? (
                <div className='flex space-x-[10px]'>
                  <button onClick={handleSaveLesson} className=' text-white bg-[#1574F9] hover:bg-[#3E91F6] transition-all duration-300 rounded-[6px] px-[10px] py-[6px] text-sm'>Save Lesson</button>
                  <button onClick={handleExitOnEditMode} className=' text-white bg-red-500 hover:bg-red-400 transition-all duration-300 rounded-[6px] px-[10px] py-[6px] text-sm'>Cancel</button>
                </div>

              ) : (
                <button onClick={handleEditToggle} className=' text-white bg-[#1574F9] hover:bg-[#3E91F6] transition-all duration-300 rounded-[6px] px-[10px] py-[6px] text-sm'>Edit Lesson</button>
              )}


            </div>
          </div>
        )
        )}


      </div>
    </div>
  )
}