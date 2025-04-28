// controllers/trainerController.js
import Trainer from "../models/Trainer.js";
import { uploadONcloud, deleteFromCloud } from "../utils/Cloudinary.js";

// Create a trainer
export const createTrainer = async (req, res) => {
  try {
    let trainerData = { ...req.body };

    if (req.file) {
      const uploadResult = await uploadONcloud(req.file.path);
      if (uploadResult) {
        trainerData.profilePicture = uploadResult.secure_url;  // Save only URL in DB
        trainerData.cloudinaryPublicId = uploadResult.public_id; // Save public_id separately (optional)
      } else {
        return res.status(400).json({ error: "Image upload failed" });
      }
    }

    const trainer = new Trainer(trainerData);
    await trainer.save();

    res.status(201).json(trainer);
  } catch (error) {
    console.error("Error creating trainer:", error);
    res.status(400).json({ error: error.message });
  }
};

// Get all trainers
export const getAllTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find();
    res.status(200).json(trainers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single trainer
export const getTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }
    res.status(200).json(trainer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update trainer (with optional profilePicture update)
export const updateTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    let updatedData = { ...req.body };

    if (req.file) {
      // If trainer already has a profile picture (optional if you store cloudinary public_id separately)
      if (trainer.cloudinaryPublicId) {
        await deleteFromCloud(trainer.cloudinaryPublicId);
      }

      const uploadResult = await uploadONcloud(req.file.path);
      if (uploadResult) {
        updatedData.profilePicture = uploadResult.secure_url;
        updatedData.cloudinaryPublicId = uploadResult.public_id;
      }
    }

    const updatedTrainer = await Trainer.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.status(200).json(updatedTrainer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete trainer
export const deleteTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    if (trainer.cloudinaryPublicId) {
      await deleteFromCloud(trainer.cloudinaryPublicId);
    }

    await trainer.deleteOne();
    res.status(200).json({ message: "Trainer deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
