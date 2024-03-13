import React, { useState, useEffect } from "react";

interface TimeSelectorProps {
  onSelect: (selectedTime: string) => void;
  bookedTimes: string[];
}

const TimeSelector = ({ onSelect, bookedTimes }: TimeSelectorProps) => {
  const [selectedTime, setSelectedTime] = useState("");

  // Handles time selection
  const handleTimeSelect = (selectedTime: string) => {
    setSelectedTime(selectedTime);
    onSelect(selectedTime);
  };

  // Generate available time slots (refactored for clarity)
  const generateTimeSlots = () => {
    const startTime = 9 * 60;
    const endTime = 17 * 60;
    const interval = 15;
    const times = [];

    for (let i = startTime; i < endTime; i += interval) {
      const hour = Math.floor(i / 60);
      const minute = i % 60;
      const timeString = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;

      //const isBooked = bookedTimes.includes(timeString);

      times.push(
        <div
          key={i}
          className={`cursor-pointer border-solid border-2 rounded border-sky-100 w-32 text-center ${
            isBooked ? "booked" : ""
          }`}
          onClick={() => (!isBooked ? handleTimeSelect(timeString) : null)}
        >
          {timeString} {isBooked ? "(Booked)" : ""}
        </div>
      );
    }
    return times;
  };

  // Use useEffect to generate the time slots in the beginning
  const timeSlots = generateTimeSlots();

  return (
    <div className='h-3/4 overflow-y-auto w-48 bg-blue'>
      <div className='flex flex-col list-none gap-2 justify-center items-center'>
        {timeSlots}
      </div>
    </div>
  );
};

export default TimeSelector;
