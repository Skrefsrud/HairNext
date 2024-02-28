import "@/styles/main.css";

export default function Home() {
  return (
    <main className='main'>
      <div className='mainDiv'>
        <h1 className='bigTitle'>
          <span className='welcomeText'>Welcome</span> to my blog{" "}
        </h1>
        <div className='research'>scroll down to discover</div>
        <div className='line' />
      </div>
    </main>
  );
}
