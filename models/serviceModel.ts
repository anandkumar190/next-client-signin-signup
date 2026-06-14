import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true 
    }, // e.g., 'Civil & Interior Work'
    isActive: { 
        type: Boolean, 
        default: true 
    },
    order: { 
        type: Number, 
        default: 0 
    }
}, { timestamps: true });

const Service = mongoose.models.services || mongoose.model("services", serviceSchema);
export default Service;
