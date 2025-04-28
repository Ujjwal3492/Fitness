// controllers/testimonial.controller.js
import Testimonial from "../models/Testimonial.js"; // Adjust path as needed
import mongoose from "mongoose";
import { uploadONcloud, deleteFromCloud } from "../utils/Cloudinary.js"; // Import your Cloudinary utilities
import { v2 as cloudinary } from "cloudinary"; // Import cloudinary instance for destroy options

/**
 * @desc    Create a new testimonial
 * @route   POST /api/v1/testimonials/create
 * @access  Private (Admin)
 */
export const createTestimonial = async (req, res) => {
  const { name, designation } = req.body;
  let cloudinaryResponse = null; // To store response from Cloudinary upload

  // 1. Check if multer provided a local file path
  if (!req.file || !req.file.path) {
    // Note: Ensure your multer middleware saves locally first
    return res.status(400).json({ message: "Testimonial video file is required." });
  }

  const localFilePath = req.file.path;

  // Basic validation before attempting upload
  if (!name || !designation) {
    // If fields are missing, don't proceed with upload (utility handles local file deletion)
    // The uploadONcloud function will delete the local file even if not called,
    // because the try/catch block in the utility might be triggered if localFilePath exists but isn't uploaded.
    // It's safer to let the utility handle cleanup if multer already created the file.
    console.log("Validation failed: Name or designation missing. Local file cleanup handled by Cloudinary util if file exists.");
    return res.status(400).json({ message: "Name and designation are required." });
  }


  try {
    // 2. Upload the locally saved file to Cloudinary
    cloudinaryResponse = await uploadONcloud(localFilePath);

    // 3. Check if upload was successful
    if (!cloudinaryResponse || !cloudinaryResponse.public_id) {
      // uploadONcloud returns null on failure and handles local file cleanup
      console.error("Cloudinary upload failed or response missing public_id.");
      return res.status(500).json({ message: "Server error: Failed to upload video to cloud storage." });
    }

    // 4. Extract details from Cloudinary response
    const videoUrl = cloudinaryResponse.secure_url;
    const cloudinaryPublicId = cloudinaryResponse.public_id;

    // 5. Create and save the testimonial document
    const newTestimonial = new Testimonial({
      name,
      designation,
      videoUrl,
      cloudinaryPublicId,
    });

    const savedTestimonial = await newTestimonial.save();

    res.status(201).json({
        message: "Testimonial created successfully!",
        testimonial: savedTestimonial
    });

  } catch (error) {
    console.error("Error during testimonial creation process:", error);

    // If DB save fails AFTER successful Cloudinary upload, attempt to delete from Cloudinary
    if (cloudinaryResponse && cloudinaryResponse.public_id) {
      console.warn(`Database save failed after Cloudinary upload. Attempting to delete uploaded video: ${cloudinaryResponse.public_id}`);
      try {
          // Call destroy directly here or use your utility
          await cloudinary.uploader.destroy(cloudinaryResponse.public_id, { resource_type: 'video' });
          console.log(`Successfully deleted orphaned Cloudinary video: ${cloudinaryResponse.public_id}`);
      } catch (cleanupError) {
          console.error(`Failed to delete orphaned Cloudinary video (${cloudinaryResponse.public_id}):`, cleanupError);
      }
      // Note: deleteFromCloud utility could be used here too if preferred:
      // await deleteFromCloud(cloudinaryResponse.public_id);
    }

    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: "Validation failed", errors: error.errors });
    }
    res.status(500).json({ message: "Server error creating testimonial.", error: error.message });
  }
};

/**
 * @desc    Get all testimonials
 * @route   GET /api/v1/testimonials
 * @access  Public/Private
 */
export const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.status(200).json(testimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    res.status(500).json({ message: "Server error fetching testimonials.", error: error.message });
  }
};

/**
 * @desc    Get a single testimonial by ID
 * @route   GET /api/v1/testimonials/:id
 * @access  Public/Private
 */
export const getTestimonialById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid testimonial ID format." });
  }

  try {
    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found." });
    }
    res.status(200).json(testimonial);
  } catch (error) {
    console.error(`Error fetching testimonial with ID ${id}:`, error);
    res.status(500).json({ message: "Server error fetching testimonial.", error: error.message });
  }
};

/**
 * @desc    Update a testimonial
 * @route   PUT /api/v1/testimonials/:id
 * @access  Private (Admin)
 */
export const updateTestimonial = async (req, res) => {
  const { id } = req.params;
  const { name, designation } = req.body;
  let newCloudinaryResponse = null; // To store response if new video is uploaded

  if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid testimonial ID format." });
  }

  try {
    // Find the existing testimonial first
    const existingTestimonial = await Testimonial.findById(id);
    if (!existingTestimonial) {
      // If a new file was potentially uploaded locally but testimonial doesn't exist,
      // the uploadONcloud utility (if called later) would handle cleanup.
      // If multer middleware failed before controller, req.file might not exist.
      console.log(`Update failed: Testimonial with ID ${id} not found.`);
      return res.status(404).json({ message: "Testimonial not found." });
    }

    const oldPublicId = existingTestimonial.cloudinaryPublicId;
    const updateData = {};
    if (name) updateData.name = name;
    if (designation) updateData.designation = designation;

    // Check if a new video file was uploaded locally by multer
    if (req.file && req.file.path) {
        const localFilePath = req.file.path;

        // Upload the new video
        newCloudinaryResponse = await uploadONcloud(localFilePath);

        if (!newCloudinaryResponse || !newCloudinaryResponse.public_id) {
            // Upload failed, utility handles local file cleanup
            console.error("Cloudinary upload failed during update.");
            return res.status(500).json({ message: "Server error: Failed to upload new video." });
        }

        // Assign new video details
        updateData.videoUrl = newCloudinaryResponse.secure_url;
        updateData.cloudinaryPublicId = newCloudinaryResponse.public_id;

        // Attempt to delete the OLD video from Cloudinary
        if (oldPublicId && oldPublicId !== newCloudinaryResponse.public_id) {
            console.log(`Attempting to delete old Cloudinary video: ${oldPublicId}`);
            try {
                // Call destroy directly to specify resource_type
                await cloudinary.uploader.destroy(oldPublicId, { resource_type: 'video' });
                console.log(`Successfully deleted old Cloudinary video: ${oldPublicId}`);
                // Or use your utility: await deleteFromCloud(oldPublicId);
                // Note: Your deleteFromCloud doesn't specify resource_type, which is risky.
            } catch (deleteError) {
                // Log failure but continue update - maybe the old file was already deleted
                console.warn(`Failed to delete old Cloudinary video (${oldPublicId}), continuing update. Error: ${deleteError.message}`);
            }
        }
    }

    // Perform the update in the database
    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
    );

    if (!updatedTestimonial) {
        // This case might occur if the document was deleted between findById and findByIdAndUpdate
         if (newCloudinaryResponse && newCloudinaryResponse.public_id) {
             // If update failed after new upload, try deleting the NEW video
             console.warn(`DB update failed after new Cloudinary upload. Attempting cleanup: ${newCloudinaryResponse.public_id}`);
             try {
                 await cloudinary.uploader.destroy(newCloudinaryResponse.public_id, { resource_type: 'video' });
             } catch (cleanupError) {
                  console.error(`Failed to delete newly uploaded Cloudinary video (${newCloudinaryResponse.public_id}) after DB update failure:`, cleanupError);
             }
         }
        return res.status(404).json({ message: "Testimonial not found during update operation." });
    }

    res.status(200).json({
        message: "Testimonial updated successfully!",
        testimonial: updatedTestimonial
    });

  } catch (error) {
    console.error(`Error updating testimonial with ID ${id}:`, error);
     // If validation fails after new upload, try deleting the NEW video
     if (error.name === 'ValidationError' && newCloudinaryResponse && newCloudinaryResponse.public_id) {
         console.warn(`Validation failed after new Cloudinary upload. Attempting cleanup: ${newCloudinaryResponse.public_id}`);
         try {
             await cloudinary.uploader.destroy(newCloudinaryResponse.public_id, { resource_type: 'video' });
         } catch (cleanupError) {
             console.error(`Failed to delete newly uploaded Cloudinary video (${newCloudinaryResponse.public_id}) after validation failure:`, cleanupError);
         }
     }
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: "Validation failed", errors: error.errors });
    }
    res.status(500).json({ message: "Server error updating testimonial.", error: error.message });
  }
};

/**
 * @desc    Delete a testimonial
 * @route   DELETE /api/v1/testimonials/:id
 * @access  Private (Admin)
 */
export const deleteTestimonial = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid testimonial ID format." });
  }

  try {
    // Find the testimonial first to get the Cloudinary public ID
    const testimonialToDelete = await Testimonial.findById(id);

    if (!testimonialToDelete) {
      return res.status(404).json({ message: "Testimonial not found." });
    }

    const publicId = testimonialToDelete.cloudinaryPublicId;

    // Attempt to delete the video from Cloudinary FIRST
    if (publicId) {
        console.log(`Attempting to delete Cloudinary video: ${publicId}`);
        try {
            // Call destroy directly to specify resource_type
            await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
            console.log(`Successfully deleted Cloudinary video: ${publicId}`);
            // Or use your utility: await deleteFromCloud(publicId);
            // Note: Your deleteFromCloud doesn't specify resource_type, which is risky.
        } catch (deleteError) {
            // Log failure but proceed with DB deletion
             console.warn(`Failed to delete video (${publicId}) from Cloudinary. Proceeding with database deletion. Error: ${deleteError.message}`);
        }
    } else {
        console.warn(`Testimonial ${id} has no Cloudinary public ID to delete.`);
    }


    // Delete the testimonial from the database
    await Testimonial.findByIdAndDelete(id);

    res.status(200).json({ message: "Testimonial deleted successfully." });

  } catch (error) {
    console.error(`Error deleting testimonial with ID ${id}:`, error);
    res.status(500).json({ message: "Server error deleting testimonial.", error: error.message });
  }
};
