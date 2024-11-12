"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/supabaseClient";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null); // Clear previous errors

      try {
        const { data, error } = await supabase.from("booking").select("*");

        if (error) throw error; // Handle error appropriately

        setBookings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {isLoading && <p>Loading bookings...</p>}
      {error && <p>Error loading bookings: {error}</p>}

      {!isLoading && !error && (
        <div>
          {bookings.map((booking) => (
            <div key={booking.id}>
              <p>Booking ID: {booking.id}</p>
              {/* Add more relevant data as needed */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Bookings;
