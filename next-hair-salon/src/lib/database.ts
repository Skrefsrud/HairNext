import { supabase } from "@/utils/supabase/supabaseClient";
import { toPostgresInterval } from "@/lib/databaseHelpers";

interface ServiceFormData {
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
      .select();

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error(
        `insertServiceToSupabase response has invalid data: ${data}`
      );
    }

    return { success: true };

    console.log("Service inserted successfully:", data);
  } catch (error) {
    console.error("Error inserting service:", error);
    return { success: false, error };
  }
}
