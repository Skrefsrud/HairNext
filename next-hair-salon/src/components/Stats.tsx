import Image from "next/image";
export default function Stats() {
  return (
    <section className='flex justify-center'>
      <div className='avatar'>
        <div className='w-24 rounded'></div>
      </div>
      <div className='stats shadow'>
        <div className='stat place-items-center'>
          <div className='stat-value'>482</div>
          <div className='stat-desc'>Farget hår fra 1. Januar</div>
        </div>

        <div className='stat place-items-center'>
          <div className='stat-value text-secondary'>1,836</div>
          <div className='stat-desc text-secondary'>Klippet fra 1. Januar</div>
        </div>

        <div className='stat place-items-center'>
          <div className='stat-value'>9 av 10</div>
          <div className='stat-desc'>Kunder kommer tilbake</div>
        </div>
      </div>
    </section>
  );
}
