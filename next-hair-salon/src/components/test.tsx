{
  /*

import React, { useState, useEffect, useRef } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export const CircularInput = ({ startValue, endValue, ...props }) => {
  const [progress, setProgress] = useState({
    start: startValue,
    end: endValue,
  });

  const startHandleRef = useRef(null);
  const endHandleRef = useRef(null);

  const hw = 200;

  const circleRadius = hw / 2; // Adjust this based on your circle's size
  const circleCenterX = hw / 2; // Center 'x' coordinate (width / 2)
  const circleCenterY = hw / 2; // Center 'y' coordinate (height / 2)

  const calculateHandlePosition = (percentage) => {
    const angleInDegrees = -1 * (percentage * 3.6 - 90);
    const angleInRadians = (angleInDegrees * Math.PI) / 180; // Convert to radians
    const x = circleCenterX + circleRadius * Math.cos(angleInRadians) - 2;
    const y = circleCenterY + circleRadius * Math.sin(angleInRadians) - 2;
    return { left: x, top: y };
  };

  const startDragging = (event, handleType) => {
    // Placeholder drag logic
    console.log("Dragging started", handleType);
  };

  const updateProgress = (handleType, newValue) => {
    setProgress((prevProgress) => ({
      ...prevProgress,
      [handleType]: newValue,
    }));
  };

  // Map state values to 0-100 for the progress bar component
  const mappedStart = (progress.start / 360) * 100;
  const mappedEnd = (progress.end / 360) * 100;

  useEffect(() => {
    // Update handle positions after render
    const startHandle = startHandleRef.current;
    const endHandle = endHandleRef.current;

    if (startHandle && endHandle) {
      startHandle.style.left =
        calculateHandlePosition(progress.start).left + "px"; // Add 'px'
      startHandle.style.top =
        calculateHandlePosition(progress.start).top + "px";

      endHandle.style.left = calculateHandlePosition(progress.end).left + "px";
      endHandle.style.top = calculateHandlePosition(progress.end).top + "px";
    }
  }, [progress.start, progress.end]);

  console.log(mappedStart, mappedEnd);

  return (
    <div style={{ width: 200, height: 200 }} className='relative'>
      <CircularProgressbar
        value={mappedEnd}
        startValue={mappedStart}
        text={``}
        styles={buildStyles({
          pathColor: "teal",
          textColor: "black",
          trailColor: "#d6d6d6",
        })}
        {...props}
      />

      <div
        className='absolute w-4 h-4 bg-blue-500 rounded-full cursor-pointer'
        style={calculateHandlePosition(mappedStart)}
        onMouseDown={(e) => startDragging(e, "start")}
      ></div>

      <div
        className='absolute w-4 h-4 bg-red-500 rounded-full cursor-pointer'
        style={calculateHandlePosition(mappedEnd)}
        onMouseDown={(e) => startDragging(e, "end")}
      ></div>
    </div>
  );
};

*/
}
