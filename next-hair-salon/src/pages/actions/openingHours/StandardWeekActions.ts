import { supabase } from "@/utils/supabase/supabaseClient";

export const fetchStoreHours = async () => {
  const { data, error } = await supabase.from("store_hours").select("*");
  if (error) {
    console.error("Error fetching store hours:", error);
    return [];
  }
  return data;
};

export const updateStoreHours = async (id, updatedHours) => {
  const { data, error } = await supabase
    .from("store_hours")
    .update(updatedHours)
    .eq("id", id);
  if (error) {
    console.error("Error updating store hours:", error);
    return null;
  }
  return data;
};
