import React, { useState, useEffect } from "react";
import { CircularInput } from "./CircularInput";
import { RadialProgressBar } from "./circularBar/RadialProgressBar";
export function Clock() {
  const [progress, setProgress] = useState({
    start: 0,
    end: 60, // Example initial values
  });

  // Example: Simulate progress change

  const renderPieSlices = () => {
    const slices = [];
    const sliceAngle = 360 / 12;

    for (let i = 0; i < 12; i++) {
      const rotation = sliceAngle * i + 30;

      slices.push(
        <div
          key={i}
          className='absolute w-full h-full transform-origin-bottom-right border-4 border-white rounded-full'
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {/* Add content for each slice here if needed */}
          <p
            className='text-center font-poppins text-3xl text-white font-medium pt-2'
            style={{ transform: `rotate(-${rotation}deg)` }}
          >
            {i + 1}
          </p>
        </div>
      );
    }

    return slices;
  };

  return (
    <>
      <div className='w-64 h-64 rounded-full relative flex items-center justify-center'>
        {renderPieSlices()}

        <div className='w-4 h-4 rounded-full bg-white align-sef'></div>
      </div>

      <RadialProgressBar initialAngle={0.25} />
    </>
  );
}
