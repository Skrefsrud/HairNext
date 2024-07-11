import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/supabaseClient";
import { format, addMinutes, startOfWeek, endOfWeek } from "date-fns";
import moment from "moment-timezone";

const timeZone = "Europe/Oslo";

// Mapping day names to numeric values
const dayNameToNumber = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

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

  const generateGrid = (timeSlots, storeHours) => {
    let grid = {};

    // Initialize grid with store hours using numeric day values
    storeHours.forEach((day) => {
      if (!day.is_closed) {
        let startTime = new Date(`1970-01-01T${day.opening_time}`);
        let endTime = new Date(`1970-01-01T${day.closing_time}`);
        const dayOfWeek = dayNameToNumber[day.day_of_week]; // Convert day name to numeric value
        console.log(
          `Initializing grid for day ${dayOfWeek} from ${format(
            startTime,
            "HH:mm"
          )} to ${format(endTime, "HH:mm")}`
        );
        while (startTime < endTime) {
          const time = format(startTime, "HH:mm");
          if (!grid[time]) grid[time] = {};
          grid[time][dayOfWeek] = {
            available: false,
            time_slot_id: null,
          }; // Initialize with default values
          console.log(`Initialized ${time} for day ${dayOfWeek}`);
          startTime = addMinutes(startTime, 15);
        }
      }
    });

    console.log("Initialized Grid:", grid);

    // Populate grid with time slots
    timeSlots.forEach((slot) => {
      const slotDateUtc = moment.utc(slot.time_stamp).toDate(); // Parse the ISO string as UTC
      const slotDate = moment(slotDateUtc).tz(timeZone).toDate(); // Convert to local timezone
      const day = slotDate.getDay(); // 0 for Sunday, 1 for Monday, etc.
      const time = format(slotDate, "HH:mm");

      console.log("Day:", day);
      console.log("Time:", time);
      console.log("Grid[time] logging: ", grid[time]);
      console.log(
        "Grid Before Update:",
        grid[time] ? grid[time][day] : "Undefined"
      );

      if (grid[time] && grid[time][day] !== undefined) {
        console.log("Updating Grid:", time, day, slot.id);
        grid[time][day] = { available: true, time_slot_id: slot.id };
      }
    });

    console.log("Final Grid:", grid);

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
                  grid[time][i + 1]?.available
                    ? "bg-green-200"
                    : "bg-red-200 pointer-events-none"
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
