// src/components/TrainerShowcase.jsx (or wherever you place your components)

import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, AlertTriangle, X, MapPin, Star, Award, Zap, BookOpen, Target, ListChecks } from 'lucide-react'; // Using lucide-react for icons

// --- Configuration ---
const API_BASE_URL = "http://192.168.53.7:5000/api/v1/Trainer";

// --- Color Palette ---
// Primary: Saffron #EC7E0B
// Secondary: Dark Charcoal #2C2C2C
// Background: Light Gray #F9F9F9
// Card/Container: White #FFFFFF
// Button Hover: Deep Orange #C45D00
// Accent: Leaf Green #4CAF50
// Error: Bright Red #FF4C4C
// Border: Light Gray Border #E0E0E0
// Text Primary: Dark Gray #333333
// Text Secondary: Medium Gray #666666

// --- Dummy Data ---
const dummyTrainers = [
  {
    _id: "dummy-1",
    fullName: "Alex Rodriguez",
    profilePicture: "https://placehold.co/200x200/EC7E0B/ffffff?text=AR",
    location: "Indore, MP",
    experience: "8 years",
    specializations: ["Weight Loss", "Strength Training", "Functional Fitness"],
    qualifications: ["ACE Certified PT", "CrossFit Level 1"],
    philosophy: "Fitness is a journey, not a destination. I focus on sustainable habits and making exercise enjoyable.",
    corePrinciples: ["Consistency", "Proper Form", "Mind-Muscle Connection"],
    services: ["Personal Training", "Group Classes", "Nutrition Guidance"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "dummy-2",
    fullName: "Priya Sharma",
    profilePicture: "https://placehold.co/200x200/2C2C2C/ffffff?text=PS",
    location: "Online & Indore",
    experience: "5 years",
    specializations: ["Yoga", "Pilates", "Mindfulness"],
    qualifications: ["RYT 500", "Certified Pilates Instructor"],
    philosophy: "Connecting mind, body, and breath to build strength, flexibility, and inner peace.",
    corePrinciples: ["Alignment", "Breathwork", "Present Moment Awareness"],
    services: ["Yoga Sessions (Vinyasa, Hatha)", "Pilates Mat Classes", "Meditation Workshops"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Helper function to safely get the Cloudinary URL or a placeholder.
 */
const getCloudinaryImageUrl = (url, placeholderText = 'Trainer') => {
  if (url && typeof url === 'string' && url.startsWith('http')) {
    return url;
  }
  const text = placeholderText.split(' ').map(n => n[0]).join('') || 'N/A';
  return `https://placehold.co/200x200/EC7E0B/ffffff?text=${encodeURIComponent(text)}`;
};

// --- Utility to format array fields for display ---


// --- Individual Trainer Card Component ---
function TrainerCard({ trainer, onClick }) {
  const imageUrl = getCloudinaryImageUrl(trainer.profilePicture, trainer.fullName);

  return (
    <div
      className="font-['Lato'] relative pt-12 bg-[#FFFFFF] rounded-xl shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98] cursor-pointer border border-[#E0E0E0]"
      onClick={() => onClick(trainer)}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && onClick(trainer)}
      aria-label={`View details for ${trainer.fullName || 'Trainer'}`}
    >
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full overflow-hidden border-4 border-[#FFFFFF] shadow-lg bg-gray-200">
         <img
           src={imageUrl}
           alt={`Profile of ${trainer.fullName || 'Trainer'}`}
           className="w-full h-full object-cover"
           onError={(e) => {
             const errorPlaceholder = `https://placehold.co/200x200/FF4C4C/ffffff?text=Err`;
             if (e.target.src !== errorPlaceholder) {
               e.target.onerror = null;
               e.target.src = errorPlaceholder;
             }
           }}
         />
      </div>
      <div className="p-5 pt-14 text-center flex flex-col flex-grow">
        <h3 className="font-['Oswald'] text-xl font-bold text-[#333333] mb-1 truncate" title={trainer.fullName}>
          {trainer.fullName || "Trainer Name"}
        </h3>
        {trainer.location && (
          <p className="text-sm text-[#666666] font-medium mb-1 flex items-center justify-center">
            <MapPin size={14} className="mr-1.5 flex-shrink-0 text-[#EC7E0B]" />
            {trainer.location}
          </p>
        )}
        {trainer.experience && (
             <p className="text-xs text-[#666666] mb-4">
                Experience: {trainer.experience}
             </p>
        )}
        {trainer.specializations && trainer.specializations.length > 0 && (
          <div className="mt-auto pt-3 border-t border-[#E0E0E0]">
            <p className="text-xs font-semibold text-[#666666] uppercase tracking-wide mb-2">Focus Areas:</p>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {trainer.specializations.slice(0, 3).map((spec, index) => (
                <span
                  key={index}
                  className="bg-orange-100 text-[#EC7E0B] text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap"
                  title={spec}
                >
                  {spec}
                </span>
              ))}
              {trainer.specializations.length > 3 && (
                 <span className="text-xs text-gray-400 self-center ml-1">...</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


// --- Trainer Detail Modal Component ---
function TrainerDetailModal({ trainer, onClose }) {
    const [isClosing, setIsClosing] = useState(false);

    // Conditional return must come AFTER hooks
    useEffect(() => {
        // If trainer becomes null while modal is logically open (but closing animation hasn't finished)
        // ensure we proceed with closing to prevent errors.
        if (!trainer && !isClosing) {
             handleClose();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trainer, isClosing, onClose]); // Added dependencies

    // Early return if trainer is null initially or becomes null and closing starts
    if (!trainer && !isClosing) {
        return null;
    }
    // If trainer becomes null but closing has already started, allow animation to finish
    if (!trainer && isClosing) {
        // Render minimal structure or null during final phase of closing if trainer disappears
        return null;
    }

    // If trainer is valid, proceed with rendering
    const modalImageUrl = getCloudinaryImageUrl(trainer.profilePicture, trainer.fullName);

    // Helper to render a section in the modal
    const renderSection = (title, content, icon = null, isList = false) => {
        if (!content || (isList && (!Array.isArray(content) || content.length === 0))) {
            return null;
        }
        return (
            <div className="mb-5 font-['Lato']">
                <h4 className="font-['Oswald'] text-md font-semibold text-[#EC7E0B] mb-2 flex items-center">
                    {icon && React.createElement(icon, { size: 18, className: "mr-2 flex-shrink-0" })}
                    {title}
                </h4>
                {isList ? (
                     <div className="flex flex-wrap gap-x-2 gap-y-2">
                        {content.map((item, index) => (
                            <span key={index} className="bg-gray-100 text-[#333333] text-sm px-3 py-1 rounded-full border border-[#E0E0E0]">{item}</span>
                        ))}
                     </div>
                ) : (
                    <p className="text-[#333333] text-sm leading-relaxed">{content}</p>
                )}
            </div>
        );
    };

    // Function to handle closing animation and callback
    // Use useCallback to prevent unnecessary re-creation if passed as prop later
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const handleClose = useCallback(() => {
        if (isClosing) return; // Prevent multiple triggers
        setIsClosing(true); // Start exit animation
        setTimeout(onClose, 300); // Call original onClose after animation duration
    }, [isClosing, onClose]); // Added dependencies

    return (
        // Modal Overlay: Use explicit RGBA background, manage opacity via class
        <div
            className={`fixed inset-0 z-[100] overflow-y-auto bg-[rgba(0,0,0,0.55)] flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out ${isClosing ? 'opacity-0' : 'opacity-100'}`} // Set base bg with RGBA (55% black), control overall opacity
            aria-labelledby="trainer-modal-title"
            role="dialog"
            aria-modal="true"
            onClick={handleClose} // Use the memoized handleClose
        >
            {/* Modal Panel: Apply animation class conditionally */}
            <div
                className={`bg-[#FFFFFF] rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row transform transition-all duration-300 ease-out ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100 animate-fade-in-scale'}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Left Side - Image */}
                <div className="w-full md:w-1/3 flex-shrink-0 h-64 md:h-auto bg-gray-100 flex items-center justify-center">
                    <img
                        src={modalImageUrl}
                        alt={`Profile of ${trainer.fullName}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            const errorPlaceholder = `https://placehold.co/200x200/FF4C4C/ffffff?text=Error`;
                            if (e.target.src !== errorPlaceholder) {
                                e.target.onerror = null;
                                e.target.src = errorPlaceholder;
                            }
                        }}
                    />
                </div>

                {/* Right Side - Details */}
                <div className="w-full md:w-2/3 p-6 md:p-8 overflow-y-auto font-['Lato']">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="font-['Oswald'] text-2xl font-bold text-[#2C2C2C]" id="trainer-modal-title">
                                {trainer.fullName}
                            </h3>
                            {trainer.location && (
                                <p className="text-sm text-[#EC7E0B] font-medium mt-1 flex items-center">
                                    <MapPin size={14} className="mr-1.5 flex-shrink-0" />
                                    {trainer.location}
                                </p>
                            )}
                            {trainer.experience && (
                                 <p className="text-xs text-[#666666] mt-1">Experience: {trainer.experience}</p>
                            )}
                        </div>
                        <button
                            onClick={handleClose} // Use the memoized handleClose
                            className="text-[#666666] hover:text-[#333333] transition-colors p-1 rounded-full hover:bg-gray-100"
                            aria-label="Close trainer details"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Sections */}
                    {renderSection("About Me / Philosophy", trainer.philosophy, BookOpen)}
                    {renderSection("Specializations", trainer.specializations, Star, true)}
                    {renderSection("Qualifications", trainer.qualifications, Award, true)}
                    {renderSection("Core Principles", trainer.corePrinciples, Target, true)}
                    {renderSection("Services Offered", trainer.services, ListChecks, true)}

                </div>
            </div>
            {/* Keyframes definition */}
            <style>{`
                @keyframes fade-in-scale {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in-scale {
                    animation: fade-in-scale 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
}


// --- Main Showcase Section Component ---
function TrainerShowcase() {
  const [trainers, setTrainers] = useState(dummyTrainers);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  const fetchTrainersForShowcase = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP error! Status: ${response.status}` }));
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }
      const fetchedData = await response.json();
      const processedFetchedTrainers = fetchedData.map(t => ({
        ...t,
        _id: t._id || `fetched-${Date.now()}-${Math.random()}`,
        specializations: Array.isArray(t.specializations) ? t.specializations.filter(Boolean) : [],
        qualifications: Array.isArray(t.qualifications) ? t.qualifications.filter(Boolean) : [],
        corePrinciples: Array.isArray(t.corePrinciples) ? t.corePrinciples.filter(Boolean) : [],
        services: Array.isArray(t.services) ? t.services.filter(Boolean) : [],
        fullName: t.fullName || "Unnamed Trainer",
        profilePicture: t.profilePicture || null,
        location: t.location || "N/A",
        experience: t.experience || "N/A",
        philosophy: t.philosophy || "No philosophy provided.",
        createdAt: t.createdAt || new Date().toISOString(),
        updatedAt: t.updatedAt || new Date().toISOString(),
      }));
      const combinedTrainers = [...dummyTrainers, ...processedFetchedTrainers];
      const uniqueTrainersMap = new Map();
      combinedTrainers.forEach(trainer => {
        uniqueTrainersMap.set(trainer._id, trainer);
      });
      setTrainers(Array.from(uniqueTrainersMap.values()));
    } catch (err) {
      console.error("Failed to fetch trainers for showcase:", err);
      setError(`Failed to load additional trainers: ${err.message}. Displaying initial list.`);
      setTrainers(dummyTrainers);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrainersForShowcase();
  }, [fetchTrainersForShowcase]);

  // --- Modal Handling ---
  const handleCardClick = (trainer) => {
    setSelectedTrainer(trainer);
    setIsModalOpen(true);
  };

  const handleModalCloseComplete = () => {
      setIsModalOpen(false);
      setSelectedTrainer(null);
  };

   // Close modal on Escape key press
   useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isModalOpen && selectedTrainer) {
          const modalElement = document.querySelector('[role="dialog"][aria-modal="true"]');
          const closeButton = modalElement?.querySelector('button[aria-label="Close trainer details"]');
          closeButton?.click(); // Trigger the modal's internal handleClose
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isModalOpen, selectedTrainer]);


  // --- Render Logic ---
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-[#F9F9F9] relative font-['Lato']">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="font-['Oswald'] text-3xl md:text-4xl lg:text-5xl font-bold text-center text-[#2C2C2C] mb-4">
          Meet Our <span className="text-[#EC7E0B]">Expert Trainers</span>
        </h2>
        <p className="text-center text-lg text-[#666666] max-w-2xl mx-auto mb-12 md:mb-16">
          Dedicated professionals ready to guide you on your fitness journey. Click on a profile to learn more.
        </p>

        {isLoading && (
          <div className="absolute top-8 right-8 flex items-center text-sm text-[#EC7E0B] bg-orange-100 px-3 py-1 rounded-full shadow-sm animate-pulse z-20">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Loading latest trainers...
          </div>
        )}

        {error && !isLoading && (
          <div className="max-w-2xl mx-auto bg-red-50 border border-[#FF4C4C] text-[#FF4C4C] px-4 py-2 rounded-md shadow-sm mb-8 text-center text-sm" role="alert">
             <AlertTriangle className="inline-block h-4 w-4 mr-1.5 align-text-bottom" />
             {error}
          </div>
        )}

        {trainers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 md:gap-x-10 gap-y-16 md:gap-y-20">
            {trainers.map((trainer) => (
              <TrainerCard key={trainer._id} trainer={trainer} onClick={handleCardClick} />
            ))}
          </div>
        ) : (
          !isLoading && <div className="text-center text-[#666666] py-16">
            <p className="text-2xl mb-2">No trainers available at the moment.</p>
            <p>Please check back later!</p>
          </div>
        )}
      </div>

      {/* Render Modal conditionally */}
      {isModalOpen && selectedTrainer && (
          <TrainerDetailModal
              trainer={selectedTrainer}
              onClose={handleModalCloseComplete}
          />
      )}

    </section>
  );
}

export default TrainerShowcase;
