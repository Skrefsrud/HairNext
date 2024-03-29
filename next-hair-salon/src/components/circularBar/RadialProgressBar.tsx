import { useDraggable } from "./useDraggable";
import "./styles.css";
import React from "react";

export const RadialProgressBar = ({ initialAngle }) => {
  const [draggbleRef, dx, dy, angle] = useDraggable({
    initialAngle,
  });

  console.log(dx, dy);

  return (
    <div className='radial-progress-bar'>
      <div className='radial-progress-bar__half radial-progress-bar__half--1' />
      <div
        className='radial-progress-bar__half radial-progress-bar__half--2'
        style={{
          background: angle > 0.5 ? "rgb(99 102 241)" : "inherit",
          transform: `rotate(${
            angle > 0.5 ? 360 * angle - 180 : 360 * angle
          }deg)`,
        }}
      />

      <div className='radial-progress-bar__overlay' />

      <div className='radial-progress-bar__circle'>
        <div
          className='draggable'
          ref={draggbleRef}
          style={{
            transform: `translate(${dx}px, ${dy}px)`,
            zIndex: 9999,
          }}
        />
        {Math.round(angle * 100)}%
      </div>
    </div>
  );
};
