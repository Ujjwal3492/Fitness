// src/components/ConsultationSection.jsx
import React from 'react';

// Remember to replace this with your actual image path
const backgroundImageUrl = '/S2.jpeg';

const ConsultationSection = () => {
  return (
    // Main container: Full width, minimum screen height, relative for positioning children
    <section className="relative min-h-screen w-full">

      {/* Fixed Background Image & Overlay */}
      {/* This div covers the entire section, handles the fixed background, and adds an overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ backgroundImage: `url(${backgroundImageUrl})` }}
        aria-hidden="true"
      >
        {/* Semi-transparent overlay for text readability */}
        {/* Adjust color (bg-black) and opacity (/50, /75, etc.) as needed */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>


      {/* Scrolling Content Area (Now Transparent) */}
      {/* This div sits above the background/overlay (z-10) and holds the content */}
      {/* 'relative' here ensures it establishes a stacking context */}
      <div className="relative z-10 p-8 md:p-12 lg:p-16 text-white"> {/* Text color changed to white for contrast */}
        {/* Max-width container to keep content readable on wide screens */}
        <div className="max-w-3xl mx-auto"> {/* Increased max-width slightly */}

          {/* Time Awareness Section */}
          <div className="mb-12 text-center"> {/* Centered text */}
            <h1 className="text-4xl md:text-5xl font-bold mb-2">NOW ITS TIME</h1> {/* Removed text-gray-800 */}
            <p className="text-xl text-gray-200 mb-8">Time of Self Awareness</p> {/* Adjusted text color */}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 text-center"> {/* Adjusted grid for potentially more space */}
              {/* Icon 1 */}
              <div className="awareness-icon flex flex-col items-center">
                <div className="icon w-16 h-16 mb-2 rounded-full bg-blue-500/30 backdrop-blur-sm border border-white/20 flex items-center justify-center"> {/* Adjusted icon background */}
                  <svg viewBox="0 0 24 24" className="icon-svg w-8 h-8 text-blue-100"> {/* Adjusted icon color */}
                     <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-100">PERSONAL DEVELOPMENT</p> {/* Adjusted text color */}
              </div>

              {/* Icon 2 */}
               <div className="awareness-icon flex flex-col items-center">
                <div className="icon w-16 h-16 mb-2 rounded-full bg-green-500/30 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="icon-svg w-8 h-8 text-green-100">
                     <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-100">BODY AWARENESS</p>
              </div>

               {/* Icon 3 */}
              <div className="awareness-icon flex flex-col items-center">
                <div className="icon w-16 h-16 mb-2 rounded-full bg-purple-500/30 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                   <svg viewBox="0 0 24 24" className="icon-svg w-8 h-8 text-purple-100">
                     <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-100">HOLISTIC STRENGTH</p>
              </div>

              {/* Icon 4 */}
              <div className="awareness-icon flex flex-col items-center">
                <div className="icon w-16 h-16 mb-2 rounded-full bg-yellow-500/30 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="icon-svg w-8 h-8 text-yellow-100">
                     <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-100">BODY MIND CONNECTION</p>
              </div>

               {/* Icon 5 */}
              <div className="awareness-icon flex flex-col items-center">
                <div className="icon w-16 h-16 mb-2 rounded-full bg-red-500/30 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                   <svg viewBox="0 0 24 24" className="icon-svg w-8 h-8 text-red-100">
                     <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-100">SELF MASTERY</p>
              </div>
            </div>
          </div>

          {/* Consultation Booking Section */}
          {/* Added subtle background, blur, and border for readability */}
          <div className="consultation-booking bg-white/10 backdrop-blur-md border border-white/20 p-6 md:p-8 rounded-xl shadow-lg mt-16">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4 text-center">BOOK YOUR FREE CONSULTATION :)</h2>

            <div className="consultation-card mt-4 text-center">
              <h3 className="text-lg md:text-xl font-medium text-indigo-200 mb-3">TALK TO OUR EXPERTS & START YOUR TRANSFORMATION!</h3> {/* Adjusted text color */}

              <p className="consultation-text text-gray-200 mb-6"> {/* Adjusted text color */}
                NOT SURE WHERE TO BEGIN? OUR EXPERT TRAINERS ARE HERE TO GUIDE YOU! GET A FREE 1-ON-1
                CONSULTATION TO DISCUSS YOUR FITNESS GOALS, DIET PLANS, AND HEALTH IMPROVEMENTS—
                PERSONALIZED JUST FOR YOU.
              </p>

              <div className="consultation-buttons flex flex-col sm:flex-row justify-center gap-4">
                <button className="btn-call px-6 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out font-medium border border-blue-500 hover:border-blue-600">
                  Call Now
                </button>
                <button className="btn-book px-6 py-3 rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200 ease-in-out font-medium border border-green-500 hover:border-green-600">
                  Book Appointment
                </button>
              </div>
            </div>
          </div>

        </div> {/* End max-w-3xl */}
      </div> {/* End Content Area */}

    </section>
  );
};

export default ConsultationSection;