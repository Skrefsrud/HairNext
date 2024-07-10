import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/supabaseClient";
import {
  parseISO,
  format,
  addMinutes,
  startOfWeek,
  endOfWeek,
  getDay as getDateFnsDay,
} from "date-fns";

import { testFunction } from "@/pages/actions/calendar/calendarActions";

export const WeekCalendar = () => {
  const [storeHours, setStoreHours] = useState([]);
  const [grid, setGrid] = useState([]);

  useEffect(() => {
    // Fetch store hours and generate grid
    fetchStoreHours();
  }, []);

  const fetchStoreHours = async () => {
    const { data, error } = await supabase.from("store_hours").select("*");

    if (error) {
      console.error("Error fetching store hours:", error);
      return;
    }

    setStoreHours(data);
    fetchTimeSlots(data);
  };

  const fetchTimeSlots = async (storeHours) => {
    const currentDate = new Date();
    const startOfWeekDate = startOfWeek(currentDate, { weekStartsOn: 1 });
    const endOfWeekDate = endOfWeek(currentDate, { weekStartsOn: 1 });

    const { data, error } = await supabase
      .from("time_slot")
      .select("*")
      .gte("time_stamp", startOfWeekDate.toISOString())
      .lte("time_stamp", endOfWeekDate.toISOString());

    if (error) {
      console.error("Error fetching time slots:", error);
      return;
    }

    generateGrid(data, storeHours);
  };

  // Utility function to add minutes to a Date object
  const addMinutes = (date, minutes) => {
    return new Date(date.getTime() + minutes * 60000);
  };

  // Utility function to get the day of the week
  const getDay = (date) => {
    // Returns the day of the week: 0 (Sunday) to 6 (Saturday)
    return date.getDay();
  };

  const generateGrid = (timeSlots, storeHours) => {
    let grid = {};

    // Initialize grid with store hours
    storeHours.forEach((day) => {
      if (!day.is_closed) {
        let startTime = new Date(`1970-01-01T${day.opening_time}`);
        let endTime = new Date(`1970-01-01T${day.closing_time}`);
        while (startTime < endTime) {
          const time = format(startTime, "HH:mm");
          if (!grid[time]) grid[time] = {};
          grid[time][day.day_of_week] = {
            available: false,
            time_slot_id: null,
          }; // Initialize with default values
          startTime = addMinutes(startTime, 15);
        }
      }
    });

    // Populate grid with time slots
    timeSlots.forEach((slot) => {
      console.log(slot);
      const slotDate = new Date(slot.time_stamp); // Parse the ISO string with timezone
      console.log(slotDate);
      const day = getDateFnsDay(slotDate); // 0 for Sunday, 1 for Monday, etc.
      const time = format(slotDate, "HH:mm");
      if (grid[time] && grid[time][day] !== undefined) {
        grid[time][day] = { available: true, time_slot_id: slot.id };
      }
    });

    setGrid(grid);
  };

  const handleCellClick = (event) => {
    const timeSlotId = event.currentTarget.getAttribute("data-time-slot-id");
    console.log("Time Slot ID:", timeSlotId);
  };
  return (
    <div className='grid-container p-4'>
      <div className='grid-header grid grid-cols-8 gap-2 bg-gray-200 p-2'>
        <div>Time</div>
        {[
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ].map((day, i) => (
          <div key={i}>{day}</div>
        ))}
      </div>
      <div className='grid-body'>
        {Object.keys(grid).map((time) => (
          <div
            key={time}
            className='grid-row grid grid-cols-8 gap-2 p-2 border-b border-gray-200'
          >
            <div>{time}</div>
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className={`grid-cell p-2 ${
                  grid[time][i + 1]?.available ? "bg-green-200" : "bg-red-200"
                }`}
                data-time-slot-id={grid[time][i + 1]?.time_slot_id || ""}
                onClick={handleCellClick}
              >
                {grid[time][i + 1]?.available
                  ? `Available (ID: ${grid[time][i + 1].time_slot_id})`
                  : "Unavailable"}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
