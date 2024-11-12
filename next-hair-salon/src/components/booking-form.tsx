"use client";

import React, { useState } from "react";
import CalendarSelect from "./bookingComponents/CalendarSelect";
import SlideInContainer from "./SlideInContainer";
import Stats from "./Stats";
import TimeSelector from "./bookingComponents/TimeSelect";
import TypeSelector from "./bookingComponents/TypeSelector";
import { BookingType } from "./bookingComponents/enums";
import ServicesSelector from "./bookingComponents/ServiceSelector";

enum AnimationDirection {
  TOP = "top",
  BOTTOM = "bottom",
}

interface Service {
  service_id: number;
  name: string;
  price: number;
  description: string;
  time_requirement: string | number;
}

interface ServicesData {
  services: Service[];
  price: number;
  duration: number | string;
}

interface BookingData {
  employee: {
    id: number | null;
    employee_name: string | null;
  };
  bookingDetails: {
    date: Date | null;
    time: string[] | null;
    bookingType: BookingType[] | null;
    bookingDuration: number | null;
  };
  customer: {
    customer_name: string | null;
    phoneNumber: number | null;
    comment: string | null;
  };
}

interface UiState {
  selectedOption: number;
  previousOption: number | null;
  direction: AnimationDirection;
}

interface BookingStepProps {
  selectedOption: number;
  stepIndex: number;
  direction: AnimationDirection;
  children: React.ReactNode;
}

const BookingStep: React.FC<BookingStepProps> = ({
  selectedOption,
  stepIndex,
  direction,
  children,
}) => {
  return selectedOption === stepIndex ? (
    <SlideInContainer direction={direction}>{children}</SlideInContainer>
  ) : null;
};

export function BookingForm() {
  // BookingData state
  const [bookingData, setBookingData] = useState<BookingData>({
    employee: {
      id: null,
      employee_name: null,
    },
    bookingDetails: {
      date: null,
      time: null,
      bookingType: null,
      bookingDuration: null,
    },
    customer: {
      customer_name: null,
      phoneNumber: null,
      comment: null,
    },
  });

  // Access the bookingData objects
  const { employee, bookingDetails, customer } = bookingData;

  // UI Component State
  const [uiState, setUiState] = useState<UiState>({
    selectedOption: 0,
    previousOption: null,
    direction: AnimationDirection.BOTTOM,
  });

  // Access the states
  const { selectedOption, previousOption, direction } = uiState;

  const [servicesData, setServicesData] = useState<ServicesData | null>(null);

  // Handling the selections
  const handleTypeSelection = (
    selectedTypes: BookingType[],
    intDuration: number
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
    duration: number
  ) => {
    setServicesData({ services, price, duration });
    incSelectedOption();
  };

  const handleDateSelection = (selectedDate: Date, displayDate: string) => {
    updateBookingDate(selectedDate);
    incSelectedOption();
  };

  // Helper functions
  function incSelectedOption() {
    setUiState((prevUiState) => ({
      ...prevUiState,
      direction: AnimationDirection.BOTTOM,
      previousOption: prevUiState.selectedOption,
      selectedOption: prevUiState.selectedOption + 1,
    }));
  }

  function decSelectedOption() {
    setUiState((prevUiState) => ({
      ...prevUiState,
      direction: AnimationDirection.TOP,
      previousOption: prevUiState.selectedOption,
      selectedOption: prevUiState.selectedOption - 1,
    }));
  }

  function updateBookingType(newBookingType: BookingType | BookingType[]) {
    setBookingData((prevBookingData) => ({
      ...prevBookingData,
      bookingDetails: {
        ...prevBookingData.bookingDetails,
        bookingType: newBookingType,
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
    <div className="bg-white w-1/2 h-2/3">
      <BookingStep
        selectedOption={selectedOption}
        stepIndex={0}
        direction={direction}
      >
        <ServicesSelector onServicesSubmit={handleServicesSelected} />
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
        <TimeSelector />
      </BookingStep>
    </div>
  );
}
