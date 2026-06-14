"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AboutManager() {
    const [about, setAbout] = useState({
        title: "",
        subtitle: "",
        introText: "",
        narrative: "",
        notableClients: "",
        founderName: "",
        founderRole: "",
        founderInitials: "",
        founderBio: "",
        founderExpertise: [] as string[]
    });
    const [stats, setStats] = useState<any[]>([
        { value: "", label: "", sub: "" },
        { value: "", label: "", sub: "" },
        { value: "", label: "", sub: "" }
    ]);
    const [slides, setSlides] = useState<any[]>([
        { src: "", alt: "", tag: "" },
        { src: "", alt: "", tag: "" },
        { src: "", alt: "", tag: "" },
        { src: "", alt: "", tag: "" }
    ]);
    
    const [expertiseInput, setExpertiseInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
    const [message, setMessage] = useState({ text: "", type: "" });

    useEffect(() => {
        axios.get("/api/public/content")
            .then(res => {
                const data = res.data.data.about;
                if (data) {
                    setAbout({
                        title: data.title || "",
                        subtitle: data.subtitle || "",
                        introText: data.introText || "",
                        narrative: data.narrative || "",
                        notableClients: data.notableClients || "",
                        founderName: data.founderName || "",
                        founderRole: data.founderRole || "",
                        founderInitials: data.founderInitials || "",
                        founderBio: data.founderBio || "",
                        founderExpertise: data.founderExpertise || []
                    });
                    if (data.stats && data.stats.length > 0) setStats(data.stats);
                    if (data.slides && data.slides.length > 0) setSlides(data.slides);
                    setExpertiseInput((data.founderExpertise || []).join(", "));
                }
            })
            .catch(err => {
                console.error("Failed to load about page configuration:", err);
                setMessage({ text: "Failed to load current About Us configuration.", type: "error" });
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleSlideUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            setUploadingIndex(index);
            setMessage({ text: "", type: "" });
            const res = await axios.post("/api/admin/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            const updatedSlides = [...slides];
            updatedSlides[index] = { ...updatedSlides[index], src: res.data.url };
            setSlides(updatedSlides);
            setMessage({ text: `Slide ${index + 1} image uploaded successfully!`, type: "success" });
        } catch (err: any) {
            console.error("Upload error:", err);
            setMessage({ text: err.response?.data?.error || "Failed to upload slide image.", type: "error" });
        } finally {
            setUploadingIndex(null);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            setMessage({ text: "", type: "" });

            const expArray = expertiseInput
                .split(",")
                .map(t => t.trim())
                .filter(t => t.length > 0);

            await axios.put("/api/admin/about", {
                ...about,
                stats,
                slides,
                founderExpertise: expArray
            });
            setMessage({ text: "About Us content saved successfully!", type: "success" });
        } catch (err: any) {
            console.error("Save error:", err);
            setMessage({ text: err.response?.data?.error || "Failed to save configurations.", type: "error" });
        } finally {
            setSaving(false);
        }
    };

    const updateStat = (index: number, key: string, val: string) => {
        const nextStats = [...stats];
        nextStats[index] = { ...nextStats[index], [key]: val };
        setStats(nextStats);
    };

    const updateSlideField = (index: number, key: string, val: string) => {
        const nextSlides = [...slides];
        nextSlides[index] = { ...nextSlides[index], [key]: val };
        setSlides(nextSlides);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[300px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">About Us CMS Manager</h1>
                <p className="text-sm text-gray-500 mt-1">Configure narrative, stats, carousel slides, and founder background for the About Us section.</p>
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

            <form onSubmit={handleSave} className="space-y-6">
                
                {/* Main Content Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
                    <h6 className="font-bold text-gray-900 text-sm border-b pb-2">Narrative Settings</h6>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Section Subtitle</label>
                            <input 
                                type="text" 
                                value={about.subtitle}
                                onChange={e => setAbout({ ...about, subtitle: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-900"
                                placeholder="ABOUT US"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Section Headline Title</label>
                            <input 
                                type="text" 
                                value={about.title}
                                onChange={e => setAbout({ ...about, title: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-900"
                                placeholder="Built on Experience..."
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Intro text (shown next to header)</label>
                        <input 
                            type="text" 
                            value={about.introText}
                            onChange={e => setAbout({ ...about, introText: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-900"
                            placeholder="A premier design & execution studio..."
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Detailed Narrative Text</label>
                        <textarea 
                            value={about.narrative}
                            onChange={e => setAbout({ ...about, narrative: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium resize-none focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-900"
                            placeholder="Explain the background of the studio..."
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Notable Clients (middle-dot separated)</label>
                        <input 
                            type="text" 
                            value={about.notableClients}
                            onChange={e => setAbout({ ...about, notableClients: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-900"
                            placeholder="Axis Bank · Yes Bank · Crocs..."
                        />
                    </div>
                </div>

                {/* Stats Grid Config Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <h6 className="font-bold text-gray-900 text-sm border-b pb-2 mb-4">Core Statistics (3 Columns)</h6>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {stats.map((stat, i) => (
                            <div key={i} className="border border-gray-150 rounded-xl p-4 bg-gray-50/50 space-y-3">
                                <span className="text-xs font-bold text-gray-400">Stat Card #{i+1}</span>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Display Value</label>
                                    <input 
                                        type="text" 
                                        value={stat.value}
                                        onChange={e => updateStat(i, "value", e.target.value)}
                                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-900"
                                        placeholder="e.g. 7+"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Display Label</label>
                                    <input 
                                        type="text" 
                                        value={stat.label}
                                        onChange={e => updateStat(i, "label", e.target.value)}
                                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-900"
                                        placeholder="e.g. Years"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Subtext</label>
                                    <input 
                                        type="text" 
                                        value={stat.sub}
                                        onChange={e => updateStat(i, "sub", e.target.value)}
                                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-900"
                                        placeholder="e.g. Of Experience"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Slideshow Config Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <h6 className="font-bold text-gray-900 text-sm border-b pb-2 mb-4">Image Carousel Slides (4 Slides)</h6>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {slides.map((slide, i) => (
                            <div key={i} className="border border-gray-150 rounded-xl p-4 bg-gray-50/50 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-gray-400">Carousel Slide #{i+1}</span>
                                    <span className="text-[10px] text-gray-400 font-medium">Required</span>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <div className="h-16 w-24 rounded bg-white border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center relative">
                                        {slide.src ? (
                                            <img src={slide.src} className="h-full w-full object-cover" alt="slide" />
                                        ) : (
                                            <span className="text-[9px] text-gray-400">No Image</span>
                                        )}
                                    </div>
                                    <div className="w-full">
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            disabled={uploadingIndex !== null}
                                            onChange={e => handleSlideUpload(e, i)}
                                            className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-gray-100 file:text-gray-800 file:cursor-pointer"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Image Tag</label>
                                        <input 
                                            type="text" 
                                            value={slide.tag}
                                            onChange={e => updateSlideField(i, "tag", e.target.value)}
                                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-900"
                                            placeholder="e.g. Retail · Commercial"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Alt Text</label>
                                        <input 
                                            type="text" 
                                            value={slide.alt}
                                            onChange={e => updateSlideField(i, "alt", e.target.value)}
                                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-900"
                                            placeholder="e.g. Retail store interior"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Founder Info Config Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
                    <h6 className="font-bold text-gray-900 text-sm border-b pb-2">Founder Callout Configuration</h6>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Founder Name</label>
                            <input 
                                type="text" 
                                value={about.founderName}
                                onChange={e => setAbout({ ...about, founderName: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-900"
                                placeholder="Rajeev Kumar Ranjan"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Designation / Role</label>
                            <input 
                                type="text" 
                                value={about.founderRole}
                                onChange={e => setAbout({ ...about, founderRole: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-900"
                                placeholder="Founder & Principal Designer"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Initials Avatar</label>
                            <input 
                                type="text" 
                                value={about.founderInitials}
                                onChange={e => setAbout({ ...about, founderInitials: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-900"
                                placeholder="e.g. RR"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Founder Bio Text</label>
                        <textarea 
                            value={about.founderBio}
                            onChange={e => setAbout({ ...about, founderBio: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium resize-none focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-900"
                            placeholder="Founder's background..."
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Founder Expertise tags (Comma-separated)</label>
                        <input 
                            type="text" 
                            value={expertiseInput}
                            onChange={e => setExpertiseInput(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-900"
                            placeholder="AutoCAD, 3Ds Max, BOQ Preparation"
                        />
                    </div>
                </div>

                <button 
                    type="submit"
                    disabled={saving || uploadingIndex !== null}
                    className={`w-full py-3 rounded-lg font-bold text-white text-sm transition active:scale-[0.99] cursor-pointer ${
                        saving || uploadingIndex !== null
                            ? "bg-gray-400 cursor-not-allowed" 
                            : "bg-gray-900 hover:bg-black"
                    }`}
                >
                    {saving ? "Saving changes..." : "Save About Us Settings"}
                </button>
            </form>
        </div>
    );
}
