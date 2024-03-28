"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

import { supabase } from "@/utils/supabase/supabaseClient";
import { fetchAvailableDates } from "../booking-form-functions";

interface CalendarSelectProps {
  onSelect?: (selectedDate: Date) => void;
}
interface RenderCalendarProps {
  onDayClick: (day: number) => void;
  month: number;
  year: number;
  availableDates: number[];
}

function EmployeeCalendar({ onSelect }: CalendarSelectProps) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [availableDates, setAvailableDates] = useState<number[]>([]);

  const handleDayClick = (day: number) => {
    let selectedDate = new Date(year, month, day);
    let formatter = new Intl.DateTimeFormat("no", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    let displayDate = formatter.format(selectedDate);
    if (onSelect) {
      onSelect(selectedDate, displayDate);
    }
  };

  const incrementValue = () => {
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
    } else {
      setMonth(month + 1);
    }
  };
  const decrementValue = () => {
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
    } else {
      setMonth(month - 1);
    }
  };

  return (
    <div className='flex flex-col items-center w-5/6'>
      <div className='flex items-center justify-center gap-10 mb-12'>
        <FontAwesomeIcon
          icon={faChevronLeft}
          onClick={decrementValue}
          className='cursor-pointer'
        />
        <h2 className='w-12'>
          {getMonth(month)} {year}
        </h2>

        <FontAwesomeIcon
          icon={faChevronRight}
          onClick={incrementValue}
          className='cursor-pointer'
        />
      </div>
      <RenderCalendar
        onDayClick={handleDayClick}
        month={month}
        year={year}
        availableDates={availableDates}
      />
    </div>
  );
}

export default EmployeeCalendar;

interface RenderCalendarProps {
  onDayClick: (day: number) => void;
  month: number;
  year: number;
}

function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

function getDaysToSunday(finalDay) {
  if (finalDay === 0) {
    finalDay = 7;
  }
  let toSunday = 7 - finalDay;
  return toSunday;
}

function getDaysToMonday(startDay) {
  if (startDay === 0) {
    startDay = 7;
  }
  let toMonday = startDay - 1;
  return toMonday;
}

function getMonth(value) {
  let months = [
    "Januar",
    "Feburar",
    "Mars",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  return months[value];
}

function RenderCalendar({ onDayClick, month, year, availableDates }) {
  let currentYear = year;
  let currentMonth = month;
  let firstDay = new Date(currentYear, currentMonth, 1).getDay();
  let lastDay = new Date(currentYear, currentMonth + 1, 0).getDay();
  let dayAmount = daysInMonth(currentMonth + 1, currentYear);

  let toMonday = getDaysToMonday(firstDay);
  let toSunday = getDaysToSunday(lastDay);

  let numCols = 7;
  let numRows = Math.floor((dayAmount + (toMonday + toSunday)) / 7);

  let rows = [];

  let cellAvailClasses =
    "bg-green-200 hover:bg-green-300 transition border border-green-500 text-green-700 cursor-pointer";

  let cellNotAvailClasses =
    "bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-500 cursor-pointer";

  for (let i = 0; i < numRows; i++) {
    let cols = [];
    for (let j = 0 - toMonday; j < numCols - toMonday; j++) {
      let cellDay = i * numCols + j + 1;
      const handleClick = () => {
        onDayClick(cellDay);
      };

      let cellClasses =
        "border border-slate-100 rounded-sm p-4 flex items-center justify-center aspect-square"; // Base class
      if (cellDay < 1 || cellDay > dayAmount) {
        cellClasses += " invisible"; // Mark inactive days
      }

      cols.push(
        <div
          key={cellDay}
          className={`${cellClasses} ${
            availableDates.includes(cellDay)
              ? cellAvailClasses
              : cellNotAvailClasses
          }`}
          onClick={availableDates.includes(cellDay) ? handleClick : undefined}
        >
          {cellDay}
        </div>
      );
    }
    rows.push(
      <div key={i} className='grid grid-cols-7 gap-1 mb-1'>
        {cols}
      </div>
    );
  }

  return <div className='w-5/6'>{rows}</div>;
}
