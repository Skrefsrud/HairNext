import type { NextApiRequest, NextApiResponse } from "next";
import { fetchEmployees } from "@/pages/actions/employees/fetchEmployees";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const employees = await fetchEmployees();
    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
}
