import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabase/supabaseClient";
import { toPostgresInterval } from "@/utils/apiHelpers";

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  time_requirement: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("updateService API route hit.");
  if (req.method !== "PUT") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const updatedService: Service = req.body;

  if (!updatedService || !updatedService.id) {
    res.status(400).json({ error: "Missing or invalid service data" });
    return;
  }

  try {
    console.log("Received service ID to update:", updatedService);
    const { data, error } = await supabase
      .from("services")
      .update({
        name: updatedService.name,
        price: updatedService.price,
        description: updatedService.description,
        time_requirement: updatedService.time_requirement,
      })
      .eq("id", updatedService.id)
      .select();
    if (error) {
      throw error;
    }

    if (data) {
      res.status(200).json({ success: true });
    } else {
      // Handle the case where no service was updated (e.g., ID not found)
      res.status(404).json({ error: "Service not found" });
    }
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}
