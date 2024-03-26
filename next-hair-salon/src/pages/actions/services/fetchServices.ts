"use server";

import { supabase } from "@/utils/supabase/supabaseClient";
import { createRedisInstance } from "@/utils/redis/redis";
import { redis } from "@/lib/redis";
import { cacheService, getServicesFromRedis } from "./redisActions";

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
    const cachedServices = await getServicesFromRedis();
    if (cachedServices) {
      console.log("Found cached services in Redis");
      return cachedServices;
    }

    const { data, error } = await supabase.from("services").select("*");

    if (error) {
      throw error;
    }

    const services: Service[] = formatServices(data);

    services.forEach((service) => {
      console.log("forEach service", service.id);
      addServiceToRedis(service);
    });
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

  return timeStr.slice(0, -3);
}

function formatServices(data) {
  const formattedData = data.map((service) => ({
    ...service,
    time_requirement: formatTimeRequirement(service.time_requirement),
  }));

  return formattedData;
}

async function addServiceToRedis(service: Service) {
  await cacheService(service);
}
