import { supabase } from "@/utils/supabase/supabaseClient";

export async function insertServiceToSupabase(formData) {
  try {
    const { data, error } = await supabase.from("services").insert([
      {
        name: formData.name,
        price: formData.price,
        description: formData.description,
        time_requirement: toPostgresInterval(formData.timeReq),
      },
    ]);

    if (error) {
      throw error; // Handle the error appropriately
    }

    console.log("Service inserted successfully:", data);
  } catch (error) {
    console.error("Error inserting service:", error);
    // Handle the insertion error (e.g., display an error message to the user)
  }
}

function toPostgresInterval(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  // Construct the interval string
  let intervalString = "";
  if (hours > 0) {
    intervalString += `${hours} hour${hours !== 1 ? "s" : ""} `;
  }
  if (remainingMinutes > 0) {
    intervalString += `${remainingMinutes} minute${
      remainingMinutes !== 1 ? "s" : ""
    }`;
  }

  // If hours and minutes were 0, set interval to '0 minutes'
  return intervalString.trim() || "0 minutes";
}
