import { createClient } from "@/utils/supabase/server";

export default async function Bookings() {
  const supabase = createClient();
  const { data: bookings } = await supabase
    .from("booking")
    .select("booking_id, date, time")
    .eq("booking_id", 14);

  return <pre>{JSON.stringify(bookings, null, 2)}</pre>;
}
