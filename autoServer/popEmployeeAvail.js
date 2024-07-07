require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const moment = require("moment-timezone");

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Timezone configuration
const timezone = process.env.TIMEZONE;

// Fetch all employees and their standard hours
async function fetchEmployeesWithStandardHours() {
  const { data, error } = await supabase
    .from("standard_hours")
    .select("employee_id, start_time, end_time, weekday");

  if (error) {
    console.error("Error fetching employees and standard hours:", error);
    return [];
  }

  return data;
}

// Fetch time slots for a specific day and time range
async function fetchTimeSlotsForRange(startDateTime, endDateTime) {
  const { data, error } = await supabase
    .from("time_slot")
    .select("id, time_stamp")
    .gte("time_stamp", startDateTime.format())
    .lte("time_stamp", endDateTime.format());

  if (error) {
    console.error("Error fetching time slots:", error);
    return [];
  }

  return data;
}

// Populate employee availability for a specific month and year
async function populateEmployeeAvailability(year, month) {
  const employeesWithStandardHours = await fetchEmployeesWithStandardHours();

  for (const standardHour of employeesWithStandardHours) {
    const { employee_id, start_time, end_time, weekday } = standardHour;

    let currentMonthDay = moment.tz(
      `${year}-${month}-01`,
      "YYYY-MM-DD",
      timezone
    );
    const endOfMonth = currentMonthDay.clone().endOf("month");

    while (currentMonthDay.isBefore(endOfMonth)) {
      if (currentMonthDay.isoWeekday() === weekday) {
        const openingTime = moment.tz(
          `${currentMonthDay.format("YYYY-MM-DD")} ${start_time}`,
          "YYYY-MM-DD HH:mm:ss",
          timezone
        );
        const closingTime = moment.tz(
          `${currentMonthDay.format("YYYY-MM-DD")} ${end_time}`,
          "YYYY-MM-DD HH:mm:ss",
          timezone
        );

        const timeSlots = await fetchTimeSlotsForRange(
          openingTime,
          closingTime
        );

        for (const timeSlot of timeSlots) {
          const { id: time_slot_id, time_stamp } = timeSlot;

          try {
            await supabase.from("employee_availability").insert({
              employee_id,
              time_slot_id,
              occupied_booking: null,
              occupied_other: null,
            });
            console.log(
              `Inserted availability for employee ${employee_id} in timeslot ${time_stamp}`
            );
          } catch (error) {
            console.error(
              `Error inserting availability for employee ${employee_id} in timeslot ${time_stamp}:`,
              error
            );
          }
        }
      }

      currentMonthDay.add(1, "day");
    }
  }

  console.log("Employee availability population complete.");
}

// Command-line arguments
const [month, year] = process.argv.slice(2);

if (!month || !year) {
  console.error("Usage: node populateEmployeeAvailability.js <month> <year>");
  process.exit(1);
}

// Execute the function
populateEmployeeAvailability(year, month);
