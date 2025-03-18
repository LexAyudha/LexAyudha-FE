import React, { useState, useEffect } from "react";
import Swal from "sweetalert2"; // Import SweetAlert
import { useNavigate, useParams } from "react-router-dom";
import ChangeThemeFB from "../../changeThemeFB";
import EmotionDetectionButton from "../../EmotionDetectionButton";

import {
  FaApple,
  FaCarrot,
  FaFish,
  FaLemon,
  FaBreadSlice,
  FaCheese,
  FaIceCream,
  FaDrumstickBite,
  FaEgg,
} from "react-icons/fa";

const Number0 = () => {
  const navigate = useNavigate();
  const { id } = useParams(); //Getting number ID as a param
  const [numberId, setNumberId] = useState(0);
  const [touchPoints, setTouchPoints] = useState([]);
  const [isAppear, setIsAppear] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(0);
  const [emotionCategory, setEmotionCategory] = useState("");

  // Correct pattern for the single touch point
  const correctPattern = [
    [true], // 0
    [true], // 1
    [true, true], // 2
    [true, true, true], // 3
    [true, true, true, true], // 4
    [true, true, true, true, true], // 5
    [true, true, true, true, true, true], // 6
    [true, true, true, true, true, true, true], // 7
    [true, true, true, true, true, true, true, true], // 8
    [true, true, true, true, true, true, true, true, true], // 9
  ];

  const handleTouch = (index) => {
    const updatedPoints = [...touchPoints];
    updatedPoints[index] = !updatedPoints[index];
    setTouchPoints(updatedPoints);
  };

  useEffect(() => {
    setNumberId(id || 0);
    setTouchPoints(new Array(correctPattern[id]?.length || 0).fill(false));
    const randomIconNumber = Math.floor(Math.random() * 9);
    setSelectedIcon(randomIconNumber);
    setEmotionCategory("frustrated");
  }, [id]);

  const handleNext = () => {
    setIsAppear(false);
    if (numberId < 9) {
      navigate(`/touch-math/quiz_number/${parseInt(numberId) + 1}`);
    }
  };
  const handleFinish = () => {
    navigate(`/dyscalculic-training`);
  };

  //Moved success msg firing to a separate function here.
  const firePopup = (text = null, isSucces) => {
    if (isSucces) {
      Swal.fire({
        title: "Well done!",
        text: text,
        icon: "success",
        confirmButtonText: "Great!",
      });
    } else {
      Swal.fire({
        title: "Try again!",
        text: "Some points are missing.",
        icon: "error",
        confirmButtonText: "Retry",
      });
    }
  };
  const checkCorrectnessMulti = (text) => {
    if (
      JSON.stringify(touchPoints) === JSON.stringify(correctPattern[numberId])
    ) {
      firePopup(text, true);
    } else {
      firePopup(false);
    }
  };
  const checkProgress = () => {
    switch (numberId) {
      case "0":
        firePopup("There are no touch points to mark for 0!", true);
        break;
      default:
        checkCorrectnessMulti("You marked all the correct touch points.");
        break;
    }
  };

  const handleExit = () => {
    navigate("/dyscalculic-training");
  };

  const handleModalAction = (shouldAppear) => {
    setIsAppear(shouldAppear); // Update the `isAppear` state based on the modal response
  };
  // const IconComponent = selectedIcon ? selectedIcon : FaCarrot;

  const svgSnippets = {
    0: (
      <svg width="800" height="500" viewBox="0 0 200 200">
        <text
          x="47"
          y="170"
          fontSize="200"
          fontFamily="Arial"
          fill="currentColor"
        >
          0
        </text>
      </svg>
    ),
    1: (
      <svg width="800" height="500" viewBox="0 0 200 200">
        {/* Number "1" */}
        <text
          x="35"
          y="150"
          fontSize="200"
          fontFamily="Arial"
          fill="currentColor"
        >
          1
        </text>
        {/* Single Touch Point on the number "1" */}
        {touchPoints.map((active, index) => (
          <circle
            key={index}
            cx={102} // Position the touch point in the center of the number
            cy={18} // Adjust to align with "1"
            r={14} // Radius of the touch point
            className={`cursor-pointer transition-colors duration-200 ${
              active ? "fill-yellow-400" : "fill-current"
            }`}
            onClick={() => handleTouch(index)}
          />
        ))}
      </svg>
    ),

    2: (
      <svg width="800" height="500" viewBox="0 0 200 200">
        {/* Number "2" */}
        <text
          x="35"
          y="150"
          fontSize="200"
          fontFamily="Arial"
          fill="var(--text-color)"
        >
          2
        </text>
        {/* 2 Touch Points on the number "2" */}
        {touchPoints.map((active, index) => (
          <circle
            key={index}
            cx={
              index === 0
                ? 54.5 // Top curve of 2
                : 126 // Bottom line of 2
            }
            cy={
              index === 0
                ? 38 // Top curve
                : 140 // Bottom curve
            }
            r={14} // Radius of the touch point
            fill={active ? "#FFD700" : "var(--text-color)"} // Golden when active
            onClick={() => handleTouch(index)}
          />
        ))}
      </svg>
    ),
    3: (
      <svg width="800" height="500" viewBox="0 0 200 200">
        {/* Number "3" */}
        <text
          x="35"
          y="150"
          fontSize="200"
          fontFamily="Arial"
          fill="var(--text-color)"
        >
          3
        </text>
        {/* 3 Touch Points on the number "3" */}
        {touchPoints.map((active, index) => (
          <circle
            key={index}
            cx={
              index === 0
                ? 55 // Top curve of 3
                : index === 1
                ? 90 // Middle curve
                : 55 // Bottom curve of 3
            }
            cy={
              index === 0
                ? 40 // Top curve
                : index === 1
                ? 75 // Middle curve
                : 120 // Bottom curve
            }
            r={14} // Radius of the touch point
            fill={active ? "#FFD700" : "var(--text-color)"} // Golden when active
            onClick={() => handleTouch(index)}
          />
        ))}
      </svg>
    ),
    4: (
      <svg width="800" height="500" viewBox="0 0 200 200">
        {/* Number "4" */}
        <text
          x="35"
          y="150"
          fontSize="200"
          fontFamily="Arial"
          fill="var(--text-color)"
        >
          4
        </text>
        {/* 4 Touch Points on the number "4" */}
        {touchPoints.map((active, index) => (
          <circle
            key={index}
            cx={
              index === 0
                ? 108.5 // Top left vertical line of 4
                : index === 1
                ? 108.5 // Top right horizontal line of 4
                : index === 2
                ? 46.5 // Middle left vertical line of 4
                : 108.5 // Bottom right of 4
            }
            cy={
              index === 0
                ? 18 // Top vertical line
                : index === 1
                ? 107 // Top horizontal line
                : index === 2
                ? 105 // Bottom vertical line
                : 139 // Bottom horizontal line
            }
            r={14} // Radius of the touch point
            fill={active ? "#FFD700" : "var(--text-color)"} // Golden when active
            onClick={() => handleTouch(index)}
          />
        ))}
      </svg>
    ),
    5: (
      <svg width="800" height="500" viewBox="0 0 200 200">
        {/* Number "5" */}
        <text
          x="50"
          y="150"
          fontSize="200"
          fontFamily="Arial"
          fill="var(--text-color)"
        >
          5
        </text>
        {/* 5 Touch Points on the number "5" */}
        {touchPoints.map((active, index) => (
          <circle
            key={index}
            cx={
              index === 0
                ? 142 // First touch point (top curve)
                : index === 1
                ? 83 // Second touch point (upper middle line)
                : index === 2
                ? 71 // Third touch point (middle curve)
                : index === 3
                ? 143 // Fourth touch point (lower line)
                : 68 // Fifth touch point (bottom curve)
            }
            cy={
              index === 0
                ? 17 // Adjust the y-coordinate for the top curve
                : index === 1
                ? 17 // Upper middle line
                : index === 2
                ? 75 // Middle curve
                : index === 3
                ? 105 // Lower line
                : 119 // Bottom curve
            }
            r="12"
            fill={active ? "#FFD700" : "var(--text-color)"}
            onClick={() => handleTouch(index)}
          />
        ))}
      </svg>
    ),
    6: (
      <svg width="800" height="500" viewBox="0 0 200 200">
        {/* Number "6" */}
        <text
          x="35"
          y="150"
          fontSize="200"
          fontFamily="Arial"
          fill="var(--text-color)"
        >
          6
        </text>
        {/* 5 Touch Points on the number "6" */}
        {touchPoints.map((active, index) => (
          <circle
            key={index}
            cx={
              index === 0
                ? 125
                : index === 1
                ? 53
                : index === 2
                ? 92
                : index === 3
                ? 125
                : index === 4
                ? 53
                : 92
            }
            cy={
              index === 0
                ? 33
                : index === 1
                ? 90
                : index === 2
                ? 144
                : index === 3
                ? 33
                : index === 4
                ? 90
                : 144
            }
            r={
              index < 3 ? 13 : 8 // 4 points with radius 13, 3 points with radius 9
            }
            fill={
              index < 3
                ? active
                  ? "#FFD700"
                  : "var(--text-color)"
                : active
                ? "red"
                : "var(--text-color)" // Different colors for two point types #FFD700 #008000
            }
            onClick={() => handleTouch(index)}
          />
        ))}
      </svg>
    ),
    7: (
      <svg width="800" height="500" viewBox="0 0 200 200">
        {/* Number "7" */}
        <text
          x="50"
          y="150"
          fontSize="200"
          fontFamily="Arial"
          fill="var(--text-color)"
        >
          7
        </text>
        {/* 7 Touch Points on the number "7" */}
        {touchPoints.map((active, index) => (
          <circle
            key={index}
            cx={
              index === 0
                ? 69 // First touch point (top line)
                : index === 1
                ? 142 // Second touch point (top line middle)
                : index === 2
                ? 89 // Third touch point (top line left)
                : index === 3
                ? 107 // Fourth touch point (middle line right)
                : index === 4
                ? 107 // Fifth touch point (middle line left)
                : index === 5
                ? 142 // Sixth touch point (bottom line left)
                : 89 // Seventh touch point (bottom line)
            }
            cy={
              index === 0
                ? 17 // Top right corner
                : index === 1
                ? 17 // Top line middle
                : index === 2
                ? 141 // Top line left
                : index === 3
                ? 76 // Middle line right
                : index === 4
                ? 76 // Middle line left
                : index === 5
                ? 17 // Bottom left
                : 141 // Bottom right
            }
            r={
              index < 4 ? 13 : 8 // 4 points with radius 13, 3 points with radius 9
            }
            fill={
              index < 4
                ? active
                  ? "#FFD700"
                  : "var(--text-color)"
                : active
                ? "red"
                : "var(--text-color)" // Different colors for two point types #FFD700 #008000
            }
            onClick={() => handleTouch(index)}
          />
        ))}
      </svg>
    ),
    8: (
      <svg width="800" height="500" viewBox="0 0 200 200">
        {/* Number "8" */}
        <text
          x="50"
          y="150"
          fontSize="200"
          fontFamily="Arial"
          fill="var(--text-color)"
        >
          8
        </text>
        {/* 7 Touch Points on the number "8" */}
        {touchPoints.map((active, index) => (
          <circle
            key={index}
            cx={
              index === 0
                ? 73 // First touch point (top line)
                : index === 1
                ? 135 // Second touch point (top line middle)
                : index === 2
                ? 67 // Third touch point (top line left)
                : index === 3
                ? 142 // Fourth touch point (middle line right)
                : index === 4
                ? 73 // Fifth touch point (middle line left)
                : index === 5
                ? 135 // Sixth touch point (bottom line left)
                : index === 6
                ? 67
                : 142 // Seventh touch point (bottom line)
            }
            cy={
              index === 0
                ? 40 // Top right corner
                : index === 1
                ? 40 // Top line middle
                : index === 2
                ? 110 // Top line left
                : index === 3
                ? 110 // Middle line right
                : index === 4
                ? 40 // Middle line left
                : index === 5
                ? 40 // Bottom left
                : index === 6
                ? 110
                : 110 // Bottom right
            }
            r={
              index < 4 ? 13 : 8 // 4 points with radius 13, 3 points with radius 9
            }
            fill={
              index < 4
                ? active
                  ? "#FFD700"
                  : "var(--text-color)"
                : active
                ? "red"
                : "var(--text-color)" // Different colors for two point types #FFD700 #008000
            }
            onClick={() => handleTouch(index)}
          />
        ))}
      </svg>
    ),
    9: (
      <svg width="800" height="500" viewBox="0 0 200 200">
        {/* Number "9" */}
        <text
          x="50"
          y="150"
          fontSize="200"
          fontFamily="Arial"
          fill="var(--text-color)"
        >
          9
        </text>
        {/* 7 Touch Points on the number "9" */}
        {touchPoints.map((active, index) => (
          <circle
            key={index}
            cx={
              index === 0
                ? 70 // First touch point (top line)
                : index === 1
                ? 100 // Second touch point (top line middle)
                : index === 2
                ? 140 // Third touch point (top line left)
                : index === 3
                ? 136 // Fourth touch point (middle line right)
                : index === 4
                ? 70 // Fifth touch point (middle line left)
                : index === 5
                ? 100 // Sixth touch point (bottom line left)
                : index === 6
                ? 140
                : index === 7
                ? 70
                : 136 // Seventh touch point (bottom line)
            }
            cy={
              index === 0
                ? 70
                : index === 1
                ? 15
                : index === 2
                ? 50
                : index === 3
                ? 122
                : index === 4
                ? 125
                : index === 5
                ? 15
                : index === 6
                ? 50
                : index === 7
                ? 125
                : 122
            }
            r={
              index < 5 ? 13 : 8 // 4 points with radius 13, 3 points with radius 9
            }
            fill={
              index < 5
                ? active
                  ? "#FFD700"
                  : "var(--text-color)"
                : active
                ? "red"
                : "var(--text-color)" // Different colors for two point types #FFD700 #008000
            }
            onClick={() => handleTouch(index)}
          />
        ))}
      </svg>
    ),
    // Add other numbers here as needed
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <ChangeThemeFB />

      <div className="flex justify-center mt-5">
        <EmotionDetectionButton
          emotionCategory={emotionCategory}
          onModalAction={handleModalAction}
        />
      </div>
      <div className="flex w-full relative flex-col items-center justify-center">
        <div className="py-[20px]">
          <h2>
            {numberId == 0
              ? "There are no touchpoints for number 0"
              : `Mark the touchpoint for number ${numberId}`}
          </h2>
        </div>
        <div
          className={`${isAppear && numberId != 0 && "grid grid-cols-3 gap-4"}`}
        >
          <div className="col-span-2">{svgSnippets[numberId]}</div>

          {isAppear && (
            <div className="grid grid-cols-3 items-center gap-4 h-28 col-span-1 p-2 rounded">
              {Array.from({ length: numberId }).map((_, index) => {
                switch (selectedIcon) {
                  case 0:
                    return (
                      <FaCarrot
                        key={index}
                        className="text-orange-500 text-4xl"
                        color="orange"
                        size={100}
                      />
                    );
                  case 1:
                    return (
                      <FaApple
                        key={index}
                        className="text-red-500 text-4xl"
                        color="orange"
                        size={100}
                      />
                    );
                  case 2:
                    return (
                      <FaLemon
                        key={index}
                        className="text-yellow-500 text-4xl"
                        color="orange"
                        size={100}
                      />
                    );
                  case 3:
                    return (
                      <FaFish
                        key={index}
                        className="text-blue-500 text-4xl"
                        color="orange"
                        size={100}
                      />
                    );
                  case 4:
                    return (
                      <FaBreadSlice
                        key={index}
                        className="text-brown-500 text-4xl"
                        color="orange"
                        size={100}
                      />
                    );
                  case 5:
                    return (
                      <FaCheese
                        key={index}
                        className="text-yellow-600 text-4xl"
                        color="orange"
                        size={100}
                      />
                    );
                  case 6:
                    return (
                      <FaDrumstickBite
                        key={index}
                        className="text-red-700 text-4xl"
                        color="orange"
                        size={100}
                      />
                    );
                  case 7:
                    return (
                      <FaEgg
                        key={index}
                        className="text-gray-400 text-4xl"
                        color="orange"
                        size={100}
                      />
                    );
                  case 8:
                    return (
                      <FaIceCream
                        key={index}
                        className="text-pink-500 text-4xl"
                        color="orange"
                        size={100}
                      />
                    );
                  default:
                    return null; // If `selectedIcon` is out of range
                }
              })}
            </div>
          )}
        </div>

        {/* buttons */}
        <div className="mx-10 flex items-center justify-center">
          <button
            onClick={handleExit}
            className="check-answer-button absolute left-0"
          >
            Exit
          </button>

          <button onClick={checkProgress} className="check-answer-button">
            Check Answer
          </button>

          <button
            onClick={handleNext}
            className={`pnext-button ${numberId == 9 ? "hidden" : "block"}`}
          >
            Next
          </button>
          <button
            onClick={handleFinish}
            className={`pnext-button ${numberId == 9 ? "block" : "hidden"}`}
          >
            Finsih
          </button>
        </div>
      </div>
    </div>
  );
};

export default Number0;
