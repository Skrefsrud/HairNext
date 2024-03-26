import { redis } from "@/lib/redis";

export async function cacheService(service: Service) {
  "use server";
  const cacheKey = `service:${service.id}`;
  await redis.set(cacheKey, JSON.stringify(service));
  await redis.lrem("serviceIds", 0, service.id);
  await redis.rpush("serviceIds", service.id);
}

export async function removeService(service: Service) {
  "use server";
  const cacheKey = `service:${service.id}`;
  await redis.del(cacheKey);
  await redis.lrem("serviceIds", 0, service.id);
}

export async function editService(service: Service) {
  "use server";
  const cacheKey = `service:${service.id}`;
  await redis.set(cacheKey, JSON.stringify(service));
}

export async function getServicesFromRedis() {
  "use server";

  try {
    const serviceIdCount = await redis.llen("serviceIds");
    if (serviceIdCount === 0) {
      return null; // Or return an empty array: return [];
    }

    // 2. Fetch service IDs
    const serviceIds = await redis.lrange("serviceIds", 0, -1);

    // 3. Fetch service data based on IDs
    const services = await Promise.all(
      serviceIds.map(async (id) => {
        const serviceKey = `service:${id}`;
        let serviceData = await redis.get(serviceKey);

        return JSON.parse(serviceData);
      })
    );

    console.log(services.length, "services fetched from Redis");
    return services;
  } catch (error) {
    console.error("Error fetching services from Redis:", error);
    // Handle the error appropriately (e.g., return an empty array, throw a custom error)
    return [];
  } finally {
    if (redis.isOpen) {
      redis.disconnect();
    }
  }
}
