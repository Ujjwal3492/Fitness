// src/components/TestimonialShowcase.jsx (or similar path)

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Loader2, AlertTriangle, ChevronLeft, ChevronRight, PlayCircle } from 'lucide-react';

// --- Configuration ---
const API_BASE_URL = "http://192.168.53.7:5000/api/v1/testimonials"; // Adjust if needed

// --- Color Palette (Dark Theme) ---
// Background: Dark Charcoal #2C2C2C
// Primary Accent: Saffron #EC7E0B
// Card/Container Background: Slightly Lighter Charcoal #3a3a3a
// Text Primary: Light Gray #F9F9F9
// Text Secondary: Medium Gray #A0A0A0
// Button Hover: Deep Orange #C45D00
// Error: Bright Red #FF4C4C
// Border: Medium Gray #666666

// --- Helper: Check if URL is likely YouTube ---
const isYouTubeUrl = (url) => {
    if (!url) return false;
    // Check for common youtube domains
    return url.includes('youtube.com') || url.includes('youtu.be');
};

// --- Helper: Extract YouTube Video ID ---
const getYouTubeID = (url) => {
    if (!isYouTubeUrl(url)) return null;
    // Regex to handle various YouTube URL formats
    const regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|&v(?:i)?=))([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[1].length === 11) ? match[1] : null;
};


// --- Dummy Data with Mixed Links ---
const dummyTestimonials = [
  {
    _id: "dummy-t1",
    name: "Sarah Chen",
    designation: "Marketing Manager",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Replace with a real, short video ID like L_LUpnjgPso
    cloudinaryPublicId: "dummy_video_1",
    createdAt: new Date(Date.now() - 100000).toISOString(),
  },
  {
    _id: "dummy-t2",
    name: "David Lee",
    designation: "Software Engineer",
    videoUrl: "https://res.cloudinary.com/demo/video/upload/w_900,h_1600,c_fill,q_auto/dog.mp4", // Portrait aspect
    cloudinaryPublicId: "dummy_video_2",
     createdAt: new Date(Date.now() - 200000).toISOString(),
  },
  {
    _id: "dummy-t3",
    name: "Maria Garcia",
    designation: "Graphic Designer",
    videoUrl: "https://www.youtube.com/watch?v=o-YBDTqX_ZU", // Replace with a real, short video ID like y83x7MgzWOA
    cloudinaryPublicId: "dummy_video_3",
     createdAt: new Date(Date.now() - 300000).toISOString(),
  },
  {
    _id: "dummy-t4",
    name: "Kenji Tanaka",
    designation: "Product Owner",
    videoUrl: "https://res.cloudinary.com/demo/video/upload/w_900,h_1600,c_fill,q_auto/skate.mp4", // Portrait aspect
    cloudinaryPublicId: "dummy_video_4",
     createdAt: new Date(Date.now() - 400000).toISOString(),
  },
   {
    _id: "dummy-t5",
    name: "Fatima Ahmed",
    designation: "UX Researcher",
    videoUrl: "https://www.youtube.com/watch?v=L_LUpnjgPso", // Replace with a real, short video ID like DHNZeIy4kjs
    cloudinaryPublicId: "dummy_video_5",
     createdAt: new Date(Date.now() - 500000).toISOString(),
  },
  {
    _id: "dummy-t6",
    name: "Ben Carter",
    designation: "Small Business Owner",
    videoUrl: "https://res.cloudinary.com/demo/video/upload/w_900,h_1600,c_fill,q_auto/snow.mp4", // Portrait aspect
    cloudinaryPublicId: "dummy_video_6",
     createdAt: new Date(Date.now() - 600000).toISOString(),
  },
];

// --- Individual Testimonial Video Card ---
function TestimonialVideoCard({ testimonial, isActive }) {
  const isYoutube = isYouTubeUrl(testimonial.videoUrl);
  const youtubeID = isYoutube ? getYouTubeID(testimonial.videoUrl) : null;
  const [showYoutubeVideo, setShowYoutubeVideo] = useState(false);
  const videoRef = useRef(null); // Ref for HTML5 video

  const handlePlayYoutube = () => {
      // Only allow playing the active video
      if (isActive && youtubeID) setShowYoutubeVideo(true);
  };

  // Placeholder style
  const placeholderStyle = {
      background: `linear-gradient(45deg, #3a3a3a, #4a4a4a)`,
  };

  // Pause/hide videos when they become inactive
  useEffect(() => {
      if (!isActive) {
          if (videoRef.current && !videoRef.current.paused) {
              videoRef.current.pause();
          }
          if (showYoutubeVideo) {
              setShowYoutubeVideo(false); // Hide iframe to stop playback
          }
      }
  }, [isActive, showYoutubeVideo]);

  // Reset showYoutubeVideo state if the testimonial source changes (e.g., during navigation)
  // This prevents the iframe from persisting incorrectly when the card content updates
  useEffect(() => {
      setShowYoutubeVideo(false);
  }, [testimonial.videoUrl]);


  return (
    // Apply scaling and opacity based on 'isActive' prop
    // Use flex-shrink-0 to prevent items from shrinking in the flex container
    <div className={`flex-shrink-0 flex flex-col items-center text-center font-['Lato'] w-full transition-all duration-500 ease-in-out ${isActive ? 'scale-100 md:scale-105 opacity-100 z-10' : 'scale-90 opacity-60 z-0'}`}> {/* Adjusted active scale for mobile */}
      {/* Video Container */}
      <div className="relative w-full max-w-[280px] bg-[#3a3a3a] rounded-lg overflow-hidden shadow-xl border border-[#666666] aspect-[9/16]">
        {isYoutube ? (
          // YouTube Logic
          <>
            {showYoutubeVideo && youtubeID && isActive ? ( // Only show iframe if active
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                // Construct valid embed URL
                src={`https://www.youtube.com/embed/$${youtubeID}?autoplay=1&modestbranding=1&rel=0&enablejsapi=1&origin=${window.location.origin}`} // Added origin for safety
                title={testimonial.name || "Testimonial Video"}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            ) : (
              // Show placeholder/play button if inactive or not yet clicked
              <div
                className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer group"
                style={placeholderStyle}
                onClick={handlePlayYoutube}
                role="button"
                aria-label={`Play YouTube testimonial from ${testimonial.name}`}
              >
                <PlayCircle size={64} className={`text-[rgba(255,255,255,0.7)] group-hover:text-white transition-colors duration-200 ${isActive ? 'opacity-100' : 'opacity-70'}`} />
                <span className={`mt-2 text-xs font-semibold ${isActive ? 'text-white' : 'text-[rgba(255,255,255,0.7)]'}`}>
                    {youtubeID ? "Play YouTube Video" : "YouTube Video Unavailable"}
                </span>
              </div>
            )}
          </>
        ) : (
          // Cloudinary / Direct URL Logic
          <>
            {testimonial.videoUrl ? (
              <video
                ref={videoRef}
                key={testimonial.videoUrl} // Force re-render if URL changes
                className="absolute top-0 left-0 w-full h-full object-cover bg-black" // Added bg-black fallback
                src={testimonial.videoUrl}
                controls={isActive} // Show controls only for the active video
                playsInline
                preload="metadata"
                muted={!isActive} // Mute unless active
                loop
                // poster={testimonial.thumbnailUrl} // Optional poster
                onError={(e) => console.error("Video load error:", e)}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              // Placeholder if Cloudinary URL is missing
               <div
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={placeholderStyle}
               >
                 <PlayCircle size={64} className={`text-[rgba(255,255,255,0.7)] ${isActive ? 'opacity-100' : 'opacity-70'}`} />
                 <span className={`mt-2 text-xs font-semibold ${isActive ? 'text-white' : 'text-[rgba(255,255,255,0.7)]'}`}>
                     Video Unavailable
                 </span>
               </div>
            )}
          </>
        )}
      </div>
      {/* Name and Designation */}
      <div className={`mt-4 px-2 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-80'}`}>
        <h4 className="font-['Oswald'] text-lg font-bold text-[#F9F9F9] truncate w-full" title={testimonial.name}>
          {testimonial.name || "Anonymous"}
        </h4>
        <p className="text-sm text-[#A0A0A0] truncate w-full" title={testimonial.designation}>
          {testimonial.designation || "Testimonial"}
        </p>
      </div>
    </div>
  );
}


// --- Main Testimonial Showcase Component ---
function TestimonialShowcase() {
  const [allTestimonials, setAllTestimonials] = useState(dummyTestimonials);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0); // Index of the CENTER item
 // ms - Match CSS duration

  // --- Fetch Real Data ---
  const fetchAndMergeTestimonials = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const fetchedData = await response.json();
      const combined = [...dummyTestimonials, ...fetchedData];
      const uniqueMap = new Map();
      combined.forEach(item => uniqueMap.set(item._id, item));
      const uniqueTestimonials = Array.from(uniqueMap.values());
      uniqueTestimonials.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setAllTestimonials(uniqueTestimonials);
    } catch (err) {
      console.error("Failed to fetch or merge testimonials:", err);
      setError(`Could not load additional testimonials: ${err.message}.`);
      setAllTestimonials(dummyTestimonials);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAndMergeTestimonials();
  }, [fetchAndMergeTestimonials]);

  // --- Carousel Logic ---
  const totalItems = allTestimonials.length;

  // Calculate indices for prev, current, next
  const prevIndex = useMemo(() => (currentIndex - 1 + totalItems) % totalItems, [currentIndex, totalItems]);
  const nextIndex = useMemo(() => (currentIndex + 1) % totalItems, [currentIndex, totalItems]);

  // Get the actual testimonial objects for display
  const currentItem = useMemo(() => totalItems > 0 ? allTestimonials[currentIndex] : null, [allTestimonials, currentIndex, totalItems]);
  const prevItem = useMemo(() => totalItems > 1 ? allTestimonials[prevIndex] : null, [allTestimonials, prevIndex, totalItems]);
  const nextItem = useMemo(() => totalItems > 1 ? allTestimonials[nextIndex] : null, [allTestimonials, nextIndex, totalItems]);


  const handleNext = () => {
    if (totalItems < 2) return;
    setCurrentIndex(nextIndex);
  };

  const handlePrev = () => {
     if (totalItems < 2) return;
    setCurrentIndex(prevIndex);
  };

  // Disable navigation if not enough items
  const disableNavigation = totalItems < 2;

  // --- Render ---
  return (
    <section
        className="py-16 md:py-20 lg:py-24 bg-[#2C2C2C] relative font-['Lato'] overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <h2 className="font-['Oswald'] text-3xl md:text-4xl lg:text-5xl font-bold text-center text-[#F9F9F9] mb-4">
          Hear From Our <span className="text-[#EC7E0B]">Community</span>
        </h2>
        <p className="text-center text-lg text-[#A0A0A0] max-w-2xl mx-auto mb-12 md:mb-16">
          Real stories, real results. See what people are saying.
        </p>

        {/* Loading Indicator */}
        {isLoading && (
            <div className="flex justify-center items-center py-16 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-[#EC7E0B]" />
                <span className="ml-4 text-xl text-[#A0A0A0]">Loading Testimonials...</span>
            </div>
        )}
        {/* Error Message */}
        {error && (
            <div className="max-w-2xl mx-auto bg-red-900 bg-opacity-50 border border-[#FF4C4C] text-red-100 px-4 py-2 rounded-md shadow-sm mb-8 text-center text-sm" role="alert">
                <AlertTriangle className="inline-block h-4 w-4 mr-1.5 align-text-bottom" />
                {error}
            </div>
        )}

        {/* Testimonial Carousel Area */}
        {!isLoading && !error && allTestimonials.length > 0 && (
          // Added min-h for consistent height
          <div className="relative flex items-center justify-center min-h-[550px] md:min-h-[600px]">

            {/* Previous Button - Adjusted positioning for responsiveness */}
            {!disableNavigation && (
                 <button
                    onClick={handlePrev}
                    className="absolute left-0 sm:left-1 md:left-2 lg:left-0 xl:-left-8 top-1/2 transform -translate-y-1/2 z-30 p-2 bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] text-[#EC7E0B] hover:text-[#F9F9F9] rounded-full shadow-md transition duration-150 ease-in-out disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Previous testimonials"
                 >
                    <ChevronLeft size={24} md:size={32} /> {/* Smaller icon on mobile */}
                 </button>
            )}

            {/* Carousel Track - Flex container */}
            {/* On mobile (default), only the current item's container is effectively visible due to parent centering */}
            {/* On md+, the prev/next containers become visible */}
            <div className="flex items-center justify-center w-full max-w-xs md:max-w-4xl lg:max-w-5xl mx-auto overflow-visible">
                 {/* Previous Item Slot - Hidden on mobile, shown md+ */}
                 <div className="w-1/3 flex-shrink-0 justify-center px-1 md:px-4 hidden md:flex"> {/* hidden md:flex */}
                    {prevItem && <TestimonialVideoCard testimonial={prevItem} isActive={false} />}
                 </div>

                 {/* Current Item Slot - Always visible, takes full width on mobile implicitly */}
                 <div className="w-full md:w-1/3 flex-shrink-0 flex justify-center px-1 md:px-4"> {/* Adjusted width logic */}
                    {currentItem && <TestimonialVideoCard testimonial={currentItem} isActive={true} />}
                 </div>

                 {/* Next Item Slot - Hidden on mobile, shown md+ */}
                  <div className="w-1/3 flex-shrink-0 justify-center px-1 md:px-4 hidden md:flex"> {/* hidden md:flex */}
                    {nextItem && <TestimonialVideoCard testimonial={nextItem} isActive={false} />}
                 </div>
            </div>


            {/* Next Button - Adjusted positioning for responsiveness */}
             {!disableNavigation && (
                 <button
                    onClick={handleNext}
                    className="absolute right-0 sm:right-1 md:right-2 lg:right-0 xl:-right-8 top-1/2 transform -translate-y-1/2 z-30 p-2 bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] text-[#EC7E0B] hover:text-[#F9F9F9] rounded-full shadow-md transition duration-150 ease-in-out disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Next testimonials"
                 >
                    <ChevronRight size={24} md:size={32} /> {/* Smaller icon on mobile */}
                 </button>
            )}
          </div>
        )}

        {/* No Testimonials Message */}
        {!isLoading && !error && allTestimonials.length === 0 && (
            <div className="text-center text-[#A0A0A0] py-16">
                <p className="text-2xl mb-2">No testimonials available yet.</p>
                <p>Check back soon!</p>
            </div>
        )}
      </div>
    </section>
  );
}

export default TestimonialShowcase;
