import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    category: { 
        type: String, 
        required: true 
    },
    year: { 
        type: String, 
        required: true 
    },
    location: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    imageUrl: { 
        type: String, 
        required: true 
    },
    imageUrls: {
        type: [String],
        default: []
    },
    isActive: { 
        type: Boolean, 
        default: true 
    }
}, { timestamps: true });

const Project = mongoose.models.projects || mongoose.model("projects", projectSchema);
export default Project;
