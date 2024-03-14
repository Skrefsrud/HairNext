"use client";
// @ts-check

import CalendarSelect from "./bookingComponents/CalendarSelect";
import SlideInContainer from "./SlideInContainer";
import React, { useState } from "react";
import Stats from "./Stats";
import TimeSelector from "./bookingComponents/TimeSelect";
import TypeSelector from "./bookingComponents/TypeSelector";
import { BookingType } from "./bookingComponents/enums";
import ServicesSelector from "./ServiceSelector";

export function BookingForm() {
  enum AnimationDirection {
    TOP = "top",
    BOTTOM = "bottom",
  }

  interface Service {
    service_id: number; // Adjust the types as needed
    name: string;
    price: number;
    description: string;
    time_requirement: string | number; // Or whatever type represents the duration
  }

  interface ServicesData {
    services: Service[];
    price: number;
    duration: number | string; // Assuming combined duration might be a string
  }
  //BookingData state
  const [bookingData, setBookingData] = useState({
    employee: {
      id: null as Number,
      employee_name: null as String,
    },
    bookingDetails: {
      date: null as Date,
      time: null as String[],
      bookingType: null as BookingType[],
      bookingDuration: null as Number,
    },
    customer: {
      customer_name: null as String,
      phoneNumber: null as Number,
      comment: null as String,
    },
  });

  //Access the bookingData objects
  const { employee, bookingDetails, customer } = bookingData;

  //UI Component State
  const [uiState, setUiState] = useState({
    selectedOption: 0,
    previousOption: null,
    direction: AnimationDirection.BOTTOM,
  });

  //Access the states
  const { selectedOption, previousOption, direction } = uiState;

  const [servicesData, setServicesData] = useState<ServicesData | null>(null);

  //Handling the selections

  const handleTypeSelection = (
    selectedTypes: BookingType[],
    intDuration: Number
  ) => {
    updateBookingType(selectedTypes);
    updateBookingDuration(intDuration);
    incSelectedOption();
    if (employee.employee_name === null) {
      console.log(employee.employee_name);
    }
  };

  const handleServicesSelected = (
    services: Service[],
    price: number,
    duration: number | string
  ) => {
    setServicesData({ services, price, duration });
  };

  const handleDateSelection = (selectedDate: Date, displayDate: String) => {
    updateBookingDate(selectedDate);
    incSelectedOption();
  };

  //Handling what component should be rendered based on the selectedOption variable
  const BookingStep = ({ selectedOption, stepIndex, direction, children }) => {
    return (
      selectedOption === stepIndex && (
        <SlideInContainer direction={direction}>{children}</SlideInContainer>
      )
    );
  };

  //helper funcitions

  function incSelectedOption() {
    setUiState({
      ...uiState,
      direction: AnimationDirection.BOTTOM,
      selectedOption: selectedOption + 1,
    });
  }
  function decSelectedOption() {
    setUiState({
      ...uiState,
      direction: AnimationDirection.TOP,
      selectedOption: selectedOption - 1,
    });
  }

  function updateBookingType(newBookingType: BookingType | BookingType[]) {
    setBookingData((prevBookingData) => ({
      ...prevBookingData, // Keep everything in bookingData
      bookingDetails: {
        ...prevBookingData.bookingDetails, // Keep everything in bookingDetails
        bookingType: newBookingType, // Update only bookingType
      },
    }));
  }
  function updateBookingDuration(newDuration: number) {
    setBookingData((prevBookingData) => ({
      ...prevBookingData,
      bookingDetails: {
        ...prevBookingData.bookingDetails,
        bookingDuration: newDuration,
      },
    }));
  }
  function updateBookingDate(newDate: Date) {
    setBookingData((prevBookingData) => ({
      ...prevBookingData,
      bookingDetails: {
        ...prevBookingData.bookingDetails,
        date: newDate,
      },
    }));
  }

  return (
    <div className='bg-white w-1/2 h-2/3'>
      <BookingStep
        selectedOption={selectedOption}
        stepIndex={0}
        direction={direction}
      >
        <ServicesSelector
          onServicesSubmit={handleServicesSelected}
        ></ServicesSelector>
      </BookingStep>
      <BookingStep
        selectedOption={selectedOption}
        stepIndex={1}
        direction={direction}
      >
        <CalendarSelect onSelect={handleDateSelection} />
      </BookingStep>

      <BookingStep
        selectedOption={selectedOption}
        stepIndex={2}
        direction={direction}
      >
        <TimeSelector></TimeSelector>
      </BookingStep>
    </div>
  );
}
