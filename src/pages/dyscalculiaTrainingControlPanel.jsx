import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import for navigation
import "../assets/Styles.css";

// Import actual images (Replace these with correct image URLs)
import touchMathImg from "../assets/touchMath.png";
import numberSenseImg from "../assets/NumberSense.png";
import countingImg from "../assets/Bcounting.png";
import additionImg from "../assets/addition.png";
import subtractionImg from "../assets/Subtractions.png";

export default function LearningActivity() {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate(); // Hook for navigation

  const menuItemsRow1 = {
    "Touch Math": {
      image: touchMathImg,
      options: ["Learn", "Practice", "Quiz"],
      routes: ["/touch-math/teaching_number0", "/practice_number0", "/touch-math/quiz_number0"] // Routes for options
    },
    "Number Sense": {
      image: numberSenseImg,
      options: ["Learn", "Quiz"],
      routes: ["/touch-math/teaching-number-sense", "/touch-math/quiz-number-sense"]
    },
    "Backword Counting": {
      image: countingImg,
      options: ["Learn", "Practice", "Quiz"],
      routes: ["/teach_backward_counting", "/practice_backward_counting", "/quiz_backward_counting"]
    },
  };

  const menuItemsRow2 = {
    Addition: {
      image: additionImg,
      options: ["Learn", "Practice", "Quiz"],
      routes: ["/touch-math/teaching-addition", "/practice-addition", "/quiz_addition"]
    },
    Subtraction: {
      image: subtractionImg,
      options: ["Learn", "Practice", "Quiz"],
      routes: ["/teach_subtraction", "/practice-substraction", "/quiz_subtraction"]
    },
  };

  const handleOptionClick = (category, optionIndex) => {
    const route = menuItemsRow1[category]?.routes[optionIndex] || menuItemsRow2[category]?.routes[optionIndex];
    if (route) {
      navigate(route);
    }
  };

  return (
    <div className="full-screen">
      <h2 style={{ marginBottom: "60px" }}>Select Your Learning Activity</h2>

      {/* First row */}
      <div className="menu-container">
        {Object.keys(menuItemsRow1).map((category) => (
          <div key={category} className="menu-item">
            <button
              className={`menu-button ${selected === category ? "active" : ""}`}
              onClick={() => setSelected(selected === category ? null : category)}
            >
              {/* Text and arrow on the same line */}
              <div className="menu-header">
                <span className="menu-text">{category}</span>
                <span className="arrow">{selected === category ? "▲" : "▼"}</span>
              </div>

              <img src={menuItemsRow1[category].image} alt={category} className="menu-image" />
            </button>

            {/* Dropdown menu */}
            {selected === category && (
              <div className="dropdown">
                {menuItemsRow1[category].options.map((item, index) => (
                  <div
                    key={item}
                    className="dropdown-item"
                    onClick={() => handleOptionClick(category, index)}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Second row */}
      <div className="menu-container">
        {Object.keys(menuItemsRow2).map((category) => (
          <div key={category} className="menu-item">
            <button
              className={`menu-button ${selected === category ? "active" : ""}`}
              onClick={() => setSelected(selected === category ? null : category)}
            >
              {/* Text and arrow on the same line */}
              <div className="menu-header">
                <span className="menu-text">{category}</span>
                <span className="arrow">{selected === category ? "▲" : "▼"}</span>
              </div>

              <img src={menuItemsRow2[category].image} alt={category} className="menu-image" />
            </button>

            {/* Dropdown menu */}
            {selected === category && (
              <div className="dropdown">
                {menuItemsRow2[category].options.map((item, index) => (
                  <div
                    key={item}
                    className="dropdown-item"
                    onClick={() => handleOptionClick(category, index)}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
