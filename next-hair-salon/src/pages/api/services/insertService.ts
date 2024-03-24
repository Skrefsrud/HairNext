import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabase/supabaseClient";
import { toPostgresInterval } from "@/utils/apiHelpers";

interface SupabaseService {
  id: number;
  name: string;
  price: number;
  description: string;
  time_requirement: string;
}

interface ServiceFormData {
  name: string;
  price: number;
  timeReq: number;
  description: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const formData: ServiceFormData = req.body;

  if (!formData) {
    throw new Error("insertServiceToSupabase was called with null formData");
  }
  if (!formData.name) {
    throw new Error("formData.name is null");
  }
  if (formData.price === null || formData.price === undefined) {
    throw new Error("formData.price is null");
  }
  if (!formData.description) {
    throw new Error("formData.description is null");
  }
  if (formData.timeReq === null || formData.timeReq === undefined) {
    throw new Error("formData.timeReq is null");
  }

  try {
    const { data, error } = await supabase
      .from<SupabaseService>("services")
      .insert([
        {
          name: formData.name,
          price: formData.price,
          description: formData.description,
          time_requirement: toPostgresInterval(formData.timeReq),
        },
      ])
      .select("id, name, price, description, time_requirement");

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error(
        `insertServiceToSupabase response has invalid data: ${data}`
      );
    }

    if (data) {
      res.status(200).json({ success: true, data: data[0] });
    } else {
      console.error("insertServiceToSupabase response has no data");
    }
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}
