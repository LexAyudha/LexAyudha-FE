import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../../../assets/Styles.css"; 

// Import number images (replace with actual paths)
import number1Img from "../../../assets/1.png";
import number2Img from "../../../assets/2.png";
import number3Img from "../../../assets/3.png";
import number4Img from "../../../assets/4.png";
import number5Img from "../../../assets/5.png";
import number6Img from "../../../assets/6.png";
import number7Img from "../../../assets/7.png";
import number8Img from "../../../assets/8.png";
import number9Img from "../../../assets/9.png";
import AlternativeHeader from "../../alternativeHeader";
import ChangeThemeFB from "../../changeThemeFB";

export default function LearnNumberSense() {
  const navigate = useNavigate(); // Initialize navigate function

  // Define image sources and corresponding sizes
  const numberImages = [
    { src: number1Img, size: 30 },
    { src: number2Img, size: 55 },
    { src: number3Img, size: 80 },
    { src: number4Img, size: 105 },
    { src: number5Img, size: 130 },
    { src: number6Img, size: 155 },
    { src: number7Img, size: 180 },
    { src: number8Img, size: 205 },
    { src: number9Img, size: 230 },
  ];

  return (
    <div className="la-container h-screen flex items-center justify-center relative">
      <AlternativeHeader title="Number Sense"/>
      <ChangeThemeFB/>
      <div className="flex items-center justify-center w-full h-full flex-col">
      {/* Title */}
      <h2 className="title">Let's Learn Number Sense</h2>

      {/* Description */}
      <div className="description">
        <p>1. Here, the size of the number is shown in relation to the value of the number.</p>
        <p>2. You can get an idea about the number’s value.</p>
      </div>

      {/* Number Images */}
      <div className="number-display">
        {numberImages.map((num, index) => (
          <img
            key={index}
            src={num.src}
            alt={`Number ${index + 1}`}
            style={{ width: `${num.size}px`, height: "auto" }} // Scale width dynamically
            className="number-image"
          />
        ))}
      </div>

      {/* Close Button */}
      <button className="close-button" onClick={() => navigate(-1)}>Close</button>
    </div>
    </div>
    
  );
}
