import FloatingImages from "@/components/FloatingImages";
import HeroSection from "@/components/HeroSection";
import SlideInContainer from "@/components/SlideInContainer";
import { BookingForm } from "@/components/booking-form";
import BookingSystemComponent from "@/components/booking-system";
import CalendarSelect from "@/components/bookingComponents/CalendarSelect";
import { fetchEmployees } from "@/pages/actions/employees/fetchEmployees";
import { Employee } from "@/utils/interfaces";

export default async function Book() {
  return (
    <section className="flex justify-start mt-10 items-center flex-col w-screen h-screen">
      <BookingSystemComponent></BookingSystemComponent>
    </section>
  );
}
