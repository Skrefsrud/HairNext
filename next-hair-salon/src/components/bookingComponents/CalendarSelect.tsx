"use client";
import React, { useState, ChangeEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

interface CalendarSelectProps {
  onSelect?: (selectedDate: Date) => void;
}

function CalendarSelect({ onSelect }: CalendarSelectProps) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);

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
      <RenderCalendar onDayClick={handleDayClick} month={month} year={year} />
    </div>
  );
}

export default CalendarSelect;

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

function RenderCalendar({ onDayClick, month, year }) {
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

  for (let i = 0; i < numRows; i++) {
    let cols = [];
    for (let j = 0 - toMonday; j < numCols - toMonday; j++) {
      const handleClick = () => {
        onDayClick(i * numCols + j + 1);
      };

      let cellClasses =
        "border border-slate-100 rounded-sm p-4 flex items-center justify-center cursor-pointer aspect-square"; // Base class
      if (i * numCols + j + 1 < 1 || i * numCols + j + 1 > dayAmount) {
        cellClasses += " invisible"; // Mark inactive days
      }

      cols.push(
        <div
          key={i * numCols + j + 1}
          className={cellClasses}
          onClick={handleClick}
        >
          {i * numCols + j + 1}
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
