// routes/testimonialRoutes.js
import express from "express";
import {
    createTestimonial,
    getAllTestimonials,
    getTestimonialById,
    updateTestimonial,
    deleteTestimonial
} from "../controller/testimonial.controller.js"; // Adjust path as needed
import { upload } from "../middleware/multer.js"; // Adjust path to your Cloudinary middleware

const router = express.Router();

// --- Testimonial CRUD Routes ---

/**
 * @route   POST /api/v1/testimonials/create
 * @desc    Create a new testimonial (uploads video)
 * @access  Private (Admin) - Assuming authentication middleware runs before this
 */
router.post(
    "/create",
    // Middleware to upload 'testimonialVideo' field to Cloudinary
    upload.single('testimonialVideo'),
    createTestimonial
);

/**
 * @route   GET /api/v1/testimonials
 * @desc    Get all testimonials
 * @access  Public or Private (depending on your needs)
 */
router.get("/", getAllTestimonials);

/**
 * @route   GET /api/v1/testimonials/:id
 * @desc    Get a single testimonial by its ID
 * @access  Public or Private
 */
router.get("/:id", getTestimonialById);

/**
 * @route   PUT /api/v1/testimonials/:id
 * @desc    Update a testimonial (optionally upload a new video)
 * @access  Private (Admin)
 */
router.put(
    "/:id",
    // Middleware handles optional new video upload
    upload.single('testimonialVideo'),
    updateTestimonial
);

/**
 * @route   DELETE /api/v1/testimonials/:id
 * @desc    Delete a testimonial (also deletes video from Cloudinary)
 * @access  Private (Admin)
 */
router.delete("/:id", deleteTestimonial);


// Export the router
export default router;

