import { supabase } from "@/utils/supabase/supabaseClient";
import type { NextApiRequest, NextApiResponse } from "next";

interface StoreHour {
  id: number;
  day_of_week: string;
  is_closed: boolean;
  opening_time: string;
  closing_time: string;
}

export default async function fetchStoreHours(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Fetch store hours from the Supabase database
    const { data, error } = await supabase.from("store_hours").select("*");

    // Handle potential errors
    if (error) {
      console.error("Error fetching store hours:", error);
      return res.status(500).json({ error: "Failed to fetch store hours" });
    }

    // Send the store hours data in the response
    return res.status(200).json(data as StoreHour[]);
  } catch (err) {
    console.error("Unexpected error fetching store hours:", err);
    return res.status(500).json({ error: "Unexpected server error" });
  }
}
