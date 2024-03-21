import { supabase } from "@/utils/supabase/supabaseClient";

export async function fetchAvailableDates(
  month: number,
  year: number
): Promise<number[]> {
  try {
    const { data, error } = await supabase.rpc("get_available_dates", {
      target_month: month,
      target_year: year,
    });

    if (error) throw error;
    console.log(data);

    return data;
  } catch (error) {
    console.error("Error fetching dates:", error);
    return [];
  }
}
