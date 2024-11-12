"use server";
import { supabase } from "@/utils/supabase/supabaseClient";
import { Employee } from "@/utils/interfaces";

export async function fetchEmployees(): Promise<Employee[]> {
  try {
    const { data, error } = await supabase.from("employees").select("*");

    if (error) {
      throw new Error(
        `Error fetching employees from Supabase: ${error.message}`
      );
    }

    if (!data) {
      throw new Error("No data received from Supabase");
    }

    return data as Employee[];
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
}
