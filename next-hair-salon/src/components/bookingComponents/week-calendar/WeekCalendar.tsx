"use client";

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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import moment from "moment-timezone";

const timeZone = "Europe/Oslo";

// Mapping day names to numeric values
type DayNameToNumber = {
  [key: string]: number;
};
const dayNameToNumber: DayNameToNumber = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

interface WeekCalendarProps {
  employeeId?: number; // Optional employeeId
  duration: number; // Number of slots (each slot is 15 minutes)
  onSelectTimeSlots: (timeSlots: number[]) => void;
  onNext: (selectedTimestamps: Date[]) => void; // New prop to handle Next button click
}

interface StoreHour {
  day_of_week: string;
  is_closed: boolean;
  opening_time: string;
  closing_time: string;
}

interface TimeSlot {
  id: number;
  time_stamp: string; // Stored as timestamptz in the database
}

interface EmployeeAvailability {
  time_slot_id: number;
  employee_id: number;
  occupied_booking: number | null;
  occupied_other: number | null;
}

interface GridCell {
  available: boolean;
  time_slot_id: number | null;
  available_employees: number[]; // List of available employee IDs
}

const maxWeeksForward = 4; // Maximum number of weeks a user can navigate forward
const timeSlotDuration = 15; // Duration of each time slot in minutes

export const WeekCalendar: React.FC<WeekCalendarProps> = ({
  employeeId,
  duration, // Number of slots
  onSelectTimeSlots,
  onNext, // New prop
}) => {
  const [storeHours, setStoreHours] = useState<StoreHour[]>([]);
  const [grid, setGrid] = useState<{
    [time: string]: { [day: number]: GridCell };
  }>({});
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [hoveredSlots, setHoveredSlots] = useState<GridCell[]>([]); // State to track hovered slots
  const [selectedSlotIds, setSelectedSlotIds] = useState<number[]>([]); // State to track selected slots
  const [timeSlotIdToTimestamp, setTimeSlotIdToTimestamp] = useState<{
    [key: number]: Date;
  }>({}); // Mapping of time_slot_id to timestamp

  // Fetch data on week change or when employeeId changes
  useEffect(() => {
    const fetchData = async () => {
      await fetchStoreHours();
    };

    const debounceFetch = setTimeout(fetchData, 300); // Debounce to prevent excessive API calls

    return () => clearTimeout(debounceFetch);
  }, [currentWeek, employeeId]);

  // Fetch store hours from the database
  const fetchStoreHours = async () => {
    const { data, error } = await supabase.from("store_hours").select("*");

    if (error) {
      console.error("Error fetching store hours:", error);
      return;
    }

    setStoreHours(data as StoreHour[]);
    fetchTimeSlots(data as StoreHour[]);
  };

  // Fetch time slots for the current week
  const fetchTimeSlots = async (storeHours: StoreHour[]) => {
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

    const timeSlotIds = (timeSlots as TimeSlot[]).map((slot) => slot.id);

    // Create a mapping of time_slot_id to timestamp
    const timeSlotIdToTimestampMap: { [key: number]: Date } = {};
    (timeSlots as TimeSlot[]).forEach((slot) => {
      const slotDateUtc = moment.utc(slot.time_stamp).toDate(); // Parse as UTC
      const slotDate = moment(slotDateUtc).tz(timeZone).toDate(); // Convert to local timezone
      timeSlotIdToTimestampMap[slot.id] = slotDate;
    });
    setTimeSlotIdToTimestamp(timeSlotIdToTimestampMap);

    fetchEmployeeAvailability(timeSlotIds, timeSlots as TimeSlot[], storeHours);
  };

  // Fetch employee availability for the given time slots
  const fetchEmployeeAvailability = async (
    timeSlotIds: number[],
    timeSlots: TimeSlot[],
    storeHours: StoreHour[]
  ) => {
    let query = supabase
      .from("employee_availability")
      .select("*")
      .in("time_slot_id", timeSlotIds);

    // If employeeId is provided, filter by employeeId
    if (employeeId) {
      query = query.eq("employee_id", employeeId);
    }

    const { data: employeeAvailability, error: employeeAvailabilityError } =
      await query;

    if (employeeAvailabilityError) {
      console.error(
        "Error fetching employee availability:",
        employeeAvailabilityError
      );
      return;
    }

    generateGrid(
      timeSlots,
      storeHours,
      employeeAvailability as EmployeeAvailability[]
    );
  };

  // Generate the grid structure for displaying available time slots
  const generateGrid = (
    timeSlots: TimeSlot[],
    storeHours: StoreHour[],
    employeeAvailability: EmployeeAvailability[]
  ) => {
    let grid: { [time: string]: { [day: number]: GridCell } } = {};

    // Initialize grid with store hours using numeric day values
    storeHours.forEach((day) => {
      if (!day.is_closed) {
        const startTimeParsed = new Date(`1970-01-01T${day.opening_time}`);
        const endTimeParsed = new Date(`1970-01-01T${day.closing_time}`);
        let startTime = new Date(startTimeParsed);
        const dayOfWeek = dayNameToNumber[day.day_of_week]; // Convert day name to numeric value
        while (startTime < endTimeParsed) {
          const time = format(startTime, "HH:mm");
          if (!grid[time]) grid[time] = {};
          grid[time][dayOfWeek] = {
            available: false,
            time_slot_id: null,
            available_employees: [],
          }; // Initialize with default values
          startTime = addMinutes(startTime, timeSlotDuration); // Increment time by timeSlotDuration
        }
      }
    });

    // Map time_stamp to time_slot_id
    const timeSlotMap: { [key: string]: number } = {};
    timeSlots.forEach((slot) => {
      const slotDateUtc = moment.utc(slot.time_stamp).toDate(); // Parse as UTC
      const slotDate = moment(slotDateUtc).tz(timeZone).toDate(); // Convert to local timezone
      const timeKey = `${format(slotDate, "yyyy-MM-dd HH:mm")}`;
      timeSlotMap[timeKey] = slot.id;
    });

    // Map time_slot_id to available employee IDs
    const timeSlotAvailabilityMap: { [key: number]: number[] } = {};
    employeeAvailability.forEach((availability) => {
      if (
        availability.occupied_booking === null &&
        availability.occupied_other === null
      ) {
        if (!timeSlotAvailabilityMap[availability.time_slot_id]) {
          timeSlotAvailabilityMap[availability.time_slot_id] = [];
        }
        timeSlotAvailabilityMap[availability.time_slot_id].push(
          availability.employee_id
        );
      }
    });

    // Populate grid with time slots and check employee availability
    Object.keys(grid).forEach((time) => {
      Object.keys(grid[time]).forEach((dayKey) => {
        const day = parseInt(dayKey);
        // Construct the datetime for this grid cell
        const date = addMinutes(
          startOfWeekDate,
          day * 24 * 60 + // Days to minutes
            parseInt(time.split(":")[0]) * 60 + // Hours to minutes
            parseInt(time.split(":")[1]) // Minutes
        );

        const timeKey = `${format(date, "yyyy-MM-dd HH:mm")}`;
        const slotId = timeSlotMap[timeKey];

        if (slotId) {
          // Skip past time slots
          if (isPast(date)) {
            return;
          }

          const availableEmployees = timeSlotAvailabilityMap[slotId] || [];

          let isAvailable = false;

          if (employeeId) {
            // Check if the specific employee is available
            isAvailable = availableEmployees.includes(employeeId);
          } else {
            // Check if any employee is available
            isAvailable = availableEmployees.length > 0;
          }

          if (isAvailable) {
            grid[time][day] = {
              available: true,
              time_slot_id: slotId,
              available_employees: availableEmployees,
            };
          } else {
            grid[time][day] = {
              available: false,
              time_slot_id: null,
              available_employees: [],
            };
          }
        }
      });
    });

    setGrid(grid); // Update the grid state
  };

  // Handle click on a cell to select or deselect time slots
  const handleCellClick = () => {
    if (hoveredSlots.length > 0) {
      setSelectedSlotIds((prevSelectedSlotIds) => {
        const hoveredSlotIds = hoveredSlots.map((slot) => slot.time_slot_id!);
        const areAllSelected = hoveredSlotIds.every((id) =>
          prevSelectedSlotIds.includes(id)
        );

        let newSelectedSlotIds;

        if (areAllSelected) {
          // Deselect the hovered slots
          newSelectedSlotIds = [];
        } else {
          // Select the hovered slots and deselect any previous selection
          newSelectedSlotIds = hoveredSlotIds;
        }

        // Update the selected time slots
        onSelectTimeSlots(newSelectedSlotIds);
        return newSelectedSlotIds;
      });
    }
  };

  // Handle mouse enter event on a cell to track hovered slots
  const handleCellMouseEnter = (time: string, day: number) => {
    const newHoveredSlots: GridCell[] = [];
    let allSlotsAvailable = true;
    for (let i = 0; i < duration; i++) {
      const nextTime = addMinutes(
        new Date(`1970-01-01T${time}`),
        timeSlotDuration * i
      );
      const formattedTime = format(nextTime, "HH:mm");
      if (
        grid[formattedTime] &&
        grid[formattedTime][day] &&
        grid[formattedTime][day].available
      ) {
        newHoveredSlots.push(grid[formattedTime][day]);
      } else {
        allSlotsAvailable = false;
        break;
      }
    }
    if (allSlotsAvailable) {
      setHoveredSlots(newHoveredSlots);
    } else {
      setHoveredSlots([]);
    }
  };

  // Handle mouse leave event to clear hovered slots
  const handleCellMouseLeave = () => {
    setHoveredSlots([]);
  };

  // Handle Next button click
  const handleNextClick = () => {
    if (selectedSlotIds.length > 0) {
      const selectedTimestamps = selectedSlotIds
        .map((id) => timeSlotIdToTimestamp[id])
        .filter((date) => date !== undefined);
      onNext(selectedTimestamps);
    }
  };

  // Navigate to the previous week
  const handlePreviousWeek = () => {
    const previousWeek = addWeeks(currentWeek, -1);
    if (!isBefore(previousWeek, startOfToday())) {
      setCurrentWeek(previousWeek);
    }
  };

  // Navigate to the next week
  const handleNextWeek = () => {
    const nextWeek = addWeeks(currentWeek, 1);
    const maxDate = addWeeks(startOfToday(), maxWeeksForward);
    if (!isAfter(nextWeek, maxDate)) {
      setCurrentWeek(nextWeek);
    }
  };

  // Calculate the start and end dates for the current week
  const startOfWeekDate = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const endOfWeekDate = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const currentISOWeek = getISOWeek(currentWeek);
  const weekRangeText = `${format(startOfWeekDate, "MMM dd")} - ${format(
    endOfWeekDate,
    "MMM dd"
  )}`;

  // Render the component UI
  return (
    <Card className="w-full max-w-4xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 shadow-lg">
      <CardHeader className="space-y-1 pb-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={handlePreviousWeek}
            disabled={isBefore(addWeeks(currentWeek, -1), startOfToday())}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="text-center">
            <span className="text-2xl font-bold">
              {format(startOfWeekDate, "MMMM yyyy")}
            </span>
            <div className="mt-1 text-sm font-normal text-muted-foreground">
              Week {currentISOWeek} • {weekRangeText}
            </div>
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={handleNextWeek}
            disabled={isAfter(
              addWeeks(currentWeek, 1),
              addWeeks(startOfToday(), maxWeeksForward)
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-[auto_1fr]">
          <div className="border-r border-gray-200 dark:border-gray-700 py-2 w-20">
            <div className="h-14 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 flex items-end pb-2">
              Time
            </div>
          </div>
          <div className="grid grid-cols-7">
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((day, i) => (
              <div
                key={i}
                className="border-r border-gray-200 dark:border-gray-700 last:border-r-0 py-2"
              >
                <div className="h-14 text-center flex flex-col justify-end pb-2">
                  <div className="text-sm font-semibold">{day}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <ScrollArea className="h-[500px]">
          <div className="grid grid-cols-[auto_1fr]">
            <div className="border-r border-gray-200 dark:border-gray-700 w-20">
              {Object.keys(grid).map((time) => (
                <div
                  key={time}
                  className="h-12 border-t border-gray-200 dark:border-gray-700 px-4 flex items-center"
                >
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {time}
                  </span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className="border-r border-gray-200 dark:border-gray-700 last:border-r-0"
                >
                  {Object.keys(grid).map((time) => {
                    const cell = grid[time] && grid[time][i + 1];
                    const isAvailable = cell && cell.available;
                    const isHovered = cell && hoveredSlots.includes(cell);
                    const isSelected =
                      cell &&
                      cell.time_slot_id &&
                      selectedSlotIds.includes(cell.time_slot_id);

                    return (
                      <div
                        key={`${time}-${i}`}
                        className={cn(
                          "h-12 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center transition-colors",
                          isAvailable
                            ? isSelected
                              ? "bg-blue-200 dark:bg-blue-900 cursor-pointer"
                              : isHovered
                              ? "bg-blue-100 dark:bg-blue-900/30 cursor-pointer"
                              : "bg-green-50 hover:bg-blue-100 dark:bg-green-900/20 dark:hover:bg-blue-900/30 cursor-pointer"
                            : "bg-gray-50 dark:bg-gray-800/50"
                        )}
                        onMouseEnter={() => handleCellMouseEnter(time, i + 1)}
                        onMouseLeave={handleCellMouseLeave}
                        onClick={isAvailable ? handleCellClick : undefined}
                      >
                        {isAvailable && (
                          <>
                            {isSelected ? (
                              <div className="h-2 w-2 rounded-full bg-blue-500 dark:bg-blue-400" />
                            ) : (
                              !isHovered && (
                                <div className="h-2 w-2 rounded-full bg-green-500 dark:bg-green-400" />
                              )
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="justify-between py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentWeek(new Date())}
        >
          Today
        </Button>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-600" />
            <span className="text-gray-600 dark:text-gray-300">
              Unavailable
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-green-500 dark:bg-green-400" />
            <span className="text-gray-600 dark:text-gray-300">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-blue-500 dark:bg-blue-400" />
            <span className="text-gray-600 dark:text-gray-300">Selected</span>
          </div>
        </div>
        {/* Added Next button */}
        <Button
          variant="default"
          size="sm"
          onClick={handleNextClick}
          disabled={selectedSlotIds.length === 0}
        >
          Next
        </Button>
      </CardFooter>
    </Card>
  );
};
