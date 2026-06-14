"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ContactSettingsManager() {
    const [contact, setContact] = useState({
        addressLine1: "",
        addressLine2: "",
        addressLine3: "",
        addressShort: "",
        email: "",
        phone: "",
        website: "",
        websiteUrl: "",
        hours: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    useEffect(() => {
        axios.get("/api/public/content")
            .then(res => {
                const data = res.data.data.contactConfig;
                if (data) {
                    setContact({
                        addressLine1: data.addressLine1 || "",
                        addressLine2: data.addressLine2 || "",
                        addressLine3: data.addressLine3 || "",
                        addressShort: data.addressShort || "",
                        email: data.email || "",
                        phone: data.phone || "",
                        website: data.website || "",
                        websiteUrl: data.websiteUrl || "",
                        hours: data.hours || ""
                    });
                }
            })
            .catch(err => {
                console.error("Failed to load contact configuration:", err);
                setMessage({ text: "Failed to load current Contact configurations.", type: "error" });
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            setMessage({ text: "", type: "" });
            await axios.put("/api/admin/contact", contact);
            setMessage({ text: "Contact coordinates saved successfully!", type: "success" });
        } catch (err: any) {
            console.error("Save contact error:", err);
            setMessage({ text: err.response?.data?.error || "Failed to save contact settings.", type: "error" });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[300px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">Contact Settings CMS</h1>
                <p className="text-sm text-gray-500 mt-1">Configure coordinates, emails, office address, website, and operating hours dynamically.</p>
            </div>

            {message.text && (
                <div className={`p-4 rounded-xl text-sm border ${
                    message.type === "success" 
                        ? "bg-green-50 border-green-200 text-green-700" 
                        : "bg-red-50 border-red-200 text-red-700"
                }`}>
                    {message.text}
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <h6 className="font-bold text-gray-900 text-sm">Get In Touch Coordinates</h6>
                </div>
                <form onSubmit={handleSave} className="p-6 space-y-4">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                            <input 
                                type="email" 
                                required
                                value={contact.email}
                                onChange={e => setContact({ ...contact, email: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-900"
                                placeholder="urbanstylespace@gmail.com"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                            <input 
                                type="text" 
                                required
                                value={contact.phone}
                                onChange={e => setContact({ ...contact, phone: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-900"
                                placeholder="+91 6202592267"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Website Label</label>
                            <input 
                                type="text" 
                                required
                                value={contact.website}
                                onChange={e => setContact({ ...contact, website: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-900"
                                placeholder="www.urbanstylespace.com"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Website Link URL</label>
                            <input 
                                type="url" 
                                required
                                value={contact.websiteUrl}
                                onChange={e => setContact({ ...contact, websiteUrl: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-900"
                                placeholder="https://www.urbanstylespace.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Operating Hours</label>
                        <input 
                            type="text" 
                            required
                            value={contact.hours}
                            onChange={e => setContact({ ...contact, hours: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-900"
                            placeholder="Mon – Sat, 9am – 7pm IST"
                        />
                    </div>

                    <div className="border-t border-gray-100 pt-4 mt-2">
                        <h6 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Address Lines (Get In Touch Section)</h6>
                        <div className="space-y-3">
                            <input 
                                type="text" 
                                required
                                value={contact.addressLine1}
                                onChange={e => setContact({ ...contact, addressLine1: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-900"
                                placeholder="Address Line 1"
                            />
                            <input 
                                type="text" 
                                required
                                value={contact.addressLine2}
                                onChange={e => setContact({ ...contact, addressLine2: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-900"
                                placeholder="Address Line 2"
                            />
                            <input 
                                type="text" 
                                required
                                value={contact.addressLine3}
                                onChange={e => setContact({ ...contact, addressLine3: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-900"
                                placeholder="Address Line 3"
                            />
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Short Address (Footer layout Column)</label>
                        <textarea 
                            value={contact.addressShort}
                            onChange={e => setContact({ ...contact, addressShort: e.target.value })}
                            rows={2}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium resize-none focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-900"
                            placeholder="Kirti Vihar Colony, Loni&#10;Ghaziabad, U.P. — India"
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={saving}
                        className={`w-full py-2.5 rounded-lg font-bold text-white text-sm transition active:scale-[0.99] cursor-pointer ${
                            saving ? "bg-gray-400 cursor-not-allowed" : "bg-gray-900 hover:bg-black"
                        }`}
                    >
                        {saving ? "Saving changes..." : "Save Contact Settings"}
                    </button>
                </form>
            </div>
        </div>
    );
}
