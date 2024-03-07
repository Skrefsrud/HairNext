import FloatingImages from "@/components/FloatingImages";
import HeroSection from "@/components/HeroSection";
import SlideInContainer from "@/components/SlideInContainer";
import { BookingForm } from "@/components/booking-form";
import CalendarSelect from "@/components/bookingComponents/CalendarSelect";

export default function Book() {
  return (
    <>
      <section className='flex justify-start mt-10 items-center flex-col w-screen h-screen'>
        <BookingForm></BookingForm>
      </section>
    </>
  );
}
