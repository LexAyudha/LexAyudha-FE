// EmotionDetection.jsx
import { useEffect, useRef, useState, useCallback } from "react";
import { Modal, Button } from "antd";
import { useNavigate } from "react-router-dom";

const EmotionDetection = ({
  startDetection,
  onStopDetection,
  onEmotionData,
  onModalAction,
  disablePopup,
  number,
  studentId,
  activityId,
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const streamRef = useRef(null); // To hold the video stream
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAppear, setIsAppear] = useState(false);
  const intervalIdRef = useRef(null); // Ref to store interval ID
  const navigate = useNavigate();
  const [showVideo, setShowVideo] = useState(true);

  // Store the latest onEmotionData callback in a ref to avoid re-renders
  const onEmotionDataRef = useRef(onEmotionData);
  useEffect(() => {
    onEmotionDataRef.current = onEmotionData;
  }, [onEmotionData]);

  // Store the latest onModalAction callback in a ref
  const onModalActionRef = useRef(onModalAction);
  useEffect(() => {
    onModalActionRef.current = onModalAction;
  }, [onModalAction]);

  const handleOk = useCallback(() => {
    setIsModalVisible(false);
    setIsAppear(true);
    onModalActionRef.current?.(true);
    onStopDetection();
  }, []);

  const handleLearn = useCallback(() => {
    localStorage.setItem("selectedNumber", number);
    navigate("/touch-math/teaching_number/");
    onModalAction?.(true);
  }, [navigate]);

  const handleCancel = useCallback(() => {
    setIsModalVisible(false);
    onModalAction?.(false); // Prevent modal from appearing again
  }, [onModalAction]);

  // Process frame and send to API without causing re-renders
  const processFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || disablePopup) return;

    const context = canvasRef.current.getContext("2d");
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;

    context.drawImage(
      videoRef.current,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    canvasRef.current.toBlob((blob) => {
      if (!blob) return;
      const formData = new FormData();
      formData.append("file", blob, "frame.jpg");

      fetch("http://localhost:8005/emotion/predict", {
        method: "POST",
        body: formData,
        headers: {
          'Student-Id': studentId,
          'Activity-Id': activityId
        }
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Emotion Prediction:", data);
          // Pass the emotion data to the parent component
          if (onEmotionDataRef.current) {
            onEmotionDataRef.current(data);
          }
          const { engagement, distraction, frustration } =
            data?.prediction.percentages;
          console.log(engagement, distraction, frustration);
          if (distraction > 80 || engagement < 10 || frustration > 80) {
            setIsModalVisible(true);
          }
        })
        .catch((error) => console.error("Error sending frame:", error));
    }, "image/jpeg");
  }, [disablePopup, studentId, activityId]);

  useEffect(() => {
    const startVideoCapture = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        streamRef.current = stream; // Store the stream in the ref
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing webcam: ", err);
      }
    };

    const stopVideoCapture = () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };

    // Only start/stop based on startDetection prop
    if (startDetection) {
      startVideoCapture();
      intervalIdRef.current = setInterval(processFrame, 1000);
    } else {
      stopVideoCapture();
    }

    // Cleanup on unmount
    return stopVideoCapture;
  }, [startDetection, processFrame]);

  // Dragging functionality with useCallback to prevent re-renders
  const handleMouseDown = useCallback(() => setDragging(true), []);
  const handleMouseUp = useCallback(() => setDragging(false), []);

  const handleMouseMove = useCallback(
    (e) => {
      if (dragging) {
        setPosition({
          x: e.clientX - 50,
          y: e.clientY - 50,
        });
      }
    },
    [dragging]
  );

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        cursor: dragging ? "grabbing" : "grab",
        width: "fit-content",
      }}
    >
      {startDetection && (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            onMouseDown={handleMouseDown}
            style={{
              width: 300,
              borderRadius: 10,
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              display: showVideo ? "block" : "none",
            }}
          />
          <button
            onClick={() => setShowVideo((prev) => !prev)}
            style={{ marginTop: 10, marginRight: 10 }}
          >
            {showVideo ? "Hide Video" : "Show Video"}
          </button>
        </>
      )}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <Modal
        title="Oops! Feeling a bit stuck?"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <div
            key="footer-buttons"
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Button
              key="back"
              onClick={handleCancel}
              style={{
                backgroundColor: "#ff6347",
                color: "black",
                width: "30%",
              }}
            >
              Noo, I got this!
            </Button>
            <Button
              key="hint"
              type="primary"
              onClick={handleOk}
              style={{
                backgroundColor: "#90ee90",
                color: "black",
                width: "30%",
              }}
            >
              Give me a Hint! 😊
            </Button>
            <Button
              key="learn"
              type="primary"
              onClick={handleLearn}
              style={{
                backgroundColor: "#87ceeb",
                color: "black",
                width: "30%",
              }}
            >
              Let's Learn! 📚
            </Button>
          </div>,
        ]}
      >
        <p className="text-md">
          Looks like you're having a tough time! Don't worry, we can either give
          you a hint or jump into some cool learning! 😄
        </p>
      </Modal>
    </div>
  );
};

export default EmotionDetection;

// // EmotionDetection.jsx
// import { useEffect, useRef, useState, useCallback } from "react";
// import { Modal, Button } from "antd";
// import { useNavigate } from "react-router-dom";

// const EmotionDetection = ({
//   startDetection,
//   onStopDetection,
//   onEmotionData,
//   onModalAction,
//   disablePopup,
//   number,
// }) => {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const streamRef = useRef(null);
//   const intervalIdRef = useRef(null);
//   const onEmotionDataRef = useRef(onEmotionData);
//   const onModalActionRef = useRef(onModalAction);

//   const [dragging, setDragging] = useState(false);
//   const [position, setPosition] = useState({ x: 50, y: 50 });
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [isAppear, setIsAppear] = useState(false);
//   const [showVideo, setShowVideo] = useState(true);

//   const navigate = useNavigate();

//   // Keep callback refs up to date
//   useEffect(() => {
//     onEmotionDataRef.current = onEmotionData;
//   }, [onEmotionData]);

//   useEffect(() => {
//     onModalActionRef.current = onModalAction;
//   }, [onModalAction]);

//   const handleOk = useCallback(() => {
//     setIsModalVisible(false);
//     setIsAppear(true);
//     onModalActionRef.current?.(true);
//     onStopDetection();
//   }, []);

//   const handleLearn = useCallback(() => {
//     localStorage.setItem("selectedNumber", number);
//     navigate("/touch-math/teaching_number/");
//     onModalAction?.(true);
//   }, [navigate, number, onModalAction]);

//   const handleCancel = useCallback(() => {
//     setIsModalVisible(false);
//     onModalAction?.(false);
//   }, [onModalAction]);

//   const processFrame = useCallback(() => {
//     if (!videoRef.current || !canvasRef.current || disablePopup) return;

//     const context = canvasRef.current.getContext("2d");
//     canvasRef.current.width = videoRef.current.videoWidth;
//     canvasRef.current.height = videoRef.current.videoHeight;

//     context.drawImage(
//       videoRef.current,
//       0,
//       0,
//       canvasRef.current.width,
//       canvasRef.current.height
//     );

//     canvasRef.current.toBlob((blob) => {
//       if (!blob) return;
//       const formData = new FormData();
//       formData.append("file", blob, "frame.jpg");

//       fetch("http://localhost:8005/emotion/predict", {
//         method: "POST",
//         body: formData,
//       })
//         .then((response) => response.json())
//         .then((data) => {
//           console.log("Emotion Prediction:", data);
//           if (onEmotionDataRef.current) {
//             onEmotionDataRef.current(data);
//           }

//           const { engagement, distraction, frustration } =
//             data?.prediction?.percentages || {};
//           if (distraction > 80 || engagement < 10 || frustration > 80) {
//             setIsModalVisible(true);
//           }
//         })
//         .catch((error) => console.error("Error sending frame:", error));
//     }, "image/jpeg");
//   }, [disablePopup]);

//   useEffect(() => {
//     const startVideoCapture = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: true,
//         });
//         streamRef.current = stream;
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//         }
//       } catch (err) {
//         console.error("Error accessing webcam: ", err);
//       }
//     };

//     const stopVideoCapture = () => {
//       if (intervalIdRef.current) {
//         clearInterval(intervalIdRef.current);
//         intervalIdRef.current = null;
//       }

//       if (streamRef.current) {
//         streamRef.current.getTracks().forEach((track) => track.stop());
//         streamRef.current = null;
//       }
//     };

//     if (startDetection) {
//       startVideoCapture();
//       intervalIdRef.current = setInterval(processFrame, 5000);
//     } else {
//       stopVideoCapture();
//     }

//     return stopVideoCapture;
//   }, [startDetection, processFrame]);

//   // Global mouse listeners for dragging
//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       if (dragging) {
//         setPosition({
//           x: e.clientX - 50,
//           y: e.clientY - 50,
//         });
//       }
//     };

//     const handleMouseUp = () => {
//       if (dragging) {
//         setDragging(false);
//       }
//     };

//     window.addEventListener("mousemove", handleMouseMove);
//     window.addEventListener("mouseup", handleMouseUp);

//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("mouseup", handleMouseUp);
//     };
//   }, [dragging]);

//   return (
//     <div
//       style={{
//         position: "absolute",
//         top: position.y,
//         left: position.x,
//         cursor: dragging ? "grabbing" : "grab",
//         width: "fit-content",
//         zIndex: 1000,
//       }}
//     >
//       {startDetection && (
//         <>
//           <video
//             ref={videoRef}
//             autoPlay
//             playsInline
//             onMouseDown={() => setDragging(true)}
//             style={{
//               width: 300,
//               borderRadius: 10,
//               boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
//               display: showVideo ? "block" : "none",
//             }}
//           />
//           <button
//             onClick={() => setShowVideo((prev) => !prev)}
//             style={{ marginTop: 10, marginRight: 10 }}
//           >
//             {showVideo ? "Hide Video" : "Show Video"}
//           </button>
//         </>
//       )}
//       <canvas ref={canvasRef} style={{ display: "none" }} />

//       <Modal
//         title="Oops! Feeling a bit stuck?"
//         open={isModalVisible}
//         onOk={handleOk}
//         onCancel={handleCancel}
//         footer={[
//           <div
//             key="footer-buttons"
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               width: "100%",
//             }}
//           >
//             <Button
//               key="back"
//               onClick={handleCancel}
//               style={{
//                 backgroundColor: "#ff6347",
//                 color: "black",
//                 width: "30%",
//               }}
//             >
//               Noo, I got this!
//             </Button>
//             <Button
//               key="hint"
//               type="primary"
//               onClick={handleOk}
//               style={{
//                 backgroundColor: "#90ee90",
//                 color: "black",
//                 width: "30%",
//               }}
//             >
//               Give me a Hint! 😊
//             </Button>
//             <Button
//               key="learn"
//               type="primary"
//               onClick={handleLearn}
//               style={{
//                 backgroundColor: "#87ceeb",
//                 color: "black",
//                 width: "30%",
//               }}
//             >
//               Let's Learn! 📚
//             </Button>
//           </div>,
//         ]}
//       >
//         <p className="text-md">
//           Looks like you're having a tough time! Don't worry, we can either give
//           you a hint or jump into some cool learning! 😄
//         </p>
//       </Modal>
//     </div>
//   );
// };

// export default EmotionDetection;
