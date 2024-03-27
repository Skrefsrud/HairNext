import { redis } from "@/lib/redis";

export async function cacheEmployee(employee: Employee) {
  "use server";
  const cacheKey = `employee:${employee.id}`;
  await redis.set(cacheKey, JSON.stringify(employee));
  await redis.lrem("employeeIds", 0, employee.id);
  await redis.rpush("employeeIds", employee.id);
}

export async function removeEmployee(employee: Employee) {
  "use server";
  const cacheKey = `employee:${employee.id}`;
  await redis.del(cacheKey);
  await redis.lrem("employeeIds", 0, employee.id);
}
export async function editEmployee(employee: Employee) {
  "use server";
  const cacheKey = `employee:${employee.id}`;
  await redis.set(cacheKey, JSON.stringify(employee));
}

export async function getEmployeesFromRedis() {
  "use server";
  console.log("calling getEmployeesFromRedis");

  try {
    const employeeIdCount = await redis.llen("employeeIds");
    if (employeeIdCount === 0) {
      return null;
    }

    // Fetch employee IDs
    const employeeIds = await redis.lrange("employeeIds", 0, -1);

    // Fetch employee data based on IDs
    const employees = await Promise.all(
      employeeIds.map(async (id) => {
        const employeeKey = `employee:${id}`;
        let employeeData = await redis.get(employeeKey);

        return JSON.parse(employeeData);
      })
    );

    console.log(employees.length, "employees fetched from Redis");
    return employees;
  } catch (error) {
    console.error("Error fetching employees from Redis:", error);
    return [];
  } finally {
    if (redis.isOpen) {
      redis.disconnect();
    }
  }
}
