"use client";

import CalendarSelect from "./bookingComponents/CalendarSelect";
import SlideInContainer from "./SlideInContainer";
import React, { useState } from "react";
import Stats from "./Stats";

export function BookingForm() {
  enum BookingType {
    HERREKLIPP = "herreklipp",
    DAMEKLIPP = "dameklipp",
    HÅRFARGING = "hårfarging",
    SKJEGGTRIMM = "skjeggtrim",
  }

  enum AnimationDirection {
    TOP = "top",
    BOTTOM = "bottom",
  }

  //BookingData state
  const [bookingData, setBookingData] = useState({
    employee: {
      id: Number,
      employee_name: String,
    },
    bookingDetails: {
      date: Date,
      time: String,
      bookingType: [BookingType],
      bookingDuration: Number,
    },
    customer: {
      customer_name: String,
      phoneNumber: Number,
      comment: String,
    },
  });

  //Access the bookingData objects
  const { employee, bookingDetails, customer } = bookingData;

  //Generic function to update bookingData
  function updateBookingData(keyPath, value) {
    setBookingData((prevBookingData) => ({
      ...prevBookingData,
      ...keyPath.reduceRight((acc, key) => ({ [key]: acc }), value),
    }));
  }

  //UI Component State
  const [uiState, setUiState] = useState({
    selectedOption: 0,
    previousOption: null,
    direction: AnimationDirection.BOTTOM,
  });

  //Access the states
  const { selectedOption, previousOption, direction } = uiState;

  const handleDateSelection = (selectedDate: Date, displayDate: String) => {
    updateBookingData(["bookingDetails", "date"], selectedDate);
  };

  //Handling what component should be rendered based on the selectedOption variable
  const BookingStep = ({ selectedOption, stepIndex, direction, children }) => {
    return (
      selectedOption === stepIndex && (
        <SlideInContainer direction={direction}>{children}</SlideInContainer>
      )
    );
  };

  return (
    <div className='bg-white w-1/2 h-2/3'>
      <BookingStep
        selectedOption={selectedOption}
        stepIndex={0}
        direction={direction}
      >
        <CalendarSelect onSelect={handleDateSelection} />
      </BookingStep>

      <BookingStep
        selectedOption={selectedOption}
        stepIndex={1}
        direction={direction}
      >
        <Stats />
      </BookingStep>
      <p>{bookingDetails.date.toLocaleString()}</p>
    </div>
  );
}
