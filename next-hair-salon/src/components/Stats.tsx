import Image from "next/image";
import avatar1 from "../../public/avatar/avatar1.jpg";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Stats() {
  return (
    <section className='flex justify-center items-center flex-col gap-5'>
      <Carousel className='w-[600px]'>
        <CarouselContent>
          <CarouselItem>
            {/* Avtar with stats */}
            <Card className='flex justify-center items-center flex-col gap-1'>
              <CardHeader className='font-semibold text-lg'>
                Catrine Tassen
              </CardHeader>

              <CardContent className='flex flex-1 shrink flex-col justify-center items-center'>
                <div className='avatar mb-5'>
                  <div className='w-32 rounded '>
                    <Image
                      src={avatar1}
                      alt='Profile Picture'
                      width={256}
                      height={256}
                      layout='fixed'
                      placeholder='blur'
                      className='object-top'
                    />
                  </div>
                </div>
                <div>
                  <div className='stats shadow'>
                    <div className='stat place-items-center'>
                      <div className='stat-value'>482</div>
                      <div className='stat-desc'>Farget hår fra 1. Januar</div>
                    </div>

                    <div className='stat place-items-center'>
                      <div className='stat-value text-secondary'>1,836</div>
                      <div className='stat-desc text-secondary'>
                        Klippet fra 1. Januar
                      </div>
                    </div>

                    <div className='stat place-items-center'>
                      <div className='stat-value'>9 av 10</div>
                      <div className='stat-desc'>Kunder kommer tilbake</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
          <CarouselItem>
            {/* Avtar with stats */}
            <Card className='flex justify-center items-center flex-col gap-1'>
              <CardHeader className='font-semibold text-lg'>
                Catrine Tassen
              </CardHeader>

              <CardContent className='flex flex-1 shrink flex-col justify-center items-center'>
                <div className='avatar mb-5'>
                  <div className='w-32 rounded '>
                    <Image
                      src={avatar1}
                      alt='Profile Picture'
                      width={256}
                      height={256}
                      layout='fixed'
                      placeholder='blur'
                      className='object-top'
                    />
                  </div>
                </div>
                <div>
                  <div className='stats shadow'>
                    <div className='stat place-items-center'>
                      <div className='stat-value'>482</div>
                      <div className='stat-desc'>Farget hår fra 1. Januar</div>
                    </div>

                    <div className='stat place-items-center'>
                      <div className='stat-value text-secondary'>1,836</div>
                      <div className='stat-desc text-secondary'>
                        Klippet fra 1. Januar
                      </div>
                    </div>

                    <div className='stat place-items-center'>
                      <div className='stat-value'>9 av 10</div>
                      <div className='stat-desc'>Kunder kommer tilbake</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
          <CarouselItem>
            {/* Avtar with stats */}
            <Card className='flex justify-center items-center flex-col gap-1'>
              <CardHeader className='font-semibold text-lg'>
                Catrine Tassen
              </CardHeader>

              <CardContent className='flex flex-1 shrink flex-col justify-center items-center'>
                <div className='avatar mb-5'>
                  <div className='w-32 rounded '>
                    <Image
                      src={avatar1}
                      alt='Profile Picture'
                      width={256}
                      height={256}
                      layout='fixed'
                      placeholder='blur'
                      className='object-top'
                    />
                  </div>
                </div>
                <div>
                  <div className='stats shadow'>
                    <div className='stat place-items-center'>
                      <div className='stat-value'>482</div>
                      <div className='stat-desc'>Farget hår fra 1. Januar</div>
                    </div>

                    <div className='stat place-items-center'>
                      <div className='stat-value text-secondary'>1,836</div>
                      <div className='stat-desc text-secondary'>
                        Klippet fra 1. Januar
                      </div>
                    </div>

                    <div className='stat place-items-center'>
                      <div className='stat-value'>9 av 10</div>
                      <div className='stat-desc'>Kunder kommer tilbake</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}
