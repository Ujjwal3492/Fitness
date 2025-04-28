// src/components/TestimonialAdminPanel.jsx (or similar path)

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, X, UploadCloud, Loader2, AlertTriangle, Video } from 'lucide-react';

// --- Configuration ---
const API_BASE_URL = "http://192.168.53.7:5000/api/v1/testimonials"; // Adjust if your base URL is different

// --- Color Palette ---
// Primary: Saffron #EC7E0B
// Secondary: Dark Charcoal #2C2C2C
// Background: Light Gray #F9F9F9
// Card/Container: White #FFFFFF
// Button Hover: Deep Orange #C45D00 (Approximated with hover:bg-orange-700/hover:text-orange-100)
// Accent: Leaf Green #4CAF50
// Error: Bright Red #FF4C4C
// Border: Light Gray Border #E0E0E0
// Text Primary: Dark Gray #333333
// Text Secondary: Medium Gray #666666

// --- Helper Components ---
// Simple Input Field (Adapt if you have a shared component library)
const InputField = ({ label, id, value, onChange, type = "text", required = false, ...props }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-[#666666] mb-1">
      {label} {required && <span className="text-[#FF4C4C]">*</span>}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-3 py-2 border border-[#E0E0E0] rounded-md shadow-sm focus:outline-none focus:ring-[#EC7E0B] focus:border-[#EC7E0B] sm:text-sm text-[#333333] bg-white disabled:bg-gray-100 disabled:cursor-not-allowed" // Added disabled styles
      {...props}
    />
  </div>
);

// --- Main Admin Panel Component ---
function TestimonialAdminPanel() {
  // --- State ---
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // For list loading & form submission
  const [listError, setListError] = useState(null); // Error fetching list
  const [formError, setFormError] = useState(null); // Error in add/edit form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTestimonialId, setCurrentTestimonialId] = useState(null);

  const initialFormData = {
    name: "",
    designation: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const [testimonialVideoFile, setTestimonialVideoFile] = useState(null); // Stores the File object
  const [existingVideoUrl, setExistingVideoUrl] = useState(null); // To show current video link in edit mode

  // --- Fetch Testimonials ---
  const fetchTestimonials = useCallback(async () => {
    setIsLoading(true); // Set loading true for the fetch operation
    setListError(null);
    console.log(`Fetching testimonials from: ${API_BASE_URL}`);
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP error! Status: ${response.status}` }));
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched testimonials:", data);
      setTestimonials(data);
    } catch (err) {
      console.error("Failed to fetch testimonials:", err);
      setListError(`Failed to load testimonials: ${err.message}. Please check the backend connection.`);
    } finally {
      setIsLoading(false); // Set loading false after fetch completes
    }
  }, []); // Empty dependency array means fetch runs once on mount

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]); // Depend on the memoized fetch function

  // --- Form Handling ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Basic validation (optional: add more specific video type checks like size)
      if (!file.type.startsWith('video/')) {
          setFormError('Invalid file type. Please upload a video file.');
          setTestimonialVideoFile(null); // Clear invalid file
          e.target.value = null; // Reset file input visually
          return;
      }
      setTestimonialVideoFile(file);
      setFormError(null); // Clear previous errors
      console.log("Selected video file:", file.name, file.type);
    } else {
      setTestimonialVideoFile(null);
      console.log("Video file deselected.");
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setTestimonialVideoFile(null);
    setExistingVideoUrl(null);
    setCurrentTestimonialId(null);
    setIsEditing(false);
    setFormError(null);
    // Also reset the file input visually if possible (might require ref)
    const fileInput = document.getElementById('testimonialVideo');
    if (fileInput) {
        fileInput.value = null;
    }
  };

  // --- Modal Handling ---
  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (testimonial) => {
    resetForm();
    setIsEditing(true);
    setCurrentTestimonialId(testimonial._id);
    setFormData({
      name: testimonial.name || "",
      designation: testimonial.designation || "",
    });
    setExistingVideoUrl(testimonial.videoUrl || null); // Store existing video URL for display
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isLoading) return; // Prevent closing while submitting
    setIsModalOpen(false);
    resetForm(); // Reset form state when closing
  };

  // --- API Operations ---

  // CREATE / UPDATE
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Use general loading state for submission
    setFormError(null);

    // Validation
    if (!formData.name || !formData.designation) {
        setFormError("Name and Designation are required.");
        setIsLoading(false);
        return;
    }
    // Require video only when creating, not necessarily when editing
    if (!isEditing && !testimonialVideoFile) {
        setFormError("A video file is required for new testimonials.");
        setIsLoading(false);
        return;
    }

    // Prepare FormData
    const data = new FormData();
    data.append("name", formData.name);
    data.append("designation", formData.designation);

    // Append video file ONLY if one is selected (for create or update)
    if (testimonialVideoFile) {
      // Use the key expected by the backend multer middleware
      data.append("testimonialVideo", testimonialVideoFile);
      console.log("Appending video file to FormData:", testimonialVideoFile.name);
    } else {
        console.log("No new video file selected for submission.");
    }

    // Determine URL and Method
    const url = isEditing
      ? `${API_BASE_URL}/${currentTestimonialId}`
      : `${API_BASE_URL}/create`;
    const method = isEditing ? "PUT" : "POST";

    console.log(`Submitting to URL: ${url} with Method: ${method}`);
    // You can iterate FormData to log contents if needed, but file content won't show directly
    // for (let pair of data.entries()) {
    //    console.log(pair[0]+ ', ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
    // }

    try {
      // Make the API request
      const response = await fetch(url, {
        method: method,
        body: data,
        // DO NOT set 'Content-Type': 'multipart/form-data' manually.
        // The browser sets it correctly with the boundary when using FormData.
      });

      // Always try to parse JSON, even for errors
      const responseData = await response.json();

      if (!response.ok) {
        // Handle server-side errors
        console.error("Server error response:", responseData);
        throw new Error(responseData.message || `Request failed with status ${response.status}`);
      }

      // Success
      console.log("Operation successful:", responseData);
      await fetchTestimonials(); // Refresh the list
      closeModal(); // Close modal on success

    } catch (err) {
      // Handle fetch errors or server errors thrown above
      console.error(`Failed to ${isEditing ? 'update' : 'add'} testimonial:`, err);
      setFormError(err.message || `An unexpected network or server error occurred.`);
    } finally {
      setIsLoading(false); // Stop loading indicator regardless of outcome
    }
  };

  // DELETE
  const handleDelete = async (testimonialId) => {
    if (!testimonialId) {
      setListError("Cannot delete: Invalid ID.");
      return;
    }
    // Simple confirmation dialog
    if (!window.confirm("Are you sure you want to delete this testimonial? This will also delete the associated video and cannot be undone.")) {
      return;
    }

    setIsLoading(true); // Indicate loading during delete
    setListError(null);

    const url = `${API_BASE_URL}/${testimonialId}`;
    console.log(`Deleting testimonial at URL: ${url}`);

    try {
      const response = await fetch(url, { method: "DELETE" });
      const responseData = await response.json().catch(() => null); // Try parsing JSON, ignore if no body

      if (!response.ok) {
         console.error("Server error response:", responseData);
        throw new Error(responseData?.message || `Request failed with status ${response.status}`);
      }

      // Success - refetch list
      console.log("Deletion successful:", responseData);
      await fetchTestimonials();

    } catch (err) {
      console.error("Failed to delete testimonial:", err);
      setListError(err.message || "Failed to delete testimonial. Please try again.");
    } finally {
      setIsLoading(false); // Stop loading indicator
    }
  };


  // --- Render ---
  return (
    // Main container with theme background and font
    <div className="container mx-auto p-4 md:p-6 lg:p-8 font-['Lato'] bg-[#F9F9F9] min-h-screen text-[#333333]">
      {/* Page Title */}
      <h1 className="font-['Oswald'] text-2xl md:text-3xl font-bold mb-6 text-[#2C2C2C] border-b border-[#E0E0E0] pb-2">
        Manage Testimonials
      </h1>

      {/* Add Button */}
      <div className="mb-6 text-right">
        <button
          onClick={openAddModal}
          className="inline-flex items-center px-4 py-2 bg-[#EC7E0B] text-white font-semibold rounded-md shadow-sm hover:bg-[#C45D00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EC7E0B] transition duration-150 ease-in-out"
        >
          <Plus size={20} className="mr-2" />
          Add New Testimonial
        </button>
      </div>

      {/* Loading Indicator for List */}
      {isLoading && !isModalOpen && testimonials.length === 0 && ( // Show only if loading initial list
          <div className="flex justify-center items-center my-10 p-6 bg-white rounded-lg shadow border border-[#E0E0E0]">
            <Loader2 className="h-8 w-8 animate-spin text-[#EC7E0B]" />
            <span className="ml-3 text-[#666666] text-lg">Loading Testimonials...</span>
          </div>
        )}


      {/* List Error Message */}
      {listError && (
        <div className="bg-red-100 border-l-4 border-[#FF4C4C] text-red-700 px-4 py-3 rounded-md relative mb-6 shadow" role="alert">
          <strong className="font-bold block">Error:</strong>
          <span className="block sm:inline whitespace-pre-wrap">{listError}</span>
        </div>
      )}

      {/* Testimonials List/Table */}
      {!isLoading && !listError && testimonials.length === 0 && (
        <div className="text-center text-[#666666] my-10 p-6 bg-white rounded-lg shadow border border-[#E0E0E0]">
          <p className="text-xl mb-4">No testimonials found.</p>
          <p>Click "Add New Testimonial" to create one.</p>
        </div>
      )}

      {!listError && testimonials.length > 0 && (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-[#E0E0E0]">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#E0E0E0]">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-[#666666] uppercase tracking-wider font-['Oswald']">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-[#666666] uppercase tracking-wider font-['Oswald']">Designation</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-[#666666] uppercase tracking-wider font-['Oswald']">Video</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-[#666666] uppercase tracking-wider font-['Oswald']">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#E0E0E0]">
                {testimonials.map((testimonial) => (
                  <tr key={testimonial._id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#333333]">{testimonial.name || "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#666666]">{testimonial.designation || "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#666666]">
                      {testimonial.videoUrl ? (
                        <a
                          href={testimonial.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#EC7E0B] hover:text-[#C45D00] hover:underline inline-flex items-center"
                          title={testimonial.videoUrl} // Show full URL on hover
                        >
                          <Video size={16} className="mr-1.5" /> View Video
                        </a>
                      ) : (
                        <span className="text-gray-400 italic">No video</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditModal(testimonial)}
                        className="text-[#EC7E0B] hover:text-[#C45D00] mr-3 transition duration-150 ease-in-out p-1 rounded hover:bg-orange-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={`Edit ${testimonial.name || "testimonial"}`}
                        title={`Edit ${testimonial.name || "testimonial"}`}
                        disabled={isLoading} // Disable if any operation is loading
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(testimonial._id)}
                        className="text-[#FF4C4C] hover:text-red-800 transition duration-150 ease-in-out p-1 rounded hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading} // Disable delete button while another operation is in progress
                        aria-label={`Delete ${testimonial.name || "testimonial"}`}
                        title={`Delete ${testimonial.name || "testimonial"}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
          // Modal backdrop
          <div className="fixed inset-0 z-50 overflow-y-auto bg-[rgba(0,0,0,0.55)] flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out opacity-100" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            {/* Modal Panel */}
            <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full border border-[#E0E0E0]">
              {/* Close button positioned inside */}
              <button
                  onClick={closeModal}
                  className="absolute top-3 right-3 text-[#666666] hover:text-[#333333] p-1 rounded-full hover:bg-gray-100 z-10 disabled:opacity-50"
                  aria-label="Close modal"
                  disabled={isLoading} // Disable while submitting
              >
                  <X size={20}/>
              </button>
              {/* Form */}
              <form onSubmit={handleFormSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start w-full">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      {/* Modal Title */}
                      <h3 className="text-lg leading-6 font-bold font-['Oswald'] text-[#2C2C2C] mb-4" id="modal-title">
                        {isEditing ? "Edit Testimonial" : "Add New Testimonial"}
                      </h3>

                      {/* Form Error Message */}
                      {formError && (
                        <div className="bg-red-100 border border-[#FF4C4C] text-red-700 px-4 py-2 rounded-md relative mb-4 text-sm shadow-sm" role="alert">
                          <strong className="font-bold">Error: </strong>{formError}
                        </div>
                      )}

                      {/* Form Fields */}
                      <InputField
                        label="Name"
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter person's name"
                        disabled={isLoading}
                      />
                      <InputField
                        label="Designation"
                        id="designation"
                        value={formData.designation}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., Client, CEO"
                        disabled={isLoading}
                      />

                      {/* Video Upload Section */}
                      <div className="mb-4">
                          <label className="block text-sm font-medium text-[#666666] mb-1">
                              Testimonial Video {isEditing ? '(Optional: Upload to replace)' : <span className="text-[#FF4C4C]">*</span>}
                          </label>
                          {/* Display link to current video when editing and no new file is selected */}
                          {isEditing && existingVideoUrl && !testimonialVideoFile && (
                              <div className="mb-2 text-sm text-[#666666]">
                                  Current video: <a href={existingVideoUrl} target="_blank" rel="noopener noreferrer" className="text-[#EC7E0B] hover:underline">View Current</a>
                              </div>
                          )}
                          {/* File Input Area */}
                          <label htmlFor="testimonialVideo" className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-[#E0E0E0] border-dashed rounded-md cursor-pointer ${isLoading ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-[#EC7E0B]'}`}>
                              <div className="space-y-1 text-center">
                                  <UploadCloud className={`mx-auto h-12 w-12 ${isLoading ? 'text-gray-400' : 'text-[#666666]'}`} />
                                  <div className="flex text-sm text-[#666666]">
                                      <span className={`relative font-medium ${isLoading ? 'text-gray-500' : 'text-[#EC7E0B] hover:text-[#C45D00]'}`}>
                                          {/* Dynamically change text based on whether a file is selected */}
                                          <span>{testimonialVideoFile ? 'Change video' : 'Upload a video'}</span>
                                          <input
                                              id="testimonialVideo"
                                              name="testimonialVideo" // This name doesn't directly matter for FormData key, but good practice
                                              type="file"
                                              className="sr-only" // Hide default input
                                              onChange={handleFileChange}
                                              accept="video/*" // Accept any video type
                                              disabled={isLoading}
                                          />
                                      </span>
                                      {!testimonialVideoFile && <p className="pl-1">or drag and drop</p>}
                                  </div>
                                  {/* Display selected file name */}
                                  {testimonialVideoFile ? (
                                    <p className="text-xs text-[#333333] truncate max-w-xs mx-auto pt-1">{testimonialVideoFile.name}</p>
                                  ) : (
                                    <p className="text-xs text-[#666666]">MP4, MOV, AVI, etc.</p>
                                  )}
                              </div>
                          </label>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Modal Footer - Action Buttons */}
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-[#E0E0E0]">
                  <button
                    type="submit"
                    disabled={isLoading} // Disable submit button while loading
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#EC7E0B] text-base font-medium text-white hover:bg-[#C45D00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EC7E0B] sm:ml-3 sm:w-auto sm:text-sm transition duration-150 ease-in-out ${
                      isLoading ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    ) : null}
                    {isEditing ? "Save Changes" : "Create Testimonial"}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={isLoading} // Disable cancel button while loading
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-[#E0E0E0] shadow-sm px-4 py-2 bg-white text-base font-medium text-[#666666] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EC7E0B] sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
      )}
    </div>
  );
}

export default TestimonialAdminPanel;
