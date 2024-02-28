import Image from "next/image";

function HeroSection() {
  return (
    <section>
      <div className='bg-black text-white py-20'>
        <div className='container mx-auto flex flex-col md:flex-row items-center my-12 md:my-24'>
          <div className='flex flex-col w-full lg:w-1/3 justify-center items-start p-8'>
            <h1 className='text-3xl md:text-5xl p-2 text-yellow-300 tracking-loose'>
              TechFest
            </h1>
            <h2 className='text-3xl md:text-5xl leading-relaxed md:leading-snug mb-2'>
              Space : The Timeless Infinity
            </h2>
            <p className='text-sm md:text-base text-gray-50 mb-4'>
              Explore your favourite events and register now to showcase your
              talent and win exciting prizes.
            </p>
            <a
              href='#'
              className='bg-transparent hover:bg-yellow-300 text-yellow-300 hover:text-black rounded shadow hover:shadow-lg py-2 px-4 border border-yellow-300 hover:border-transparent'
            >
              Explore Now
            </a>
          </div>
          <div className=' lg:w-2/3 justify-center'>
            <div className='h-48 flex flex-wrap content-center justify-evenly gap-20'>
              <div>
                <Image
                  className='inline-block mt-28 hidden xl:block rounded-3xl rotate-12'
                  src='/image1.jpg' // Adjust image path as needed
                  alt='Event Graphics'
                  width={200} //  Set desired width
                  height={200} //  Set desired height
                />
              </div>
              <div>
                <Image
                  className='inline-block mt-24 md:mt-0 p-8 md:p-0 rounded-3xl -rotate-6'
                  src='/image2.jpg' // Adjust image path as needed
                  alt='Event Graphics'
                  width={200} //  Set desired width
                  height={200} //  Set desired height
                />
              </div>
              <div>
                <Image
                  className='inline-block mt-28 hidden lg:block rounded-3xl rotate-6'
                  src='/image3.jpg' // Adjust image path as needed
                  alt='Event Graphics'
                  width={200} //  Set desired width
                  height={200} //  Set desired height
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
