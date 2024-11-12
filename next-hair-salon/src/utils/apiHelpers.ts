import { supabase } from "./supabase/supabaseClient";

export function toPostgresInterval(minutes: number | null | undefined) {
  if (minutes === null || minutes === undefined) {
    throw new Error(`toPostgresInterval received invalid minutes: ${minutes}`);
  }

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

interface DeleteResult {
  success: boolean;
  error?: Error;
}

export async function deleteRowById(
  tableName: string,
  id: number
): Promise<DeleteResult> {
  try {
    const { data, error } = await supabase
      .from(tableName) // Use the provided table name
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error(`Error deleting row from ${tableName}:`, error);
    return { success: false, error };
  }
}

export function removeTimeReqSeconds(timeStr) {
  if (typeof timeStr !== "string" || timeStr.length !== 8) {
    throw new Error("Invalid time format. Expected HH:MM:SS format.");
  }

  return timeStr.slice(0, -3); // Remove the last 3 characters (":00")
}
