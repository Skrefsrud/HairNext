require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const moment = require("moment-timezone");

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchStoreHours() {
  const { data, error } = await supabase.from("store_hours").select("*");
  if (error) {
    console.error("Error fetching store hours:", error);
    return [];
  }
  return data;
}

async function generateTimeSlots(month, year) {
  const timezone = "Europe/Oslo";
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
        console.log(`Inserting: ${formattedTimestamp}`);
        try {
          const { error } = await supabase
            .from("time_slot")
            .insert({ time_stamp: formattedTimestamp });
          if (error) throw error;
        } catch (error) {
          console.error("Error inserting timestamp:", error);
        }
        slotTime.add(15, "minutes");
      }
    }

    currentDate.add(1, "days").startOf("day"); // Move to the next day
  }
  console.log(`Time slots generated for ${month}/${year}`);
}

const [month, year] = process.argv.slice(2);
generateTimeSlots(month, year);
