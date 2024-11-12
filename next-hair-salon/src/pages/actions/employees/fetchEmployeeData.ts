"use server";
import { supabase } from "@/utils/supabase/supabaseClient";
import { redis } from "@/lib/redis";

export async function fetchEmployeeData(employeeId) {
  const cacheKey = `employeeData:${employeeId}`;

  try {
    // 1. Check Redis Cache
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    // 2. Fetch from Supabase
    const { data: standardHours, error: standardHoursError } = await supabase
      .from("standard_hours")
      .select("*, employees (id, first_name, surname)")
      .eq("employee_id", employeeId)
      .range(0, 1);

    if (standardHoursError) {
      throw standardHoursError;
    }

    const { data: availabilities, error: availabilitiesError } = await supabase
      .from("employee_availability")
      .select("*, time_slot (id, time_stamp)")
      .eq("employee_id", employeeId);

    if (availabilitiesError) {
      throw availabilitiesError;
    }

    // 3. Combine results:
    const employeeData = {
      employee: standardHours[0].employee, // Extract relevant employee data
      standardHours: standardHours[0],
      availabilities,
    };

    console.log(employeeData);

    // 4. Store in Redis Cache
    await redis.set(cacheKey, JSON.stringify(employeeData), "EX", 60);

    return employeeData;
  } catch (error) {
    console.error("Error fetching employee data:", error);
    return { error: "Error fetching employee data" }; // Frontend error handling
  }
}
