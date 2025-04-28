import React, { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, X, UploadCloud, Loader2 } from "lucide-react"; // Using lucide-react for icons

// --- Configuration ---
// Base URL for your backend API
const API_BASE_URL = "http://192.168.53.7:5000/api/v1/Trainer";
// Extract the origin for constructing full image URLs
const API_ORIGIN = new URL(API_BASE_URL).origin; // Should be http://localhost:5000

// --- Helper Components (InputField, TextareaField, DynamicListField - Copied from your code, assumed correct) ---

const InputField = ({
  label,
  id,
  value,
  onChange,
  type = "text",
  required = false,
  ...props
}) => (
  <div className="mb-4">
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      {...props}
    />
  </div>
);

const TextareaField = ({
  label,
  id,
  value,
  onChange,
  required = false,
  rows = 3,
  ...props
}) => (
  <div className="mb-4">
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      required={required}
      rows={rows}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      {...props}
    />
  </div>
);

const DynamicListField = ({ label, id, values, onChange, placeholder }) => {
  const handleAdd = () => {
    const currentValues = Array.isArray(values) ? values : [];
    onChange({ target: { name: id, value: [...currentValues, ""] } });
  };

  const handleRemove = (index) => {
    const currentValues = Array.isArray(values) ? values : [];
    const newValues = currentValues.filter((_, i) => i !== index);
    onChange({ target: { name: id, value: newValues } });
  };

  const handleChangeItem = (index, event) => {
    const currentValues = Array.isArray(values) ? values : [];
    const newValues = [...currentValues];
    newValues[index] = event.target.value;
    onChange({ target: { name: id, value: newValues } });
  };

  const displayValues = Array.isArray(values) ? values : [];

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {displayValues.map((item, index) => (
        <div key={index} className="flex items-center mb-2">
          <input
            type="text"
            value={item || ""}
            onChange={(e) => handleChangeItem(index, e)}
            placeholder={`${placeholder} #${index + 1}`}
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <button
            type="button"
            onClick={() => handleRemove(index)}
            className="ml-2 p-1 text-red-500 hover:text-red-700"
            aria-label={`Remove ${placeholder}`}
          >
            <X size={18} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAdd}
        className="mt-1 text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
      >
        <Plus size={16} className="mr-1" /> Add {placeholder}
      </button>
    </div>
  );
};


// --- Main Component ---
function TrainerAdmin() {
  // --- State ---
  const [trainers, setTrainers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTrainerId, setCurrentTrainerId] = useState(null);
  const initialFormData = {
    fullName: "",
    location: "",
    experience: "",
    specializations: [],
    qualifications: [],
    philosophy: "",
    corePrinciples: [],
    services: [],
    profilePicture: "", // Stores the *filename* of the existing picture when editing
  };
  const [formData, setFormData] = useState(initialFormData);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);
  const [formError, setFormError] = useState("");

  // --- Initial Data Fetch ---
  const fetchTrainers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    console.log(`Workspaceing trainers from: ${API_BASE_URL}`); // Debugging
    try {
      // FIXED URL: Use the base URL directly for GET all
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: `HTTP error! status: ${response.status}` }));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }
      const data = await response.json();
      console.log("Fetched trainers data:", data); // Debugging
      // Ensure arrays are always arrays and add fallback _id
      setTrainers(
        data.map((t) => ({
          ...t,
          _id: t._id || `temp-id-${Math.random()}`,
          specializations: Array.isArray(t.specializations) ? t.specializations : [],
          qualifications: Array.isArray(t.qualifications) ? t.qualifications : [],
          corePrinciples: Array.isArray(t.corePrinciples) ? t.corePrinciples : [],
          services: Array.isArray(t.services) ? t.services : [],
        }))
      );
    } catch (err) {
      console.error("Failed to fetch trainers:", err);
      setError(
        `Failed to load trainers: ${err.message}. Please ensure the backend is running at ${API_BASE_URL} and the GET route is configured correctly.`
      );
    } finally {
      setIsLoading(false);
    }
  }, []); // No dependencies needed if API_BASE_URL is constant

  useEffect(() => {
    fetchTrainers();
  }, [fetchTrainers]);

  // --- Form Handling ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDynamicListChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setProfilePictureFile(null);
      // ** IMPORTANT: Verify '/temp/' path matches your backend static file serving route **
      const existingImageUrl = isEditing && formData.profilePicture
       ? `${API_ORIGIN}/temp/${formData.profilePicture}` // FIXED: Use correct origin and assumed path
       : null;
      setPreviewImageUrl(existingImageUrl);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setProfilePictureFile(null);
    setPreviewImageUrl(null);
    setCurrentTrainerId(null);
    setIsEditing(false);
    setFormError("");
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (trainer) => {
    resetForm();
    setIsEditing(true);
    setCurrentTrainerId(trainer._id);
    setFormData({
      fullName: trainer.fullName || "",
      location: trainer.location || "",
      experience: trainer.experience || "",
      specializations: Array.isArray(trainer.specializations) ? [...trainer.specializations] : [],
      qualifications: Array.isArray(trainer.qualifications) ? [...trainer.qualifications] : [],
      philosophy: trainer.philosophy || "",
      corePrinciples: Array.isArray(trainer.corePrinciples) ? [...trainer.corePrinciples] : [],
      services: Array.isArray(trainer.services) ? [...trainer.services] : [],
      // Store just the filename/path stored in DB
      profilePicture: trainer.profilePicture || "",
    });

    // ** IMPORTANT: Verify '/temp/' path matches your backend static file serving route **
    const imageUrl = trainer.profilePicture
      ? `${API_ORIGIN}/temp/${trainer.profilePicture}` // FIXED: Use correct origin and assumed path
      : null;
    console.log("Setting preview for existing image:", imageUrl); // Debugging
    setPreviewImageUrl(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  // --- CRUD Operations ---
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError("");

    const data = new FormData();

    // Append all standard fields
    Object.keys(formData).forEach((key) => {
      if (!Array.isArray(formData[key]) && key !== "profilePicture") {
        data.append(key, formData[key] || "");
      }
    });

    // Append array fields correctly
    ["specializations", "qualifications", "corePrinciples", "services"].forEach(
      (key) => {
        if (Array.isArray(formData[key])) {
          formData[key].forEach((item) => {
            if (item) { // Avoid sending empty strings
              data.append(`${key}`, item);
            }
          });
        }
      }
    );

    // Append the new file *only* if one was selected
    if (profilePictureFile) {
      data.append("profilePicture", profilePictureFile);
    }

    // FIXED URLs: Adjust based on backend routes
    const url = isEditing
      ? `${API_BASE_URL}/${currentTrainerId}`   // PUT /api/v1/Trainer/:id
      : `${API_BASE_URL}/create`;             // POST /api/v1/Trainer/create
    const method = isEditing ? "PUT" : "POST";

    console.log(`Submitting to URL: ${url} with Method: ${method}`); // Debugging
    // Optional: Log FormData contents (more complex, needs iteration)
    // for (let [key, value] of data.entries()) {
    //   console.log(`${key}: ${value}`);
    // }

    try {
      const response = await fetch(url, {
        method: method,
        body: data, // FormData handles the Content-Type automatically
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseErr) {
          errorData = { parseErr,message: response.statusText || `HTTP error ${response.status}` };
        }
        console.error("Server error response:", errorData); // Debugging
        throw new Error(errorData.message || `Failed request: ${response.status}`);
      }

      // Success
      await fetchTrainers();
      closeModal();
    } catch (err) {
      console.error(`Failed to ${isEditing ? 'update' : 'add'} trainer:`, err);
      setFormError(err.message || `An unexpected error occurred.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (trainerId) => {
    if (!trainerId || trainerId.startsWith('temp-id')) { // Also check for temporary IDs
      setError("Cannot delete trainer: Invalid ID.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this trainer?")) {
      return;
    }

    setIsLoading(true);
    setError(null);

    // FIXED URL: Adjust based on backend route
    const url = `${API_BASE_URL}/${trainerId}`; // DELETE /api/v1/Trainer/:id
    console.log(`Deleting trainer at URL: ${url}`); // Debugging

    try {
      const response = await fetch(url, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: `HTTP error! status: ${response.status}` }));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      // Success - remove from local state
      setTrainers((prev) => prev.filter((t) => t._id !== trainerId));
    } catch (err) {
      console.error("Failed to delete trainer:", err);
      setError(err.message || "Failed to delete trainer. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Helper to construct image URL ---
  // --- Helper to construct image URL ---
const getImageUrl = (cloudinaryUrl) => { // Rename parameter for clarity
    if (!cloudinaryUrl) {
        // Return placeholder if the DB field is empty or null
        return "https://placehold.co/40x40/e2e8f0/64748b?text=N/A";
    }
    // **FIX:** Directly return the full Cloudinary URL from the database
    return cloudinaryUrl;
};


  // --- Render ---
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 font-sans bg-gray-50 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 border-b pb-2">
        Trainer Management
      </h1>

      {/* Add Trainer Button */}
      <div className="mb-6 text-right">
        <button
          onClick={openAddModal}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
        >
          <Plus size={20} className="mr-2" />
          Add New Trainer
        </button>
      </div>

      {/* Loading Indicator */}
      {isLoading && !isModalOpen && (
          <div className="flex justify-center items-center my-10 p-6 bg-white rounded-lg shadow">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            <span className="ml-3 text-gray-600 text-lg">
              Loading Trainers...
            </span>
          </div>
        )}

      {/* Error Message */}
      {error && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-md relative mb-6 shadow"
          role="alert"
        >
          <strong className="font-bold block">Error:</strong>
          <span className="block sm:inline whitespace-pre-wrap">{error}</span> {/* Allow line breaks in error */}
        </div>
      )}

      {/* Trainers List/Table */}
      {!isLoading && !error && trainers.length === 0 && (
        <div className="text-center text-gray-500 my-10 p-6 bg-white rounded-lg shadow">
          <p className="text-xl mb-4">No trainers found.</p>
          <p>Click "Add New Trainer" to get started!</p>
        </div>
      )}

      {!isLoading && !error && trainers.length > 0 && (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Picture</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Full Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Experience</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Specializations</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {trainers.map((trainer) => (
                  <tr key={trainer._id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        // FIXED: Use helper function with correct origin and assumed path
                        src={getImageUrl(trainer.profilePicture)}
                        alt={`${trainer.fullName || "Trainer"}'s profile`}
                        className="h-10 w-10 rounded-full object-cover border border-gray-200"
                        onError={(e) => {
                           e.target.onerror = null;
                           e.target.src = "https://placehold.co/40x40/e2e8f0/64748b?text=Err";
                           console.warn(`Failed to load image: ${e.target.src.substring(0,100)}...`); // Log truncated URL
                         }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{trainer.fullName || "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{trainer.location || "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{trainer.experience || "N/A"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                      {Array.isArray(trainer.specializations) && trainer.specializations.length > 0
                        ? <span title={trainer.specializations.join(", ")}>{trainer.specializations.join(", ")}</span>
                        : <span className="text-gray-400 italic">None</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditModal(trainer)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3 transition duration-150 ease-in-out p-1 rounded hover:bg-indigo-100"
                        aria-label={`Edit ${trainer.fullName || "trainer"}`}
                        title={`Edit ${trainer.fullName || "trainer"}`}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(trainer._id)}
                        className="text-red-600 hover:text-red-900 transition duration-150 ease-in-out p-1 rounded hover:bg-red-100"
                        disabled={isLoading || !trainer._id || trainer._id.startsWith('temp-id')} // Disable delete during loading or if ID is missing/temporary
                        aria-label={`Delete ${trainer.fullName || "trainer"}`}
                        title={`Delete ${trainer.fullName || "trainer"}`}
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
         <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-800 bg-opacity-75 transition-opacity duration-300 ease-in-out" aria-labelledby="modal-title" role="dialog" aria-modal="true">
           <div className="flex items-end sm:items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
             {/* Background overlay */}
             <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={closeModal}> {/* Close on overlay click */}
               <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
             </div>

             {/* Centering trick */}
             <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

             {/* Modal Panel */}
             <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
               <form onSubmit={handleFormSubmit}>
                 <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                   <div className="sm:flex sm:items-start w-full">
                     <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                       <div className="flex justify-between items-center mb-6 pb-2 border-b">
                         <h3 className="text-xl leading-6 font-semibold text-gray-900" id="modal-title">
                           {isEditing ? "Edit Trainer Profile" : "Add New Trainer"}
                         </h3>
                         <button type="button" onClick={closeModal} className="text-gray-400 hover:text-gray-600" aria-label="Close modal">
                           <X size={24}/>
                         </button>
                       </div>

                       {/* Form Error Message */}
                       {formError && (
                         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md relative mb-4 text-sm shadow-sm" role="alert">
                           <strong className="font-bold">Error: </strong>{formError}
                         </div>
                       )}

                       {/* Form Fields Grid */}
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1"> {/* Reduced gap-y */}
                         {/* Column 1 */}
                         <div className="space-y-4">
                           <InputField label="Full Name" id="fullName" value={formData.fullName} onChange={handleInputChange} required placeholder="Enter trainer's full name" />
                           <InputField label="Location" id="location" value={formData.location} onChange={handleInputChange} required placeholder="e.g., Indore & Online" />
                           <InputField label="Experience" id="experience" value={formData.experience} onChange={handleInputChange} required placeholder="e.g., 6 years" />
                           <TextareaField label="Training Philosophy" id="philosophy" value={formData.philosophy} onChange={handleInputChange} placeholder="Describe the trainer's approach" />

                            {/* Profile Picture Upload */}
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                              <div className="mt-1 flex items-center space-x-4">
                                <span className="inline-block h-16 w-16 rounded-full overflow-hidden bg-gray-100 border border-gray-300">
                                  {previewImageUrl ? (
                                    <img src={previewImageUrl} alt="Profile Preview" className="h-full w-full object-cover" />
                                  ) : (
                                    <svg className="h-full w-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                  )}
                                </span>
                                <div className="flex flex-col">
                                  <label htmlFor="profilePicture" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center">
                                    <UploadCloud size={16} className="mr-2" />
                                    <span>{profilePictureFile ? "Change Image" : "Upload Image"}</span>
                                    <input id="profilePicture" name="profilePicture" type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg, image/jpg, image/webp" />
                                  </label>
                                  {profilePictureFile && (<span className="mt-1 text-xs text-gray-500 truncate max-w-xs">{profilePictureFile.name}</span>)}
                                  {isEditing && !profilePictureFile && formData.profilePicture && (<p className="text-xs text-gray-500 mt-1">Current image will be kept.</p>)}
                                  {!isEditing && !profilePictureFile && (<p className="text-xs text-gray-500 mt-1">No image selected.</p>)}
                                  {(isEditing && formData.profilePicture && profilePictureFile) && (<p className="text-xs text-orange-600 mt-1">New image will replace current.</p>)}
                                </div>
                              </div>
                            </div>
                         </div> {/* End Column 1 */}

                         {/* Column 2 */}
                         <div className="space-y-4">
                           <DynamicListField label="Specializations" id="specializations" values={formData.specializations} onChange={handleDynamicListChange} placeholder="Specialization" />
                           <DynamicListField label="Qualifications" id="qualifications" values={formData.qualifications} onChange={handleDynamicListChange} placeholder="Qualification" />
                           <DynamicListField label="Core Principles" id="corePrinciples" values={formData.corePrinciples} onChange={handleDynamicListChange} placeholder="Principle" />
                           <DynamicListField label="Services Offered" id="services" values={formData.services} onChange={handleDynamicListChange} placeholder="Service" />
                         </div> {/* End Column 2 */}
                       </div> {/* End Grid */}
                     </div>
                   </div>
                 </div>
                 {/* Modal Footer - Actions */}
                 <div className="bg-gray-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
                   <button
                     type="submit"
                     disabled={isLoading}
                     className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-6 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm transition duration-150 ease-in-out ${
                       isLoading ? "opacity-60 cursor-not-allowed" : ""
                     }`}
                   >
                     {isLoading ? (
                       <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                     ) : null}
                     {isEditing ? "Save Changes" : "Create Trainer"}
                   </button>
                   <button
                     type="button"
                     onClick={closeModal}
                     disabled={isLoading}
                     className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-6 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition duration-150 ease-in-out"
                   >
                     Cancel
                   </button>
                 </div>
               </form>
             </div>
           </div>
         </div>
      )}
    </div>
  );
}

export default TrainerAdmin; // Assuming you want to export this component