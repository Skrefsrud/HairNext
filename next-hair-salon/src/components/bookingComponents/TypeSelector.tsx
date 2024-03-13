import React, { useState } from "react";
import { BookingType } from "@/components/booking-form";
import Book from "@/app/book-appointment/page";

const TypeSelector = ({ onSubmit }) => {
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]);

  const handleBookingSelect = (bookingType, timeValue) => {
    // Check if the booking type is already selected
    const isAlreadySelected = selectedBookings.includes(bookingType);

    let updatedBookings, updatedTimes;

    if (isAlreadySelected) {
      // If already selected, remove the booking type and time value
      updatedBookings = selectedBookings.filter((type) => type !== bookingType);
      updatedTimes = selectedTimes.filter((time) => time !== timeValue);
    } else {
      // If not selected, add the booking type and time value
      updatedBookings = [...selectedBookings, bookingType];
      updatedTimes = [...selectedTimes, timeValue];
    }

    setSelectedBookings(updatedBookings);
    setSelectedTimes(updatedTimes);
  };

  const handleSubmit = () => {
    const combinedTime = selectedTimes.reduce((acc, time) => acc + time, 0);
    console.log(selectedBookings);

    // Call the onSubmit function with the selected arrays
    onSubmit(selectedBookings, combinedTime);
  };

  return (
    <div className='type-container'>
      <h2 style={{ marginBottom: "20px" }}>Type Selector</h2>
      <label>
        <input
          type='checkbox'
          onChange={() => handleBookingSelect(BookingType.HERREKLIPP, 1)}
          checked={selectedBookings.includes(BookingType.HERREKLIPP)}
          className='checkbox'
        />
        Herreklipp (15 minutes)
      </label>
      <br />
      <label>
        <input
          type='checkbox'
          onChange={() => handleBookingSelect(BookingType.DAMEKLIPP, 2)}
          checked={selectedBookings.includes(BookingType.DAMEKLIPP)}
          className='checkbox'
        />
        Dameklipp (30 minutes)
      </label>
      <br />
      <label>
        <input
          type='checkbox'
          onChange={() => handleBookingSelect(BookingType.HÅRFARGING, 2)}
          checked={selectedBookings.includes(BookingType.HÅRFARGING)}
          className='checkbox'
        />
        Hårfarging (30 minutes)
      </label>
      <br />
      <label>
        <input
          type='checkbox'
          onChange={() => handleBookingSelect(BookingType.SKJEGGTRIMM, 1)}
          checked={selectedBookings.includes(BookingType.SKJEGGTRIMM)}
          className='checkbox'
        />
        Skjeggklipp (15 minutes)
      </label>
      <br />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default TypeSelector;
