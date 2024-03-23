import { supabase } from "@/utils/supabase/supabaseClient";
import { toPostgresInterval } from "@/lib/databaseHelpers";

export interface ServiceFormData {
  name: string;
  price: number;
  timeReq: number;
  description: string;
}

export async function insertServiceToSupabase(
  formData: ServiceFormData
): Promise<{ success: boolean; error?: Error }> {
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
      .from("services")
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

    return { success: true, data: data[0] };

    console.log("Service inserted successfully:", data);
  } catch (error) {
    console.error("Error inserting service:", error);
    return { success: false, error };
  }
}

interface DeleteServiceResult {
  success: boolean;
  error?: Error;
}

export async function deleteServiceById(
  id: number
): Promise<DeleteServiceResult> {
  try {
    const { data, error } = await supabase
      .from("services")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting service:", error);
    return { success: false, error };
  }
}
