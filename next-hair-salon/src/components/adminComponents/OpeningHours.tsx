import React, { useEffect, useState } from "react";
import {
  fetchStoreHours,
  updateStoreHours,
} from "@/pages/actions/openingHours/StandardWeekActions"; // Adjust the import path as necessary
import StandardWeek from "./openingComponents/StandardWeek"; // Adjust the import path as necessary
import { populateTimeSlots } from "@/pages/actions/timeSlots/populateTimeSlots";
import { Button } from "../ui/button";

const OpeningHours = () => {
  const [hours, setHours] = useState([]);

  useEffect(() => {
    const getHours = async () => {
      const storeHours = await fetchStoreHours();
      setHours(storeHours);
    };
    getHours();
  }, []);

  const handleSaveChanges = async () => {
    for (const day of hours) {
      await updateStoreHours(day.id, {
        opening_time: day.opening_time,
        closing_time: day.closing_time,
        is_closed: day.is_closed,
      });
    }
    console.log("Changes saved!");
  };

  const handlePopulateTimeSlots = async () => {
    const targetMonth = 7; // Set this to the desired month
    const targetYear = 2024; // Set this to the desired year
    await populateTimeSlots(targetMonth, targetYear);
    console.log("Time slots populated!");
  };

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-semibold mb-4'>Standard Week</h1>
      {hours.length > 0 ? (
        <StandardWeek hours={hours} setHours={setHours} />
      ) : (
        <p>Loading...</p>
      )}
      <Button onClick={handleSaveChanges} variant={"secondary"}>
        Save Changes
      </Button>

      <Button
        onClick={handlePopulateTimeSlots}
        className='bg-red-500 text-white hover:bg-white hover:text-red-500 border border-red-500 font-bold py-2 px-4 rounded'
      >
        Make the changes to database
      </Button>
    </div>
  );
};

export default OpeningHours;
