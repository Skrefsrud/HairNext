"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
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
  onSelectTimeSlots: (selectedTimestamps: Date[]) => void; // Pass selected timestamps
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
}) => {
  const [storeHours, setStoreHours] = useState<StoreHour[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [employeeAvailability, setEmployeeAvailability] = useState<
    EmployeeAvailability[]
  >([]);
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [hoveredSlots, setHoveredSlots] = useState<GridCell[]>([]); // State to track hovered slots
  const [selectedSlotIds, setSelectedSlotIds] = useState<number[]>([]); // State to track selected slots

  // Fetch data on week change
  useEffect(() => {
    const fetchData = async () => {
      const startOfWeekDate = startOfWeek(currentWeek, { weekStartsOn: 1 });
      const endOfWeekDate = endOfWeek(currentWeek, { weekStartsOn: 1 });

      // Fetch storeHours and timeSlots concurrently
      const [
        { data: storeHoursData, error: storeHoursError },
        { data: timeSlotsData, error: timeSlotsError },
      ] = await Promise.all([
        supabase.from("store_hours").select("*"),
        supabase
          .from("time_slot")
          .select("*")
          .gte("time_stamp", startOfWeekDate.toISOString())
          .lte("time_stamp", endOfWeekDate.toISOString()),
      ]);

      if (storeHoursError || timeSlotsError) {
        console.error(
          "Error fetching data:",
          storeHoursError || timeSlotsError
        );
        return;
      }

      const timeSlotIds = (timeSlotsData as TimeSlot[]).map((slot) => slot.id);

      // Fetch employeeAvailability without filtering by employeeId
      const {
        data: employeeAvailabilityData,
        error: employeeAvailabilityError,
      } = await supabase
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

      setStoreHours(storeHoursData as StoreHour[]);
      setTimeSlots(timeSlotsData as TimeSlot[]);
      setEmployeeAvailability(
        employeeAvailabilityData as EmployeeAvailability[]
      );
    };

    fetchData();
  }, [currentWeek]);

  // Compute the timeSlotId to timestamp mapping
  const timeSlotIdToTimestamp = useMemo(() => {
    const mapping: { [key: number]: Date } = {};

    (timeSlots || []).forEach((slot) => {
      const slotDateUtc = moment.utc(slot.time_stamp).toDate(); // Parse as UTC
      const slotDate = moment(slotDateUtc).tz(timeZone).toDate(); // Convert to local timezone
      mapping[slot.id] = slotDate;
    });

    return mapping;
  }, [timeSlots]);

  // Generate the grid structure for displaying available time slots
  const grid = useMemo(() => {
    if (
      storeHours.length === 0 ||
      timeSlots.length === 0 ||
      employeeAvailability.length === 0
    ) {
      return {};
    }

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

    const startOfWeekDate = startOfWeek(currentWeek, { weekStartsOn: 1 });

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

          let isAvailable = availableEmployees.length > 0;

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

    return grid;
  }, [
    storeHours,
    timeSlots,
    employeeAvailability,
    currentWeek,
    timeSlotDuration,
  ]);

  // Handle click on a cell to select or deselect time slots
  const handleCellClick = useCallback(() => {
    if (hoveredSlots.length > 0) {
      const hoveredSlotIds = hoveredSlots.map((slot) => slot.time_slot_id!);
      const areAllSelected = hoveredSlotIds.every((id) =>
        selectedSlotIds.includes(id)
      );

      let newSelectedSlotIds: number[] = [];

      if (areAllSelected) {
        // Deselect the hovered slots
        newSelectedSlotIds = [];
      } else {
        // Select the hovered slots and deselect any previous selection
        newSelectedSlotIds = hoveredSlotIds;
      }

      // Get the selected timestamps
      const selectedTimestamps = newSelectedSlotIds
        .map((id) => timeSlotIdToTimestamp[id])
        .filter((date) => date !== undefined);

      // Update the selected slot IDs
      setSelectedSlotIds(newSelectedSlotIds);

      // Update the selected time slots in the parent component
      onSelectTimeSlots(selectedTimestamps);
    }
  }, [hoveredSlots, timeSlotIdToTimestamp, onSelectTimeSlots, selectedSlotIds]);

  // Handle mouse enter event on a cell to track hovered slots
  const handleCellMouseEnter = useCallback(
    (time: string, day: number) => {
      const newHoveredSlots: GridCell[] = [];
      let allSlotsAvailable = true;
      for (let i = 0; i < duration; i++) {
        const nextTime = addMinutes(
          new Date(`1970-01-01T${time}`),
          timeSlotDuration * i
        );
        const formattedTime = format(nextTime, "HH:mm");
        const cell = grid[formattedTime] && grid[formattedTime][day];
        const isSlotAvailable = cell && cell.available;
        const isEmployeeAvailable =
          employeeId == null
            ? isSlotAvailable
            : cell &&
            cell.available_employees &&
            cell.available_employees.includes(employeeId);

        if (isEmployeeAvailable) {
          newHoveredSlots.push(cell);
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
    },
    [grid, duration, employeeId]
  );

  // Handle mouse leave event to clear hovered slots
  const handleCellMouseLeave = useCallback(() => {
    setHoveredSlots([]);
  }, []);

  // Navigate to the previous week
  const handlePreviousWeek = useCallback(() => {
    const previousWeek = addWeeks(currentWeek, -1);
    if (!isBefore(previousWeek, startOfToday())) {
      setCurrentWeek(previousWeek);
    }
  }, [currentWeek]);

  // Navigate to the next week
  const handleNextWeek = useCallback(() => {
    const nextWeek = addWeeks(currentWeek, 1);
    const maxDate = addWeeks(startOfToday(), maxWeeksForward);
    if (!isAfter(nextWeek, maxDate)) {
      setCurrentWeek(nextWeek);
    }
  }, [currentWeek]);

  // Calculate the start and end dates for the current week
  const startOfWeekDate = useMemo(
    () => startOfWeek(currentWeek, { weekStartsOn: 1 }),
    [currentWeek]
  );
  const endOfWeekDate = useMemo(
    () => endOfWeek(currentWeek, { weekStartsOn: 1 }),
    [currentWeek]
  );
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
                    const isSlotAvailable = cell && cell.available;

                    // Determine if the specific employee is available in this slot
                    const isEmployeeAvailable =
                      employeeId == null
                        ? isSlotAvailable
                        : cell &&
                        cell.available_employees &&
                        cell.available_employees.includes(employeeId);

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
                          isEmployeeAvailable
                            ? isSelected
                              ? "bg-blue-200 dark:bg-blue-900 cursor-pointer"
                              : isHovered
                                ? "bg-blue-100 dark:bg-blue-900/30 cursor-pointer"
                                : "bg-green-50 hover:bg-blue-100 dark:bg-green-900/20 dark:hover:bg-blue-900/30 cursor-pointer"
                            : "bg-gray-50 dark:bg-gray-800/50"
                        )}
                        onMouseEnter={() => handleCellMouseEnter(time, i + 1)}
                        onMouseLeave={handleCellMouseLeave}
                        onClick={
                          isEmployeeAvailable ? handleCellClick : undefined
                        }
                      >
                        {isEmployeeAvailable && (
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
      </CardFooter>
    </Card>
  );
};
