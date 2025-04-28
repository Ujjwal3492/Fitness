// routes/trainerRoutes.js
import express from "express";
import { createTrainer, getAllTrainers, getTrainer, updateTrainer, deleteTrainer } from "../controller/Trainer.controller.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

router.post("/create", upload.single('profilePicture'), createTrainer);
router.get("/", getAllTrainers);
router.get("/:id", getTrainer);
router.put("/:id", upload.single('profilePicture'), updateTrainer);
router.delete("/:id", deleteTrainer);


export default router;
