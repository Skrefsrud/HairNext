require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const moment = require("moment-timezone");

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Timezone configuration
const timezone = process.env.TIMEZONE;

// Fetch all store hours
async function fetchStoreHours() {
  const { data, error } = await supabase.from("store_hours").select("*");
  if (error) {
    console.error("Error fetching store hours:", error);
    return [];
  }
  return data;
}

// Delete existing timeslots for the specified month and year
async function deleteExistingTimeslots(year, month) {
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
    console.error("Error deleting existing timeslots:", error);
  } else {
    console.log(
      `Deleted timeslots from ${startOfMonth.format()} to ${endOfMonth.format()}`
    );
  }
}

// Generate and insert new timeslots based on store hours for the entire month
async function generateTimeslots(storeHours, year, month) {
  const startDate = moment.tz(`${year}-${month}-01`, "YYYY-MM-DD", timezone);
  const endDate = startDate.clone().endOf("month");

  let currentDate = startDate.clone();

  while (currentDate.isBefore(endDate)) {
    const dayOfWeek = currentDate.format("dddd");
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
        try {
          await supabase
            .from("time_slot")
            .insert({ time_stamp: slotTime.format("YYYY-MM-DD HH:mm:ss") });
          console.log(
            `Inserted timeslot: ${slotTime.format("YYYY-MM-DD HH:mm:ss")}`
          );
        } catch (error) {
          console.error("Error inserting timeslot:", error);
        }
        slotTime.add(15, "minutes");
      }
    }

    currentDate.add(1, "day").startOf("day");
  }
}

// Check if any timeslots in the specified month are linked to employee availability
async function checkTimeslotConnections(year, month) {
  const startOfMonth = moment.tz(
    `${year}-${month}-01 00:00:00`,
    "YYYY-MM-DD HH:mm:ss",
    timezone
  );
  const endOfMonth = startOfMonth.clone().endOf("month").endOf("day");

  // Fetch time_slot ids for the specified month and year
  const { data: timeSlots, error: timeSlotError } = await supabase
    .from("time_slot")
    .select("id")
    .gte("time_stamp", startOfMonth.format())
    .lte("time_stamp", endOfMonth.format());

  if (timeSlotError) {
    console.error("Error fetching timeslots:", timeSlotError);
    return true; // If there's an error, assume there's a connection to prevent any changes
  }

  const timeSlotIds = timeSlots.map((ts) => ts.id);

  if (timeSlotIds.length === 0) {
    return false; // No timeslots found for the specified month and year
  }

  // Check for connections in employee_availability
  const { data: availability, error: availabilityError } = await supabase
    .from("employee_availability")
    .select("time_slot_id")
    .in("time_slot_id", timeSlotIds);

  if (availabilityError) {
    console.error("Error checking timeslot connections:", availabilityError);
    return true; // If there's an error, assume there's a connection to prevent any changes
  }

  return availability.length > 0;
}

async function updateTimeslots(year, month) {
  const hasConnections = await checkTimeslotConnections(year, month);
  if (hasConnections) {
    console.error(
      `Timeslots for ${month}/${year} are linked to employee availability and cannot be updated.`
    );
    return;
  }

  const storeHours = await fetchStoreHours();
  if (!storeHours.length) {
    console.error("No store hours data found.");
    return;
  }

  await deleteExistingTimeslots(year, month);
  await generateTimeslots(storeHours, year, month);

  console.log("Timeslots update complete.");
}

// Command-line arguments
const [month, year] = process.argv.slice(2);

if (!month || !year) {
  console.error("Usage: node updateAllTimeslots.js <month> <year>");
  process.exit(1);
}

updateTimeslots(year, month);
