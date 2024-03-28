"use server";
import { supabase } from "@/utils/supabase/supabaseClient";
const moment = require("moment-timezone"); // For convenient time handling

export async function populateTimeSlots(month, year) {
  "use server";
  const timezone = "Europe/Oslo";

  const startDateTime = moment.tz(
    `${year}-${month}-01 09:00:00`,
    "YYYY-MM-DD HH:mm:ss",
    timezone
  );
  const endDateTime = startDateTime
    .clone()
    .endOf("month")
    .hour(16)
    .minute(0)
    .second(0);

  let currentDate = startDateTime.clone();

  while (currentDate.isBefore(endDateTime)) {
    if (currentDate.hour() >= 9 && currentDate.hour() < 16) {
      const formattedTimestamp = currentDate.format("YYYY-MM-DD HH:mm:ss");
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
    }

    currentDate.add(15, "minutes");
  }
}

// Specify the month and year you want to populate
const targetMonth = 4; // April (months are zero-indexed)
const targetYear = 2024;

{
  /*  */
}
