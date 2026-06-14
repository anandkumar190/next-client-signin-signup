"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function HomepageManager() {
    const [hero, setHero] = useState({
        title: "",
        subtitle: "",
        description: "",
        mediaUrl: "",
        ctaText: ""
    });
    const [footer, setFooter] = useState({
        title: "",
        description: ""
    });
    const [loading, setLoading] = useState(true);
    const [savingHero, setSavingHero] = useState(false);
    const [savingFooter, setSavingFooter] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    // Fetch values on mount
    useEffect(() => {
        axios.get("/api/public/content")
            .then(res => {
                const { sections } = res.data.data;
                if (sections.hero) setHero(sections.hero);
                if (sections.footer) setFooter(sections.footer);
            })
            .catch(err => {
                console.error("Failed to load homepage content:", err);
                setMessage({ text: "Failed to load current configurations.", type: "error" });
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            setUploading(true);
            setMessage({ text: "", type: "" });
            const res = await axios.post("/api/admin/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setHero(prev => ({ ...prev, mediaUrl: res.data.url }));
            setMessage({ text: "Hero background image uploaded successfully!", type: "success" });
        } catch (err: any) {
            console.error("Upload error:", err);
            setMessage({ text: err.response?.data?.error || "Failed to upload image.", type: "error" });
        } finally {
            setUploading(false);
        }
    };

    const saveHeroSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSavingHero(true);
            setMessage({ text: "", type: "" });
            await axios.put("/api/admin/content", {
                sectionKey: "hero",
                ...hero
            });
            setMessage({ text: "Hero section settings saved successfully!", type: "success" });
        } catch (err: any) {
            console.error("Save error:", err);
            setMessage({ text: err.response?.data?.error || "Failed to save settings.", type: "error" });
        } finally {
            setSavingHero(false);
        }
    };

    const saveFooterSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSavingFooter(true);
            setMessage({ text: "", type: "" });
            await axios.put("/api/admin/content", {
                sectionKey: "footer",
                ...footer
            });
            setMessage({ text: "Footer section settings saved successfully!", type: "success" });
        } catch (err: any) {
            console.error("Save error:", err);
            setMessage({ text: err.response?.data?.error || "Failed to save settings.", type: "error" });
        } finally {
            setSavingFooter(false);
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
        <div className="space-y-6">
            
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">Homepage CMS Settings</h1>
                <p className="text-sm text-gray-500 mt-1">Manage core texts, background banners, and CTA links of the homepage.</p>
            </div>

            {/* Alert message banner */}
            {message.text && (
                <div className={`p-4 rounded-xl text-sm border ${
                    message.type === "success" 
                        ? "bg-green-50 border-green-200 text-green-700" 
                        : "bg-red-50 border-red-200 text-red-700"
                }`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Hero Section Config Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                        <h6 className="font-bold text-gray-900 text-sm">Hero Banner Configuration</h6>
                    </div>
                    <form onSubmit={saveHeroSettings} className="p-6 space-y-4">
                        
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category Subtitle</label>
                            <input 
                                type="text" 
                                value={hero.subtitle}
                                onChange={e => setHero({ ...hero, subtitle: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-900 text-sm font-medium"
                                placeholder="INTERIOR DESIGN & EXECUTION"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Hero Main Title</label>
                            <input 
                                type="text" 
                                value={hero.title}
                                onChange={e => setHero({ ...hero, title: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-900 text-sm font-medium"
                                placeholder="We Engineer Environments"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description Paragraph</label>
                            <textarea 
                                value={hero.description}
                                onChange={e => setHero({ ...hero, description: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-900 text-sm font-medium resize-none"
                                placeholder="Explain your studio's focus..."
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">CTA Button Text</label>
                            <input 
                                type="text" 
                                value={hero.ctaText}
                                onChange={e => setHero({ ...hero, ctaText: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-900 text-sm font-medium"
                                placeholder="EXPLORE OUR WORK"
                            />
                        </div>

                        {/* Background Upload */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Hero Background Banner Image</label>
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                <div className="h-24 w-36 rounded-lg bg-gray-50 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center relative group">
                                    {hero.mediaUrl ? (
                                        <img src={hero.mediaUrl} className="h-full w-full object-cover" alt="Hero Bg" />
                                    ) : (
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">No Image</span>
                                    )}
                                </div>
                                <div className="space-y-2 w-full">
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={handleUpload}
                                        disabled={uploading}
                                        className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-800 hover:file:bg-gray-200 file:cursor-pointer"
                                    />
                                    <p className="text-[10px] text-gray-400">Supported: JPG, PNG, WEBP. Max size: 5MB</p>
                                </div>
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={savingHero || uploading}
                            className={`w-full py-2.5 rounded-lg font-semibold text-white text-sm transition active:scale-[0.99] cursor-pointer ${
                                savingHero || uploading 
                                    ? "bg-gray-400 cursor-not-allowed" 
                                    : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                            {savingHero ? "Saving changes..." : "Save Hero Section"}
                        </button>

                    </form>
                </div>

                {/* Footer Section Config Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-fit">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                        <h6 className="font-bold text-gray-900 text-sm">Footer Configuration</h6>
                    </div>
                    <form onSubmit={saveFooterSettings} className="p-6 space-y-4">
                        
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Studio Title / Brand Name</label>
                            <input 
                                type="text" 
                                value={footer.title}
                                onChange={e => setFooter({ ...footer, title: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-900 text-sm font-medium"
                                placeholder="URBAN STYLE SPACE"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Footer Description Text</label>
                            <textarea 
                                value={footer.description}
                                onChange={e => setFooter({ ...footer, description: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-900 text-sm font-medium resize-none"
                                placeholder="Enter short bio shown in footer column..."
                            />
                        </div>

                        <button 
                            type="submit"
                            disabled={savingFooter}
                            className={`w-full py-2.5 rounded-lg font-semibold text-white text-sm transition active:scale-[0.99] cursor-pointer ${
                                savingFooter 
                                    ? "bg-gray-400 cursor-not-allowed" 
                                    : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                            {savingFooter ? "Saving changes..." : "Save Footer Section"}
                        </button>

                    </form>
                </div>

            </div>

        </div>
    );
}
