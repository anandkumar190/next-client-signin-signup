import mongoose from "mongoose";

const processSchema = new mongoose.Schema({
    phaseNumber: { 
        type: String, 
        required: true 
    }, // e.g., '01', '02', '03'
    phaseTitle: { 
        type: String, 
        required: true 
    },  // e.g., 'CONCEPT DESIGN'
    phaseSubtitle: { 
        type: String, 
        required: true 
    }, // e.g., 'The Vision Phase'
    steps: [{ 
        type: String 
    }], // Array of items: ['Client Briefing', 'Site Analysis', ...]
    order: { 
        type: Number, 
        default: 0 
    }
}, { timestamps: true });

const Process = mongoose.models.processes || mongoose.model("processes", processSchema);
export default Process;
