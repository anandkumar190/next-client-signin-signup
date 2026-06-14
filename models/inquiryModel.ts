import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    message: { 
        type: String, 
        required: true 
    },
    isRead: { 
        type: Boolean, 
        default: false 
    }
}, { timestamps: true });

const Inquiry = mongoose.models.inquiries || mongoose.model("inquiries", inquirySchema);
export default Inquiry;
