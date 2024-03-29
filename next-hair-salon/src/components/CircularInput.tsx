import React, { useState, useEffect, forwardRef, useRef } from "react";
import Draggable from "react-draggable";

export const CircularInput = ({}) => {
  const startValue = 0;
  const [endValue, setEndValue] = useState(60);
  const [cx, setcx] = useState(0);
  const [cy, setcy] = useState(0);
  const ref = useRef(null);
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const adjustedStartValue = (startValue - 90) % 360; // Adjust for SVG's 0 degrees at 3 o'clock
  const adjustedEndValue = (endValue - 90) % 360; // Adjust for SVG's 0 degrees at 3 o'clock
  const filledStrokeDashoffset =
    circumference -
    ((adjustedEndValue - adjustedStartValue) / 360) * circumference;
  const angleInRadians = ((endValue - 90) * Math.PI) / 180; // Convert to radians and adjust for SVG's 0 degrees at 3 o'clock

  const handleDrag = (e, ui) => {
    console.log("dragging");
    const x = ui.x - 60; // Adjust for circle's center
    const y = ui.y - 60; // Adjust for circle's center
    const newEndValue = (Math.atan2(y, x) * (180 / Math.PI) + 90 + 360) % 360; // Convert to degrees and adjust for SVG's 0 degrees at 3 o'clock
    setEndValue(newEndValue);
  };

  const Handle = forwardRef((props, ref) => {
    setcx[endValue + radius * Math.cos(angleInRadians)];
    setcy[endValue + radius * Math.sin(angleInRadians)];
    const cy = endValue + radius * Math.sin(angleInRadians); // Calculate y position

    console.log("Handle position:", { cx, cy });

    return (
      <g className='cursor-pointer' ref={ref}>
        <circle fill='red' r='5' cx={cx} cy={cy} /> {/* This is the handle */}
      </g>
    );
  });

  Handle.displayName = "Handle";

  function handleClick() {
    console.log("clicked");
  }

  return (
    <div style={{ position: "relative", height: "120px", width: "120px" }}>
      <svg height='120' width='120' style={{ position: "absolute", zIndex: 1 }}>
        <circle
          stroke='grey'
          fill='transparent'
          strokeWidth='10'
          strokeDasharray={circumference}
          r={radius}
          cx='60'
          cy='60'
        />
        <circle
          stroke='blue'
          fill='transparent'
          strokeWidth='10'
          strokeDasharray={circumference}
          style={{
            strokeDashoffset: filledStrokeDashoffset,
            transform: `rotate(${adjustedStartValue}deg)`,
            transformOrigin: "center",
          }}
          r={radius}
          cx='60'
          cy='60'
        />
        <Draggable
          onDrag={handleDrag}
          style={{
            zIndex: 2,
            onClick: handleClick,
          }}
        >
          <Handle ref={ref} endValue={endValue} />
        </Draggable>
      </svg>
    </div>
  );
};
