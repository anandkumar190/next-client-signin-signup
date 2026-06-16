"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PortfolioManager() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        _id: "",
        title: "",
        category: "Commercial",
        year: new Date().getFullYear().toString(),
        location: "",
        description: "",
        imageUrl: "",
        imageUrls: [] as string[],
        isActive: true
    });
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    // Fetch projects on mount
    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = () => {
        axios.get("/api/admin/projects")
            .then(res => {
                setProjects(res.data.data);
            })
            .catch(err => {
                console.error("Failed to load projects:", err);
                setMessage({ text: "Failed to load projects list.", type: "error" });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const data = new FormData();
        for (let i = 0; i < files.length; i++) {
            data.append("files", files[i]);
        }

        try {
            setUploading(true);
            const res = await axios.post("/api/admin/upload", data, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            
            const uploadedUrls: string[] = res.data.urls || [res.data.url];
            
            setFormData(prev => {
                const nextUrls = [...(prev.imageUrls || []), ...uploadedUrls];
                const nextCover = prev.imageUrl || uploadedUrls[0] || "";
                return {
                    ...prev,
                    imageUrl: nextCover,
                    imageUrls: nextUrls
                };
            });
        } catch (err: any) {
            console.error("Upload error:", err);
            alert(err.response?.data?.error || "Failed to upload files.");
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (urlToRemove: string) => {
        setFormData(prev => {
            const nextUrls = (prev.imageUrls || []).filter(url => url !== urlToRemove);
            let nextCover = prev.imageUrl;
            if (prev.imageUrl === urlToRemove) {
                nextCover = nextUrls[0] || "";
            }
            return {
                ...prev,
                imageUrl: nextCover,
                imageUrls: nextUrls
            };
        });
    };

    const setAsCover = (url: string) => {
        setFormData(prev => ({
            ...prev,
            imageUrl: url
        }));
    };

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, url: string) => {
        const target = e.currentTarget;
        if (url && url.startsWith("/uploads/") && !target.src.includes("http://13.207.126.237")) {
            target.src = `http://13.207.126.237${url}`;
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            setSaving(true);
            setMessage({ text: "", type: "" });
            
            if (formData._id) {
                // Edit mode
                const res = await axios.put("/api/admin/projects", formData);
                setProjects(prev => prev.map(p => p._id === formData._id ? res.data.data : p));
                setMessage({ text: "Project updated successfully!", type: "success" });
            } else {
                // Create mode
                const res = await axios.post("/api/admin/projects", formData);
                setProjects(prev => [res.data.data, ...prev]);
                setMessage({ text: "Project added to portfolio!", type: "success" });
            }
            setModalOpen(false);
        } catch (err: any) {
            console.error("Save error:", err);
            setMessage({ text: err.response?.data?.error || "Failed to save project.", type: "error" });
        } finally {
            setSaving(false);
        }
    };

    const openCreateModal = () => {
        setFormData({
            _id: "",
            title: "",
            category: "Commercial",
            year: new Date().getFullYear().toString(),
            location: "",
            description: "",
            imageUrl: "",
            imageUrls: [],
            isActive: true
        });
        setModalOpen(true);
    };

    const openEditModal = (project: any) => {
        setFormData({
            ...project,
            imageUrls: project.imageUrls || (project.imageUrl ? [project.imageUrl] : [])
        });
        setModalOpen(true);
    };

    const deleteProject = async (id: string) => {
        if (!confirm("Are you sure you want to delete this project?")) return;

        try {
            await axios.delete(`/api/admin/projects?id=${id}`);
            setProjects(prev => prev.filter(p => p._id !== id));
            setMessage({ text: "Project deleted successfully!", type: "success" });
        } catch (err: any) {
            console.error("Delete error:", err);
            setMessage({ text: err.response?.data?.error || "Failed to delete project.", type: "error" });
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">Portfolio Manager</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage, add, and organize projects in your portfolio catalog.</p>
                </div>
                <button 
                    onClick={openCreateModal}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow transition active:scale-[0.99] cursor-pointer"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Project
                </button>
            </div>

            {/* Alert banner */}
            {message.text && (
                <div className={`p-4 rounded-xl text-sm border ${
                    message.type === "success" 
                        ? "bg-green-50 border-green-200 text-green-700" 
                        : "bg-red-50 border-red-200 text-red-700"
                }`}>
                    {message.text}
                </div>
            )}

            {/* Projects list */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <h6 className="font-bold text-gray-900 text-sm">Portfolio Items Catalog</h6>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500 border-collapse">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-150">
                            <tr>
                                <th className="px-6 py-3 font-semibold">Project Image</th>
                                <th className="px-6 py-3 font-semibold">Title</th>
                                <th className="px-6 py-3 font-semibold">Category</th>
                                <th className="px-6 py-3 font-semibold">Location</th>
                                <th className="px-6 py-3 font-semibold">Year</th>
                                <th className="px-6 py-3 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-gray-400 font-medium">
                                        No projects available. Click "Add Project" above to create one.
                                    </td>
                                </tr>
                            ) : (
                                projects.map(proj => (
                                    <tr key={proj._id} className="border-b border-gray-100 hover:bg-gray-50/40 transition">
                                        <td className="px-6 py-3">
                                            <div className="h-12 w-20 rounded bg-gray-50 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                                                {proj.imageUrl ? (
                                                    <img 
                                                        src={proj.imageUrl} 
                                                        onError={(e) => handleImageError(e, proj.imageUrl)}
                                                        className="h-full w-full object-cover" 
                                                        alt={proj.title} 
                                                    />
                                                ) : (
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase">No Image</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-800">{proj.title}</td>
                                        <td className="px-6 py-4 text-xs font-bold uppercase tracking-wider">{proj.category}</td>
                                        <td className="px-6 py-4">{proj.location}</td>
                                        <td className="px-6 py-4 font-semibold">{proj.year}</td>
                                        <td className="px-6 py-4 text-right space-x-3">
                                            <button 
                                                onClick={() => openEditModal(proj)}
                                                className="text-gray-700 hover:text-gray-900 font-semibold text-xs transition cursor-pointer"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => deleteProject(proj._id)}
                                                className="text-red-500 hover:text-red-700 font-semibold text-xs transition cursor-pointer"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Project Dialog Popup Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl border border-gray-200 max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                            <h3 className="font-bold text-gray-800">{formData._id ? "Edit Portfolio Project" : "Add New Project"}</h3>
                            <button 
                                onClick={() => setModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition cursor-pointer"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                            
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Project Title</label>
                                <input 
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-900 text-sm font-medium"
                                    placeholder="e.g. Baker By Chance"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                                    <select 
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-900 text-sm font-medium"
                                    >
                                        <option>Commercial</option>
                                        <option>Industrial</option>
                                        <option>Residential</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Execution Year</label>
                                    <input 
                                        type="text"
                                        required
                                        value={formData.year}
                                        onChange={e => setFormData({ ...formData, year: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-900 text-sm font-medium"
                                        placeholder="2024"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Location / City</label>
                                <input 
                                    type="text"
                                    required
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-900 text-sm font-medium"
                                    placeholder="e.g. Dehradun"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                                <textarea 
                                    required
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-900 text-sm font-medium resize-none"
                                    placeholder="Brief outline of civil, partition, electrical, ACP cladding works..."
                                />
                            </div>

                            {/* Multiple Image Gallery Management */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Project Images Gallery</label>
                                    {uploading && <span className="text-xs text-blue-600 font-semibold animate-pulse">Uploading...</span>}
                                </div>

                                {formData.imageUrls && formData.imageUrls.length > 0 ? (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 border border-gray-100 p-3 rounded-xl bg-gray-50/50 max-h-52 overflow-y-auto">
                                        {formData.imageUrls.map((url, index) => {
                                            const isCover = formData.imageUrl === url;
                                            return (
                                                <div key={index} className="relative group aspect-video rounded-lg border border-gray-200 overflow-hidden bg-white shadow-xs">
                                                    <img 
                                                        src={url} 
                                                        onError={(e) => handleImageError(e, url)}
                                                        className="h-full w-full object-cover" 
                                                        alt={`Project Image ${index + 1}`} 
                                                    />
                                                    
                                                    {isCover && (
                                                        <span className="absolute top-1.5 left-1.5 bg-amber-500 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded shadow-sm">
                                                            Cover
                                                        </span>
                                                    )}

                                                    <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition duration-150 flex items-center justify-center gap-1.5">
                                                        {!isCover && (
                                                            <button
                                                                type="button"
                                                                onClick={() => setAsCover(url)}
                                                                title="Set as Main Cover"
                                                                className="p-1 rounded bg-amber-500 hover:bg-amber-600 text-white text-[10px] transition cursor-pointer font-bold"
                                                            >
                                                                ★
                                                            </button>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(url)}
                                                            title="Delete Image"
                                                            className="p-1 rounded bg-red-600 hover:bg-red-700 text-white text-[10px] transition cursor-pointer font-bold"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="border border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-400 text-xs bg-gray-50/50 font-medium">
                                        No images uploaded yet. Select files below.
                                    </div>
                                )}

                                <div className="flex items-center gap-4">
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        multiple
                                        onChange={handleUpload}
                                        disabled={uploading}
                                        className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 file:hover:bg-blue-100 file:cursor-pointer disabled:opacity-50"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                                <button 
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={saving || uploading}
                                    className={`px-5 py-2.5 rounded-lg font-semibold text-white text-sm transition cursor-pointer ${
                                        saving || uploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                                    }`}
                                >
                                    {saving ? "Saving..." : "Save Project"}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
