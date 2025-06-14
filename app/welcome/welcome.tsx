

export function Welcome() {
  return (
    // The <> is a react fragment. The react fragment allows the programmer to return multiple elements from a component
    <main >
      <div className='bg-background'>
        <div className='flex justify- between items-start w-70% px-4 py-2 justify-center'>
          <div className="justify-start-safe">
          <h2 className='text-7xl text-[var(--highlightColor)] font-headingFont font-bold'> Howdy Hey!</h2>
          </div>
          <img src= 'app\welcome\_MG_8906.JPG' alt="This is supposed to be Trinity Stallworth" className='position-absolute w-[40rem] h-auto rounded-lg z-0 shadow-[8px_8px_0_0_var(--surfaceColor)]'/>
          <div className='flex flex-col underline decoration-dotted decoration-[var(--highlightColor)]'>
          <h1 className='text-5xl font-headingFont bg-[var(--surfaceColor)] p-2'> I am Trinity Stallworth</h1>
          <h2 className='text-3xl font-headingFont bg-[var(--surfaceColor)] p-2 mt-2'>Software Developer</h2>
          </div>
        </div>
        <div>


          <div className='p-8'>
            <p>A Computer Science graduate with a strong passion for software design and data science.</p>
            <p>My academic journey began at Allan Hancock College, where I earned an Associate’s degree in Mathematics and Computer Science, and continued at California State University, where I completed my Bachelor’s in Computer Science.</p>
            <p>My curiosity about virology, biology, and prosthetics was sparked by my love for gaming—particularly the Resident Evil series—which led me to explore how technology can improve lives. That fascination continues to drive my desire to learn and contribute meaningfully to the world around me.</p>
            <p>I’m always striving to improve my communication skills and stay diligent in documenting my research, because I believe clear thinking and expression are essential to meaningful work.</p>
            <p>When I’m not coding or studying, you can find me reading, drawing, or spending time with my German Shepherd, Max—a constant reminder of the joy and connection behind the tech we build.</p>
          </div>
        </div>
      </div>
    </main>
  );
}