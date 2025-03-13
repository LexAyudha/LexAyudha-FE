import { useEffect, useRef, useState } from "react";

const EmotionDetection = ({ startDetection, onStopDetection }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const streamRef = useRef(null); // To hold the video stream

  useEffect(() => {
    let intervalId = null;

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

    if (startDetection) {
      startVideoCapture();

      intervalId = setInterval(() => {
        if (videoRef.current && canvasRef.current) {
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

            fetch("http://localhost:5000/api/v1/emotion/detection", {
              method: "POST",
              body: formData,
            })
              .then((response) => response.json())
              .then((data) => console.log("Emotion Prediction:", data))
              .catch((error) => console.error("Error sending frame:", error));
          }, "image/jpeg");
        }
      }, 1000);
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [startDetection]);

  // Dragging functionality
  const handleMouseDown = () => setDragging(true);
  const handleMouseUp = () => setDragging(false);

  const handleMouseMove = (e) => {
    if (dragging) {
      setPosition({
        x: e.clientX - 50,
        y: e.clientY - 50,
      });
    }
  };

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
        <video
          ref={videoRef}
          autoPlay
          playsInline
          onMouseDown={handleMouseDown}
          style={{
            width: 300,
            borderRadius: 10,
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        />
      )}
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <button onClick={onStopDetection} style={{ marginTop: 10 }}>
        Stop Detection
      </button>
    </div>
  );
};

export default EmotionDetection;
