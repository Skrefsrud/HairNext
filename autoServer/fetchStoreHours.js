require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchStoreHours() {
  const { data, error } = await supabase.from("store_hours").select("*");
  if (error) {
    console.error("Error fetching store hours:", error);
    return [];
  }
  console.log(data);
  return data;
}

fetchStoreHours();
