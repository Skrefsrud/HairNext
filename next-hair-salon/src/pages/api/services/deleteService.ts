import { NextApiRequest, NextApiResponse } from "next";
import { deleteRowById } from "@/utils/apiHelpers";
import { removeService } from "@/pages/actions/services/redisActions";

interface DeleteRowResult {
  success: boolean;
  error?: Error;
}

interface Service {
  id: number;
  name: string;
  price: number;
  description: string;
  time_requirement: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { service }: { service: Service } = req.body;

  if (!service || !service.id) {
    res.status(400).json({ error: "Missing or invalid service data" });
    return;
  }

  try {
    console.log("Received service to delete:", req.body);

    const { success, error } = await deleteRowById("services", service.id);

    if (success) {
      callRemoveService(service);
      res.status(200).json({ success: true });
    } else {
      res.status(500).json({ success: false, error: error?.message });
    }
  } catch (error) {
    console.error("Error in API route handler:", error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}

async function callRemoveService(service: Service) {
  await removeService(service);
}
