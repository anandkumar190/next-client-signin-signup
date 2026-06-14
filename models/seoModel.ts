import mongoose from "mongoose";

const seoSchema = new mongoose.Schema({
    pagePath: { 
        type: String, 
        required: true, 
        unique: true 
    }, // e.g., '/', '/dashboard'
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        default: "" 
    },
    keywords: [{ 
        type: String 
    }],
    ogImage: { 
        type: String, 
        default: "" 
    },
    canonicalUrl: { 
        type: String, 
        default: "" 
    }
}, { timestamps: true });

const Seo = mongoose.models.seo || mongoose.model("seo", seoSchema);
export default Seo;
