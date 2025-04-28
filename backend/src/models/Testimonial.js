// models/Testimonial.js
import mongoose from "mongoose";

/**
 * Mongoose schema for Testimonial documents.
 */
const testimonialSchema = new mongoose.Schema({
  // Name of the person giving the testimonial
  name: {
    type: String,
    required: [true, "Testimonial name is required."], // Added validation message
    trim: true // Remove leading/trailing whitespace
  },
  // Designation or role of the person (e.g., "Client", "CEO of Xyz")
  designation: {
    type: String,
    required: [true, "Testimonial designation is required."],
    trim: true
  },
  // URL of the video stored on Cloudinary
  videoUrl: {
    type: String,
    required: [true, "Testimonial video URL is required."]
    // Consider adding validation for URL format if needed
  },
  // Public ID of the video file on Cloudinary (used for deletion/management)
  cloudinaryPublicId: {
    type: String,
    required: [true, "Cloudinary Public ID is required for video management."]
  },
  // Optional: Add a field for the thumbnail/poster image URL if you generate one
  // thumbnailUrl: {
  //   type: String
  // },
  // Optional: Add a field for sorting or ordering
  // displayOrder: {
  //   type: Number,
  //   default: 0
  // }
}, {
  // Automatically add createdAt and updatedAt timestamps
  timestamps: true
});

// Create the Mongoose model
const Testimonial = mongoose.model('Testimonial', testimonialSchema);

// Export the model
export default Testimonial;
