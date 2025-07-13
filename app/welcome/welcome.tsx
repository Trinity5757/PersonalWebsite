import { useState } from 'react';
import { polaroids } from './polaroids';

export default function Welcome() {

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentPolaroid = polaroids[currentIndex];

  const handleShuffle = () => {
    setCurrentIndex((prev) => (prev + 1) % polaroids.length);
  };

  return (
    <main className="bg-background pt-16 md:pt-20">
      <div className="absolute inset-0 bg-[url('/app/welcome/olga-thelavart-vS3idIiYxX0-unsplash.jpg')] bg-repeat opacity-50 z-0"></div>

      {/* Top Visual Block */}
      <section className="relative z-10 flex flex-col lg:flex-row justify-center items-center w-[90%] max-w-7xl px-4 py-8 mx-auto gap-8 min-h-[calc(100vh-5rem)]">

        {/* Left Block: Sticky note + image grouped together */}
        <div className="relative w-full lg:w-1/2 max-w-[40rem] mx-auto">
          {/* Sticky Note */}
          <div className="sticky-note absolute top-4 sm:top-8 left-2 sm:left-4 md:left-0 lg:-left-10 xl:-left-[3.75rem] z-10 bg-[var(--surfaceColor)] p-2 sm:p-3 md:p-4 rounded-md shadow-lg rotate-[-3deg] w-fit max-w-[85vw] sm:max-w-xs">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-headingFont font-bold text-[var(--highlightColor)]">
              Welcome!
            </h2>
          </div>

          {/* Main Image */}
          <img
            src="/app/welcome/_MG_8906.JPG"
            alt="Trinity Stallworth should appear here"
            className="relative w-full h-auto rounded-lg z-0 border-[0.25rem] sm:border-[0.4rem] border-[var(--highlightColor)] shadow-[inset_0_0_10px_rgba(0,0,0,0.3)] shadow-lg"
          />
        </div>

        {/* Right overlay: Name & Title */}
        <div className="flex flex-col space-y-4 mt-8 lg:mt-0 lg:ml-8 w-full lg:w-1/2 lg:text-left bg-[var(--backgroundOffset)] p-6 sm:p-8 rounded-lg border border-dashed">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-medium p-1 decoration-[var(--highlightColor)]">
            My Name Is -
          </h3>
          <h1 className='text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-headingFont text-center text-[var(--highlightColor)] p-2 border border-dashed rounded-lg bg-[var(--background)] mx-auto w-fit'>
            Trinity Stallworth
          </h1>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-medium">
            Software Engineer | Accessibility Advocate
          </h3>
          <hr className="border-[var(--highlightColor)] opacity-30" />
          <h3 className='text-xl sm:text-2xl lg:text-3xl font-medium p-1 decoration-[var(--highlightColor)]'>
            I Strive For -
          </h3>
          <ul className="font-bodyFont text-lg sm:text-xl lg:text-2xl custom-bullet ml-4 sm:ml-6 space-y-2 sm:space-y-4 list-none p-2">
            <li className="pl-2">lasting, maintainable solutions</li>
            <li className="pl-2">accessible, human-centered design</li>
            <li className="pl-2">continuous learning and meaningful impact</li>
          </ul>
          <button className="transition-transform active:scale-95 font-[var(--headingFont)] font-medium rounded-md bg-[var(--surfaceColor)] text-[var(--highlightColor)] p-3 sm:p-4 text-lg sm:text-xl lg:text-2xl hover:bg-[var(--highlightColor)] hover:text-[var(--surfaceColor)] focus-visible:outline-2 focus-visible:outline-[var(--highlightColor)] focus-visible:outline-offset-2 mx-auto w-fit">
            Want to know more?
          </button>
        </div>

      </section>

      {/* Bio Content */}
      <section id="bio-section" className="w-[90%] sm:w-[80%] lg:w-[70%] max-w-4xl mx-auto p-6 sm:p-8">
        <div className="polaroid-container relative w-80 h-96 mx-auto cursor-pointer" onClick={handleShuffle}>
          <div className="polaroid absolute inset-0 bg-white rounded-lg shadow-xl transform transition-transform duration-300">
            <div className="polaroid-image h-64 bg-gray-100 rounded-t-lg overflow-hidden">
            </div>
            <div className="polaroid-text p-4 font-bodyFont text-sm leading-relaxed">
              {currentPolaroid.content}
            </div>
            <div className="polaroid-caption text-center font-headingFont text-lg text-[var(--highlightColor)]">
              {currentPolaroid.title}
            </div>
          </div>
        </div>

        <div className="text-center mt-4 text-sm text-[var(--highlightColor)]">
          Click to shuffle • {currentIndex + 1} of {polaroids.length}
        </div>
      </section>
    </main>
  );
}