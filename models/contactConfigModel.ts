import mongoose from "mongoose";

const contactConfigSchema = new mongoose.Schema({
    addressLine1: { type: String, default: "First Floor Room No-2, Kh no-167," },
    addressLine2: { type: String, default: "H NO-B-63/1, Kirti Vihar Colony," },
    addressLine3: { type: String, default: "Loni, Ghaziabad, U.P. - 201102" },
    addressShort: { type: String, default: "Kirti Vihar Colony, Loni\nGhaziabad, U.P. — India" },
    email: { type: String, default: "urbanstylespace@gmail.com" },
    phone: { type: String, default: "+91 6202592267" },
    website: { type: String, default: "www.urbanstylespace.com" },
    websiteUrl: { type: String, default: "https://www.urbanstylespace.com" },
    hours: { type: String, default: "Mon – Sat, 9am – 7pm IST" }
}, { timestamps: true });

const ContactConfig = mongoose.models.contact_config || mongoose.model("contact_config", contactConfigSchema);
export default ContactConfig;
