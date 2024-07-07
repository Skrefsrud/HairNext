require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to update store hours
async function updateStoreHours(
  day_of_week,
  opening_time,
  closing_time,
  is_closed
) {
  try {
    // Find the existing record for the specified day_of_week
    const { data: existingData, error: fetchError } = await supabase
      .from("store_hours")
      .select("*")
      .eq("day_of_week", day_of_week);

    if (fetchError) {
      console.error("Error fetching store hours:", fetchError);
      return;
    }

    if (existingData.length === 0) {
      console.error(`No store hours found for day: ${day_of_week}`);
      return;
    }

    const id = existingData[0].id;

    // Prepare update data
    const updateData = {
      ...(opening_time && { opening_time }),
      ...(closing_time && { closing_time }),
      ...(is_closed !== undefined && { is_closed }),
    };

    console.log("Update data:", updateData);

    // Update the record
    const { data, error } = await supabase
      .from("store_hours")
      .update(updateData)
      .eq("id", id);

    if (error) {
      console.error("Error updating store hours:", error);
    } else {
      console.log(`Store hours updated for ${day_of_week}:`, data);
    }
  } catch (err) {
    console.error("Unexpected error:", err);
  }
}

// Command-line arguments
const [day_of_week, opening_time, closing_time, is_closed] =
  process.argv.slice(2);

// Validate and parse is_closed
const parsed_is_closed =
  is_closed === "true" ? true : is_closed === "false" ? false : undefined;

if (!day_of_week) {
  console.error(
    "Usage: node updateStoreHours.js <day_of_week> [<opening_time>] [<closing_time>] [<is_closed>]"
  );
  process.exit(1);
}

updateStoreHours(day_of_week, opening_time, closing_time, parsed_is_closed);

/*

Update Only the Opening and Closing Times:
node updateStoreHours.js Monday 09:00:00 17:00:00

Update to Closed:
node updateStoreHours.js Sunday "" "" true

Update Opening Time Only:
node updateStoreHours.js Tuesday 10:00:00

Update Closing Time Only:
node updateStoreHours.js Wednesday "" 18:00:00

*/
