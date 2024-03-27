import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { buttonVariants } from "./ui/button";
import FloatingImages from "./FloatingImages";

export default function HeroSection() {
  return (
    <section key='1' className='w-full py-12 md:py-24 lg:py-32 xl:py-48'>
      <div className='container px-4 md:px-6'>
        <div className=''>
          <div className='flex flex-col justify-center space-y-4'>
            <div className='space-y-2'>
              <h1 className='text-3xl font-bold tracking-tighter sm:text-4xl xl:text-5xl/none font-poppins'>
                Expert Hair Styling — Unleash Your Beauty
              </h1>
              <p className='max-w-[500px] '>
                Let our professionals transform your look. We specialize in
                creating stunning hairstyles that match your personality.
              </p>
            </div>
            <Link href='/book-appointment'>
              <Button className='px-6 py-6 text-lg '>Book Now</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
