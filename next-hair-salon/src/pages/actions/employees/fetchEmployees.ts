"use server";
import { supabase } from "@/utils/supabase/supabaseClient";
import { cacheEmployee, getEmployeesFromRedis } from "./redisActions";

interface Employee {
  id: number;
  first_name: string;
  surname: string;
  mobile: string;
  email: string;
  role: string;
}
export async function fetchEmployees() {
  "use server";

  try {
    const cachedEmployees = await getEmployeesFromRedis();
    if (cachedEmployees) {
      console.log("Found cached employees in Redis");
      return cachedEmployees;
    }

    const { data, error } = await supabase.from("employees").select("*");

    if (error) {
      throw new ReferenceError(
        `Error fetching employees from Supabase: ${error.message}`
      );
    }

    if (!data) {
      throw new Error("No data received from Supabase");
    }

    const employees: Employee[] = data.map((employee) => {
      if (!employee) {
        throw new TypeError("Invalid employee: employee is null or undefined");
      }

      return employee;
    });

    employees.forEach((employee) => {
      cacheEmployee(employee);
      console.log("Cached employee:", employee);
    });

    return employees;
  } catch (error) {
    if (error instanceof ReferenceError) {
      console.error("Error fetching employees:", error.message);
    } else {
      console.error("Error fetching employees:", error);
    }

    throw error;
  }
}
