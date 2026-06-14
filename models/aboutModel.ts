import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema({
    title: { type: String, default: "Built on Experience. Driven by Craft." },
    subtitle: { type: String, default: "ABOUT US" },
    introText: { type: String, default: "A premier design & execution studio specialising in commercial and corporate environments." },
    narrative: { type: String, default: "Urban Style Space is a premier interior design and execution firm specializing in high-impact commercial and corporate environments. Led by founder Rajeev Kumar Ranjan, with over 7 years of specialized experience in banking infrastructure, retail, and large-scale corporate rollouts." },
    notableClients: { type: String, default: "Axis Bank · Yes Bank · Bajaj Finserv · Sahayog Bank · Crocs · Red Chief · Samsonite · Timex · Tupperware · Samvardhana Motherson · Baker By Chance · Envision" },
    stats: [
        {
            value: { type: String, default: "" },
            label: { type: String, default: "" },
            sub: { type: String, default: "" }
        }
    ],
    slides: [
        {
            src: { type: String, default: "" },
            alt: { type: String, default: "" },
            tag: { type: String, default: "" }
        }
    ],
    founderName: { type: String, default: "Rajeev Kumar Ranjan" },
    founderRole: { type: String, default: "Founder & Principal Designer" },
    founderInitials: { type: String, default: "RR" },
    founderBio: { type: String, default: "Our foundation may be new, but it's backed by 7 years of deep experience. Expert in AutoCAD (2D & 3D), 3Ds Max visualization, BOQ preparation, project scheduling, and team management." },
    founderExpertise: [{ type: String }]
}, { timestamps: true });

const About = mongoose.models.about || mongoose.model("about", aboutSchema);
export default About;
