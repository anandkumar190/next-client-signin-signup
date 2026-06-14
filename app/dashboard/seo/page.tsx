"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SeoManager() {
    const [seo, setSeo] = useState({
        pagePath: "/",
        title: "",
        description: "",
        keywords: [] as string[],
        ogImage: "",
        canonicalUrl: ""
    });
    const [keywordInput, setKeywordInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    // Fetch value on pagePath load
    useEffect(() => {
        setLoading(true);
        axios.get(`/api/public/seo?pagePath=${encodeURIComponent(seo.pagePath)}`)
            .then(res => {
                const data = res.data.data;
                if (data) {
                    setSeo({
                        pagePath: data.pagePath || "/",
                        title: data.title || "",
                        description: data.description || "",
                        keywords: data.keywords || [],
                        ogImage: data.ogImage || "",
                        canonicalUrl: data.canonicalUrl || ""
                    });
                    setKeywordInput((data.keywords || []).join(", "));
                }
            })
            .catch(err => {
                console.error("Failed to load SEO metadata:", err);
                setMessage({ text: "Failed to load current SEO metadata.", type: "error" });
            })
            .finally(() => {
                setLoading(false);
            });
    }, [seo.pagePath]);

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
            setSeo(prev => ({ ...prev, ogImage: res.data.url }));
            setMessage({ text: "OpenGraph image uploaded successfully!", type: "success" });
        } catch (err: any) {
            console.error("Upload error:", err);
            setMessage({ text: err.response?.data?.error || "Failed to upload image.", type: "error" });
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            setMessage({ text: "", type: "" });
            
            // Parse keywords from comma-separated string
            const kwArray = keywordInput
                .split(",")
                .map(k => k.trim())
                .filter(k => k.length > 0);

            await axios.put("/api/admin/seo", {
                ...seo,
                keywords: kwArray
            });
            setMessage({ text: "SEO metadata saved successfully!", type: "success" });
        } catch (err: any) {
            console.error("Save error:", err);
            setMessage({ text: err.response?.data?.error || "Failed to save SEO metadata.", type: "error" });
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
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">SEO Metadata CMS Settings</h1>
                <p className="text-sm text-gray-500 mt-1">Configure global title, tags, keywords, search snippets, and OG share settings for search engines.</p>
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

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden max-w-3xl">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <h6 className="font-bold text-gray-900 text-sm">SEO Configuration</h6>
                </div>
                
                <form onSubmit={handleSave} className="p-6 space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Target Page Path</label>
                        <select 
                            value={seo.pagePath} 
                            onChange={e => setSeo(prev => ({ ...prev, pagePath: e.target.value }))}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-900 text-sm font-medium bg-white"
                        >
                            <option value="/">Homepage ( / )</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Meta Title Tag</label>
                        <input 
                            type="text" 
                            required
                            value={seo.title}
                            onChange={e => setSeo(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-900 text-sm font-medium"
                            placeholder="e.g. Urban Style Space | Interior Design & Execution"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Meta Description Tag</label>
                        <textarea 
                            value={seo.description}
                            onChange={e => setSeo(prev => ({ ...prev, description: e.target.value }))}
                            rows={3}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-900 text-sm font-medium resize-none"
                            placeholder="Brief snippet describing this page in Google search results (recommended < 160 characters)..."
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Meta Keywords (Comma-separated)</label>
                        <input 
                            type="text" 
                            value={keywordInput}
                            onChange={e => setKeywordInput(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-900 text-sm font-medium"
                            placeholder="e.g. interior design, office furniture, corporate space plan"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Canonical URL</label>
                        <input 
                            type="url" 
                            value={seo.canonicalUrl}
                            onChange={e => setSeo(prev => ({ ...prev, canonicalUrl: e.target.value }))}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-900 text-sm font-medium"
                            placeholder="e.g. https://www.urbanstylespace.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">OpenGraph Social Share Image</label>
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                            <div className="h-24 w-36 rounded-lg bg-gray-50 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center relative group">
                                {seo.ogImage ? (
                                    <img src={seo.ogImage} className="h-full w-full object-cover" alt="OG Share Preview" />
                                ) : (
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider text-center p-2">No Social Image</span>
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
                                <p className="text-[10px] text-gray-400">Supported: JPG, PNG, WEBP. Recommended size: 1200 x 630 px</p>
                            </div>
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={saving || uploading}
                        className={`w-full py-2.5 rounded-lg font-semibold text-white text-sm transition active:scale-[0.99] cursor-pointer ${
                            saving || uploading 
                                ? "bg-gray-400 cursor-not-allowed" 
                                : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {saving ? "Saving changes..." : "Save SEO Metadata"}
                    </button>
                </form>
            </div>
        </div>
    );
}
