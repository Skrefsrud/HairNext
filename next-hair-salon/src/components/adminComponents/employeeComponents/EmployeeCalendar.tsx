"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

import { supabase } from "@/utils/supabase/supabaseClient";
import { fetchAvailableDates } from "../booking-form-functions";
import { EmployeeType } from "@/utils/interfaces";
import { SelectEmployee } from "@/components/selectEmployee";
import { CheckmarkIcon } from "@/components/ui/icons/checkmarkIcon";
import { Button } from "@/components/ui/button";
import { AddUnavailModal } from "./addUnavailModal";

interface CalendarSelectProps {
  passedEmployees: EmployeeType;
}
interface RenderCalendarProps {
  onDayClick: (day: number) => void;
  month: number;
  year: number;
  availableDates: number[];
}

function EmployeeCalendar({ passedEmployees }: CalendarSelectProps) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [availableDates, setAvailableDates] = useState<number[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectMultipleDays, setSelectMultipleDays] = useState(false);
  const [selectedDays, setSelectedDays] = useState<Number[]>([]);
  const [dates, setDates] = useState<Date[]>([]);

  const handleEmployeeSelect = (employee: Employee) => {
    const existingEmployeeIndex = selectedEmployees.findIndex(
      (selectedEmployee) => selectedEmployee.id === employee.id
    );

    existingEmployeeIndex === -1
      ? setSelectedEmployees([...selectedEmployees, employee])
      : setSelectedEmployees(
          selectedEmployees.filter((e) => e.id !== employee.id)
        );

    console.log(selectedEmployees);
  };

  const handleDayClick = (day: number) => {
    let selectedDate = new Date(year, month, day);
    if (selectMultipleDays) {
      const dayIndex = selectedDays.indexOf(day);
      if (dayIndex !== -1) {
        setSelectedDays(selectedDays.filter((d) => d !== day));
      } else {
        setSelectedDays([...selectedDays, day]);
      }

      const existingDateIndex = dates.findIndex(
        (date) => date.getTime() === selectedDate.getTime() // Compare full timestamps
      );

      if (existingDateIndex !== -1) {
        const newDates = dates.filter(
          (date, index) => index !== existingDateIndex
        );
        setDates(newDates);
      } else {
        setDates([...dates, selectedDate]);
      }
    }

    let formatter = new Intl.DateTimeFormat("no", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    let displayDate = formatter.format(selectedDate);
  };

  const incrementValue = () => {
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
    } else {
      setMonth(month + 1);
    }
    setSelectedDays([]);
  };
  const decrementValue = () => {
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
    } else {
      setMonth(month - 1);
    }
    setSelectedDays([]);
  };

  return (
    <main className='w-full flex justify-center align-center'>
      <div className='flex flex-col items-center w-4/6'>
        <div className='flex w-full justify-center align-center relative'>
          <div className='absolute left-0 bottom-0'>
            {selectMultipleDays && (
              <AddUnavailModal dates={dates}></AddUnavailModal>
            )}
            <label className='label cursor-pointer  flex gap-2'>
              <input
                type='checkbox'
                className='checkbox checkbox-primary '
                onChange={() => setSelectMultipleDays(!selectMultipleDays)}
              />
              <span className='label-text text-xl'>Select multiple dates</span>
            </label>
          </div>
          <div className='flex items-center justify-center justify-self-center align-self-center gap-10 mb-12'>
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
          <div className='flex gap-2 absolute right-0'>
            {passedEmployees.map((employee) => (
              <SelectEmployee
                key={employee.id}
                employee={employee}
                clickable={true}
                checkMark={true}
                onSelect={handleEmployeeSelect}
              />
            ))}
          </div>
        </div>
        <RenderCalendar
          onDayClick={handleDayClick}
          month={month}
          year={year}
          availableDates={availableDates}
          selectMultipleDays={selectMultipleDays}
          selectedDays={selectedDays}
        />
      </div>
    </main>
  );
}

export default EmployeeCalendar;

interface RenderCalendarProps {
  onDayClick: (day: number) => void;
  month: number;
  year: number;
  selectMultipleDays: boolean;
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

function RenderCalendar({
  onDayClick,
  month,
  year,
  availableDates,
  selectMultipleDays,
  selectedDays,
}) {
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
        "border border-slate-100 rounded-md p-4 flex items-center justify-center aspect-square relative"; // Base class
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
          onClick={handleClick}
        >
          {cellDay}
          {selectMultipleDays && (
            <div className='absolute top-0 left-0 w-1/4 h-1/4'>
              <CheckmarkIcon
                isChecked={selectedDays.includes(cellDay)}
              ></CheckmarkIcon>
            </div>
          )}
        </div>
      );
    }
    rows.push(
      <div key={i} className='grid grid-cols-7 gap-1 mb-1'>
        {cols}
      </div>
    );
  }

  return <div className='w-full mt-5'>{rows}</div>;
}
