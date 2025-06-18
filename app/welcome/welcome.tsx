export function Welcome() {
  return (
    <main className="relative bg-background">
  <div className="absolute inset-0 bg-[url('app\welcome\olga-thelavart-vS3idIiYxX0-unsplash.jpg')] bg-repeat opacity-20 pointer-events-none z-0"></div>
      {/* Top Visual Block */}
        <section className="relative z-10 flex justify-center items-start w-[70%] px-4 py-8 mx-auto gap-8">
        {/* Left Block: Sticky note + image grouped together */}
        <div className="relative">
          {/* Sticky Note */}
          <div className="absolute top-4 -left-15 z-10 bg-[var(--surfaceColor)] p-4 rounded-md shadow-lg rotate-[-3deg] w-fit max-w-xs">
            <h2 className="text-5xl font-headingFont font-bold text-[var(--highlightColor)]">
              Howdy Hey!
            </h2>
          </div>

          {/* Main Image */}
          <img
            src="app/welcome/_MG_8906.JPG"
            alt="This is Supposed to be Trinity Stallworth"
            className="relative w-[40rem] h-auto rounded-lg z-0"
          />
        </div>
        {/* Right overlay: Name & Title */}
        <div className='flex flex-col space-y-4 mt-4'>
          <h3 className="inline-block text-2xl md:text-3xl font-medium font-bodyFont bg-[var(--surfaceColor)] text-[var(--borderColor)] p-2 rounded-md underline decoration-dotted decoration-[var(--highlightColor)]">My name is - </h3>
          <h1 className='inline-block text-4xl md:text-5xl font-headingFont bg-[var(--surfaceColor)] text-[var(--highlightColor)] p-2 rounded-md shadow-[6px_6px_0_0_var(--borderColor)]'>
            Trinity Stallworth
          </h1>
          <h3 className='inline-block text-2xl md:text-3xl font-medium font-bodyFont bg-[var(--surfaceColor)] text-[var(--borderColor)] p-2 rounded-md underline decoration-dotted decoration-[var(--highlightColor)]'>
            I Strive For  -
          </h3>
          <ul className="font-bodyFont text-2xl custom-bullet ml-6 space-y-4 bg-[var(--surfaceColor)] list-none p-2 rounded-md shadow-[6px_6px_0_0_var(--borderColor)]">
            <li className="pl-2 ">lasting, maintainable solutions</li>
            <li className="pl-2">accessible, human-centered design</li>
            <li className="pl-2">continuous learning and meaningful impact</li>
          </ul>
        <button className="font-headingFont font-medium bg-[var(--surfaceColor)] text-[var(--highlightColor)] p-2 rounded-md text-2xl">Would you like to see my bio?</button>  
        </div>
        
      </section>

      {/* Bio Content */}
      <section className='w-[70%] mx-auto p-8 font-bodyFont text-lg leading-relaxed space-y-4'>
        <p>
          A Computer Science graduate with a strong passion for software design and data science.
        </p>
        <p>
          My academic journey began at Allan Hancock College, where I earned an Associate’s degree in Mathematics and Computer Science, and continued at California State University, where I completed my Bachelor’s in Computer Science.
        </p>
        <p>
          My curiosity about virology, biology, and prosthetics was sparked by my love for gaming—particularly the Resident Evil series—which led me to explore how technology can improve lives. That fascination continues to drive my desire to learn and contribute meaningfully to the world around me.
        </p>
        <p>
          I’m always striving to improve my communication skills and stay diligent in documenting my research, because I believe clear thinking and expression are essential to meaningful work.
        </p>
        <p>
          When I’m not coding or studying, you can find me reading, drawing, or spending time with my German Shepherd, Max—a constant reminder of the joy and connection behind the tech we build.
        </p>
      </section>
    </main>
  );
}
