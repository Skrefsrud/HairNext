"use server";
import { supabase } from "@/utils/supabase/supabaseClient";
const moment = require("moment-timezone"); // For convenient time handling

// Fetch store hours
async function fetchStoreHours() {
  const { data, error } = await supabase.from("store_hours").select("*");
  if (error) {
    console.error("Error fetching store hours:", error);
    return [];
  }
  console.log(data);
  return data;
}

// Delete existing time slots for the specified month and year
async function deleteExistingTimeSlots(month, year) {
  const timezone = "Europe/Oslo";
  const startOfMonth = moment.tz(
    `${year}-${month}-01 00:00:00`,
    "YYYY-MM-DD HH:mm:ss",
    timezone
  );
  const endOfMonth = startOfMonth.clone().endOf("month").endOf("day");

  const { error } = await supabase
    .from("time_slot")
    .delete()
    .gte("time_stamp", startOfMonth.format())
    .lte("time_stamp", endOfMonth.format());

  if (error) {
    console.error("Error deleting existing time slots:", error);
  }
}

export async function populateTimeSlots(month, year) {
  const timezone = "Europe/Oslo";
  await deleteExistingTimeSlots(month, year); // Remove existing time slots

  const storeHours = await fetchStoreHours();

  if (!storeHours.length) {
    console.error("No store hours data found.");
    return;
  }

  const startDateTime = moment.tz(
    `${year}-${month}-01 00:00:00`,
    "YYYY-MM-DD HH:mm:ss",
    timezone
  );
  const endDateTime = startDateTime.clone().endOf("month");

  let currentDate = startDateTime.clone();

  while (currentDate.isBefore(endDateTime)) {
    const dayOfWeek = currentDate.format("dddd"); // Get the current day of the week (e.g., 'Monday')
    const hours = storeHours.find((sh) => sh.day_of_week === dayOfWeek);

    if (hours && !hours.is_closed) {
      const openingTime = moment.tz(
        `${currentDate.format("YYYY-MM-DD")} ${hours.opening_time}`,
        "YYYY-MM-DD HH:mm:ss",
        timezone
      );
      const closingTime = moment.tz(
        `${currentDate.format("YYYY-MM-DD")} ${hours.closing_time}`,
        "YYYY-MM-DD HH:mm:ss",
        timezone
      );

      let slotTime = openingTime.clone();

      while (slotTime.isBefore(closingTime)) {
        const formattedTimestamp = slotTime.format("YYYY-MM-DD HH:mm:ss");
        console.log(formattedTimestamp);
        try {
          const { error } = await supabase
            .from("time_slot")
            .insert({ time_stamp: formattedTimestamp });

          if (error) throw error;

          console.log(`Inserted: ${formattedTimestamp}`);
        } catch (error) {
          console.error("Error inserting timestamp:", error);
        }

        slotTime.add(15, "minutes");
      }
    }

    currentDate.add(1, "days").startOf("day"); // Move to the next day
  }
}
