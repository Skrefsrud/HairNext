import { Button } from "@/components/ui/button";
import HeroSection from "@/components/HeroSection";
import Stats from "@/components/Stats";
import FloatingImages from "@/components/FloatingImages";

export default function Home() {
  return (
    <div className='grid grid-cols-8'>
      <div className='col-span-2 flex flex-col items-center justify-center ml-8'>
        <HeroSection></HeroSection>
      </div>
      <div className='col-span-3'>
        <FloatingImages></FloatingImages>
      </div>
    </div>
  );
}
