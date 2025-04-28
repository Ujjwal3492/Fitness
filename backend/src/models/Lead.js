// lead.model.js
import mongoose from 'mongoose';

// Define the schema for leads/feedback
const leadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phoneNumberHash: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    phoneNumberMasked: {
        type: String,
        required: true,
    },
    lastMessage: {
        type: String,
    },
    source: {
        type: String,
        default: 'WhatsApp',
    },
    receivedAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
    },
});

// Middleware: before save, update updatedAt
leadSchema.pre('save', function(next) {
    if (this.isModified()) {
        this.updatedAt = Date.now();
    }
    next();
});

// Create the model
export const Lead = mongoose.model('Lead', leadSchema);
