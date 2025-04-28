import React from 'react';
// Remove the CSS import: import './TrainerSection.css';

const Owner = () => {
  // Placeholder URL for fallback or loading state
  const placeholderImage = (width, height, text = 'Placeholder') =>
    `https://placehold.co/${width}x${height}/e2e8f0/cbd5e0?text=${encodeURIComponent(text)}`;

  return (
    <section className="bg-white relative overflow-hidden pt-12 md:pt-16 lg:pt-24"> {/* Adjusted padding-top based on breakpoints */}
      {/* Header Section */}
      <div className="px-6 md:px-8 lg:px-16 mb-8 md:mb-16"> {/* Adjusted padding-x and margin-bottom */}
        <div className="relative pb-4 inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-[100px] after:h-[3px] after:bg-[#6B46C1]"> {/* Underline effect */}
          <h2 className="font-bold text-gray-800 mb-2 
                         text-[2.5rem] md:text-[3rem] lg:text-[3.5rem]"> {/* Responsive font size */}
            ABOUT
          </h2>
          <h3 className="text-gray-500 font-medium 
                         text-[1.8rem] md:text-[2rem] lg:text-[2.5rem]"> {/* Responsive font size */}
            ANSHUL HARDIYA
          </h3>
        </div>
      </div>

      {/* Business Photo Section */}
      <div className="w-full overflow-hidden relative 
                      h-[300px] md:h-[300px] lg:h-[500px]"> {/* Responsive height */}
        <img
          src="https://px-web-images1.pixpa.com/WMByvcYiUcBarYzM3_6S6nnUI5zPf3eh_kX6vLJNLxs/rs:fit:640:0/q:80/aHR0cHM6Ly9waXhwYWNvbS1pbWcucGl4cGEuY29tL2NvbS9hcnRpY2xlcy8xNTE0NTM5MTA4LWxpc3RpbmctcHJpY2luZ2d1aWRlLWxpc3RpbmcuanBn"
          alt="Anshul Hardiya - Professional"
          className="w-full h-full object-cover" // Cover the container
          // Add error handling for the image
          onError={(e) => {
             const target = e.target ; // Type assertion
             target.onerror = null; // Prevent infinite loop
             target.src = placeholderImage(640, 500, 'Professional Photo');
          }}
        />
      </div>

      {/* Content Section (Image + Text) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center 
                      px-6 md:px-8 lg:px-16 
                      gap-12 md:gap-16 lg:gap-24 py-12 md:py-16 lg:py-20"> {/* Responsive grid, padding, gap */}
        
        {/* Left Side - Meditation Image */}
        <div className="overflow-hidden 
                        h-[300px] md:h-[400px] lg:h-[600px]"> {/* Responsive height */}
          <img
            src="https://images.squarespace-cdn.com/content/v1/5f2acb71ac645e641f13e1dc/1598899828997-EHLLVHAGHBZRG26AVYEB/headshot-photography-houston-texas-professional-business-man-in-suit.jpg"
            alt="Anshul Hardiya - Meditation"
            className="w-full h-full object-cover rounded-lg shadow-md" // Cover container, add subtle styling
             // Add error handling for the image
            onError={(e) => {
                const target = e.target ; // Type assertion
                target.onerror = null; // Prevent infinite loop
                target.src = placeholderImage(400, 600, 'Meditation Pose');
            }}
          />
        </div>

        {/* Right Side - Text Content */}
        <div className="flex flex-col justify-center">
          <div className="px-0 md:px-4 lg:px-8"> {/* Responsive padding */}
            <p className="mb-6 text-gray-700 leading-relaxed 
                          text-base md:text-base lg:text-[1.1rem]"> {/* Responsive text size and line height */}
              This training approach blends sports science, strength training, passive stretching, animal
              flow, and martial arts to create a holistic movement system. Rooted in biomechanics
              and mental training, it is designed to optimize performance, enhance mobility,
              and promote overall well-being.
            </p>
            <p className="mb-6 text-gray-700 leading-relaxed 
                          text-base md:text-base lg:text-[1.1rem]">
              With experience working alongside professional athletes, including boxers,
              national-level judokas, and MMA fighters, the focus remains on building strength,
              increasing flexibility, and preventing injuries. Each session is tailored to individual
              needs, ensuring sustainable progress and long-term results.
            </p>
            <p className="text-gray-700 leading-relaxed 
                          text-base md:text-base lg:text-[1.1rem]">
              By combining scientific principles with hands-on expertise, this method goes beyond
              traditional training. It empowers individuals to master their bodies, break limitations, and
              achieve peak physical and mental performance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Owner;
