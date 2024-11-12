require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const moment = require("moment-timezone");

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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
  } else {
    console.log(`Time slots deleted for ${month}/${year}`);
  }
}

const [month, year] = process.argv.slice(2);
deleteExistingTimeSlots(month, year);
