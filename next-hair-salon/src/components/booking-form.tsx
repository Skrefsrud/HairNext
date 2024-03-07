"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CalendarSelect from "./bookingComponents/CalendarSelect";
import SlideInContainer from "./SlideInContainer";

export function BookingForm() {
  const handleDateSelection = (selectedDate) => {
    console.log("Selected date:", selectedDate);
  };
  return (
    <div className='bg-white w-1/2 h-2/3'>
      <SlideInContainer>
        <CalendarSelect onSelect={handleDateSelection} />
      </SlideInContainer>
    </div>
  );
}
