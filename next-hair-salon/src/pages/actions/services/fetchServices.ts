"use server";

import { supabase } from "@/utils/supabase/supabaseClient";

interface Service {
  id: number;
  name: string;
  price: number;
  description: string;
  time_requirement: string;
}

const servicesCache = {}; // In-memory cache object
export async function fetchServices() {
  "use server";
  const cacheKey = "services"; // Key to store data in the cache

  if (servicesCache[cacheKey]) {
    console.log("Serving from cache", servicesCache[cacheKey]);
    return servicesCache[cacheKey]; // Return cached data
  }

  try {
    const { data, error } = await supabase.from("services").select("*");

    if (error) {
      throw error;
    }

    const services: Service[] = data.map((service) => ({
      ...service,
      time_requirement: formatTimeRequirement(service.time_requirement),
    }));

    console.log("fetching Services from Supabase");
    servicesCache[cacheKey] = services;
    return services;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch services");
  }
}

function formatTimeRequirement(timeStr) {
  if (typeof timeStr !== "string" || timeStr.length !== 8) {
    throw new Error("Invalid time format. Expected HH:MM:SS format.");
  }

  return timeStr.slice(0, -3); // Remove the last 3 characters (":00")
}
