import React from 'react';
// Remove the CSS import: import './StuckSection.css';

const StuckSection = () => {
  return (
    <section
      className="font-serif text-gray-800 relative overflow-hidden 
                 max-w-[1200px] mx-auto px-6 py-16 
                 sm:px-8 sm:py-16 
                 md:px-8 md:py-24 
                 lg:px-8 lg:py-32" // Base padding (mobile < 480px derived from 768px rule), sm/md (768px), lg (1024px+)
    >
      {/* Top Section */}
      <div className="text-center relative mb-16 md:mb-24">
        <p
          className="text-[1.2rem] sm:text-[1.2rem] lg:text-[1.4rem] leading-[1.8] 
                     max-w-[800px] mx-auto mb-12 text-gray-600 tracking-[0.5px]"
        >
          WE HAVE BECOME SO DISCONNECTED FROM OUR BODY. WE HAVE BECOME SO LIMITED IN
          THE WAY WE MOVE. THE SAME PATTERN OF MOVEMENT. OVER AND OVER AGAIN.
        </p>

        <div
          className="font-bold relative my-12 
                     text-[2rem] sm:text-[2rem] md:text-[2.5rem] lg:text-[3rem]" // Font sizes based on breakpoints
        >
          {/* Animated "DAY AFTER DAY" */}
          <p className="my-[0.8rem] opacity-0 -translate-x-full animate-slideIn">DAY</p>
          <p className="my-[0.8rem] opacity-0 -translate-x-full animate-slideIn [animation-delay:0.2s]">AFTER</p> {/* Using arbitrary delay */}
          <p className="my-[0.8rem] opacity-0 -translate-x-full animate-slideIn [animation-delay:0.4s]">DAY</p> {/* Using arbitrary delay */}
        </div>

        <p
          className="font-semibold my-12 text-[#6B46C1] tracking-[1px] 
                     text-[1.5rem] sm:text-[1.5rem] lg:text-[2rem]" // Font sizes based on breakpoints
        >
          THE RESULT?
        </p>
      </div>

      {/* Middle Section */}
      <div className="text-center relative mb-16 md:mb-24">
        <h2
          className="font-extrabold mb-8 leading-[1.2] 
                     bg-gradient-to-r from-[#6B46C1] to-[#805AD5] bg-clip-text text-transparent 
                     scale-90 opacity-0 animate-scaleIn 
                     text-[2.5rem] sm:text-[2.5rem] md:text-3xl lg:text-[5rem]" // Font sizes based on breakpoints
        >
          WE GET STUCK
        </h2>
        <p
          className="leading-[1.8] text-gray-500 max-w-[700px] mx-auto 
                     text-lg sm:text-lg lg:text-[1.3rem]" // Font sizes based on breakpoints
        >
          WE LIMIT OURSELVES, PHYSICALLY AND<br />
          MENTALLY. WE DIE - WHILE WE ARE STILL ALIVE.
        </p>
      </div>

      {/* Bottom Section */}
      <div
        className="relative grid grid-cols-1 gap-8 items-center mb-16 md:mb-24 
                   md:grid-cols-1 md:gap-8 
                   lg:grid-cols-2 lg:gap-16" // Grid layout changes at lg breakpoint
      >
        {/* Change Text */}
        <div className="text-center lg:text-left"> {/* Center text on mobile/tablet, left align on large */}
          <h2
            className="font-extrabold text-gray-800 leading-[1.2] relative inline-block  
                       text-[2rem] sm:text-[2rem] md:text-[2.5rem] lg:text-[4rem]  // Font sizes
                       after:content-[''] after:absolute after:h-[4px] after:bg-[#6B46C1] 
                       after:w-[100px] after:bottom-[-20px] 
                       after:scale-x-0 after:animate-lineGrow after:[animation-delay:0.6s] 
                       md:after:left-1/2 md:after:-translate-x-1/2 md:after:origin-center // Centered line below 1024px
                       lg:after:left-0 lg:after:translate-x-0 lg:after:origin-left" // Left aligned line >= 1024px
          >
            ITS<br />
            TIME<br />
            FOR<br />
            A<br />
            CHANGE
          </h2>
        </div>

        {/* Image */}
        <div
          className="relative rounded-[20px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.1)] 
                     opacity-0 translate-y-5 animate-fadeInUp [animation-delay:0.4s] group" // Added group for hover effect
        >
          <img
            src="/S1.jpeg" // Make sure this path is correct relative to your public folder or import setup
            alt="Woman in athletic wear"
            className="w-full h-full   z-1000" // Scale on hover of parent 'group'
          />
        </div>
      </div>

      {/* Footer Section */}
      <div
        className="text-center leading-[1.8] max-w-[900px] mx-auto text-gray-600 
                   text-[1.2rem] sm:text-[1.2rem] lg:text-[1.4rem]" // Font sizes
      >
        <p className="my-4 opacity-0 translate-y-5 animate-fadeInUp">
          We are made to move, to jump, to roll, to balance!
        </p>
        <p className="my-4 opacity-0 translate-y-5 animate-fadeInUp [animation-delay:0.2s]">
          We are made to learn and to explore!
        </p>
        <p className="my-4 opacity-0 translate-y-5 animate-fadeInUp [animation-delay:0.4s]">
          We are made to challenge our body and our mind!
        </p>
      </div>
    </section>
  );
};

export default StuckSection;