import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/supabaseClient";
import {
  format,
  addMinutes,
  startOfWeek,
  endOfWeek,
  addWeeks,
  isAfter,
  isBefore,
  startOfToday,
  getISOWeek,
  isPast,
} from "date-fns";
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

const maxWeeksForward = 4; // Maximum number of weeks a user can navigate forward

export const WeekCalendar = ({ employeeId }) => {
  const [storeHours, setStoreHours] = useState([]);
  const [grid, setGrid] = useState({});
  const [currentWeek, setCurrentWeek] = useState(new Date());

  useEffect(() => {
    // Fetch store hours and generate grid
    fetchStoreHours();
  }, [currentWeek]);

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
    const startOfWeekDate = startOfWeek(currentWeek, { weekStartsOn: 1 });
    const endOfWeekDate = endOfWeek(currentWeek, { weekStartsOn: 1 });

    const { data: timeSlots, error: timeSlotsError } = await supabase
      .from("time_slot")
      .select("*")
      .gte("time_stamp", startOfWeekDate.toISOString())
      .lte("time_stamp", endOfWeekDate.toISOString());

    if (timeSlotsError) {
      console.error("Error fetching time slots:", timeSlotsError);
      return;
    }

    const timeSlotIds = timeSlots.map((slot) => slot.id);

    fetchEmployeeAvailability(timeSlotIds, timeSlots, storeHours);
  };

  const fetchEmployeeAvailability = async (
    timeSlotIds,
    timeSlots,
    storeHours
  ) => {
    const { data: employeeAvailability, error: employeeAvailabilityError } =
      await supabase
        .from("employee_availability")
        .select("*")
        .in("time_slot_id", timeSlotIds);

    if (employeeAvailabilityError) {
      console.error(
        "Error fetching employee availability:",
        employeeAvailabilityError
      );
      return;
    }

    generateGrid(timeSlots, storeHours, employeeAvailability);
  };

  const generateGrid = (timeSlots, storeHours, employeeAvailability) => {
    let grid = {};

    // Initialize grid with store hours using numeric day values
    storeHours.forEach((day) => {
      if (!day.is_closed) {
        let startTime = new Date(`1970-01-01T${day.opening_time}`);
        let endTime = new Date(`1970-01-01T${day.closing_time}`);
        const dayOfWeek = dayNameToNumber[day.day_of_week]; // Convert day name to numeric value
        while (startTime < endTime) {
          const time = format(startTime, "HH:mm");
          if (!grid[time]) grid[time] = {};
          grid[time][dayOfWeek] = {
            available: false,
            time_slot_id: null,
            available_employees: [], // Initialize with an empty array
          }; // Initialize with default values
          startTime = addMinutes(startTime, 15);
        }
      }
    });

    console.log("Initialized Grid:", grid);

    // Populate grid with time slots and check employee availability
    timeSlots.forEach((slot) => {
      const slotDateUtc = moment.utc(slot.time_stamp).toDate(); // Parse the ISO string as UTC
      const slotDate = moment(slotDateUtc).tz(timeZone).toDate(); // Convert to local timezone
      const day = slotDate.getDay(); // 0 for Sunday, 1 for Monday, etc.
      const time = format(slotDate, "HH:mm");

      // Mark past time slots as unavailable
      if (isPast(slotDate)) {
        console.log(
          `Time slot at ${time} on day ${day} is in the past and will be marked as unavailable.`
        );
        return;
      }

      // Check if any employee is available at this time slot
      const availableEmployees = employeeAvailability
        .filter(
          (availability) =>
            availability.time_slot_id === slot.id &&
            availability.occupied_booking === null &&
            availability.occupied_other === null
        )
        .map((availability) => availability.employee_id);

      if (availableEmployees.length > 0) {
        grid[time][day] = {
          available: true,
          time_slot_id: slot.id,
          available_employees: availableEmployees, // Store the array of employee IDs
        };
      }

      console.log("Day:", day);
      console.log("Time:", time);
      console.log("Grid[time] logging: ", grid[time]);
      console.log(
        "Grid Before Update:",
        grid[time] ? grid[time][day] : "Undefined"
      );

      if (grid[time] && grid[time][day] !== undefined) {
        console.log("Updating Grid:", time, day, slot.id);
      }
    });

    console.log("Final Grid:", grid);

    setGrid(grid);
  };

  const handleCellClick = (event) => {
    const timeSlotId = event.currentTarget.getAttribute("data-time-slot-id");
    const availableEmployees = event.currentTarget.getAttribute(
      "data-available-employees"
    );
    console.log("Time Slot ID:", timeSlotId);
    console.log("Available Employees:", availableEmployees.split(","));
  };

  const handlePreviousWeek = () => {
    const previousWeek = addWeeks(currentWeek, -1);
    if (!isBefore(previousWeek, startOfToday())) {
      setCurrentWeek(previousWeek);
    }
  };

  const handleNextWeek = () => {
    const nextWeek = addWeeks(currentWeek, 1);
    const maxDate = addWeeks(startOfToday(), maxWeeksForward);
    if (!isAfter(nextWeek, maxDate)) {
      setCurrentWeek(nextWeek);
    }
  };

  const startOfWeekDate = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const endOfWeekDate = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const currentYear = format(currentWeek, "yyyy");
  const currentISOWeek = getISOWeek(currentWeek);
  const weekRangeText = `${format(startOfWeekDate, "MMM dd")} - ${format(
    endOfWeekDate,
    "MMM dd"
  )}`;

  return (
    <div className='grid-container p-4'>
      <div className='flex justify-between items-center mb-4'>
        <button
          onClick={handlePreviousWeek}
          disabled={isBefore(addWeeks(currentWeek, -1), startOfToday())}
          className={`px-4 py-2 rounded ${
            isBefore(addWeeks(currentWeek, -1), startOfToday())
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-700"
          }`}
        >
          Previous Week
        </button>
        <div className='text-center'>
          <div className='font-semibold'>{`Year ${currentYear}, Week ${currentISOWeek}`}</div>
          <div className='text-sm text-gray-600'>{`(${weekRangeText})`}</div>
        </div>
        <button
          onClick={handleNextWeek}
          disabled={isAfter(
            addWeeks(currentWeek, 1),
            addWeeks(startOfToday(), maxWeeksForward)
          )}
          className={`px-4 py-2 rounded ${
            isAfter(
              addWeeks(currentWeek, 1),
              addWeeks(startOfToday(), maxWeeksForward)
            )
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-700"
          }`}
        >
          Next Week
        </button>
      </div>
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
            {[...Array(7)].map((_, i) => {
              const isAvailable = grid[time][i + 1]?.available;
              const availableEmployees =
                grid[time][i + 1]?.available_employees || [];
              const shouldDisplay =
                !employeeId || availableEmployees.includes(employeeId);
              const cellClass = shouldDisplay
                ? isAvailable
                  ? "bg-green-200"
                  : "bg-red-200"
                : "bg-gray-300 opacity-50";

              return (
                <div
                  key={i}
                  className={`grid-cell p-2 ${cellClass}`}
                  data-time-slot-id={grid[time][i + 1]?.time_slot_id || ""}
                  data-available-employees={availableEmployees.join(",") || ""}
                  onClick={shouldDisplay ? handleCellClick : null}
                >
                  {isAvailable
                    ? `Available (ID: ${grid[time][i + 1].time_slot_id})`
                    : "Unavailable"}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
