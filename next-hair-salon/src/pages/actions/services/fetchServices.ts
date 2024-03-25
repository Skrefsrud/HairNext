"use server";

import { supabase } from "@/utils/supabase/supabaseClient";
import { createRedisInstance } from "@/utils/redis/redis";
import { redis } from "@/lib/redis";

interface Service {
  id: number;
  name: string;
  price: number;
  description: string;
  time_requirement: string;
}

export async function fetchServices() {
  "use server";

  try {
    const cacheKey = "services";
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      console.log("Fetched from Redis cache");
      return JSON.parse(cachedData);
    }

    const { data, error } = await supabase.from("services").select("*");

    if (error) {
      throw error;
    }

    const services: Service[] = data.map((service) => ({
      ...service,
      time_requirement: formatTimeRequirement(service.time_requirement),
    }));

    await redis.set(cacheKey, JSON.stringify(services));
    console.log("Fetched from database and cached in Redis");
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
