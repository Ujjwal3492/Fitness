// models/Trainer.js
import mongoose from "mongoose";

const trainerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  profilePicture: { type: String }, // URL of the uploaded image
  cloudinaryPublicId: { type: String }, // Optional for managing image deletion
  location: { type: String },
  experience: { type: String },
  specializations: [{ type: String }],
  qualifications: [{ type: String }],
  philosophy: { type: String },
  corePrinciples: [{ type: String }],
  services: [{ type: String }],
}, { timestamps: true });

const Trainer = mongoose.model('Trainer', trainerSchema);
export default Trainer;
