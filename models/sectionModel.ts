import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
    sectionKey: { 
        type: String, 
        required: true, 
        unique: true 
    }, // 'hero', 'footer'
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    description: { type: String, default: "" },
    mediaUrl: { type: String, default: "" }, // For Hero Background Image
    ctaText: { type: String, default: "" }
}, { timestamps: true });

const Section = mongoose.models.sections || mongoose.model("sections", sectionSchema);
export default Section;
