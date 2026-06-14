"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";

interface ProcessPhase {
    _id?: string;
    phaseNumber: string;
    phaseTitle: string;
    phaseSubtitle: string;
    steps: string[];
    order: number;
}

export default function ProcessManager() {
    const [phases, setPhases] = useState<ProcessPhase[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    // Form states for creating/editing
    const [editingPhase, setEditingPhase] = useState<ProcessPhase | null>(null);
    const [formData, setFormData] = useState<ProcessPhase>({
        phaseNumber: "",
        phaseTitle: "",
        phaseSubtitle: "",
        steps: [],
        order: 0
    });
    const [stepInput, setStepInput] = useState("");

    const fetchPhases = async () => {
        try {
            const res = await axios.get("/api/admin/process");
            if (res.data.success) {
                setPhases(res.data.data);
            }
        } catch (err) {
            console.error("Failed to fetch process phases:", err);
            setMessage({ text: "Failed to load workflow phases.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPhases();
    }, []);

    const resetForm = () => {
        setEditingPhase(null);
        setFormData({
            phaseNumber: "",
            phaseTitle: "",
            phaseSubtitle: "",
            steps: [],
            order: 0
        });
        setStepInput("");
    };

    const handleEditClick = (phase: ProcessPhase) => {
        setEditingPhase(phase);
        setFormData({
            phaseNumber: phase.phaseNumber,
            phaseTitle: phase.phaseTitle,
            phaseSubtitle: phase.phaseSubtitle,
            steps: [...phase.steps],
            order: phase.order
        });
        setStepInput(phase.steps.join("\n"));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            setMessage({ text: "", type: "" });

            const parsedSteps = stepInput
                .split("\n")
                .map(s => s.trim())
                .filter(s => s.length > 0);

            const payload = {
                ...formData,
                steps: parsedSteps
            };

            if (editingPhase && editingPhase._id) {
                // Update
                await axios.put("/api/admin/process", {
                    _id: editingPhase._id,
                    ...payload
                });
                setMessage({ text: "Process phase updated successfully!", type: "success" });
            } else {
                // Create
                await axios.post("/api/admin/process", payload);
                setMessage({ text: "New process phase created successfully!", type: "success" });
            }

            resetForm();
            fetchPhases();
        } catch (err: any) {
            console.error("Save process error:", err);
            setMessage({ text: err.response?.data?.error || "Failed to save process phase.", type: "error" });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this process phase?")) return;
        try {
            setMessage({ text: "", type: "" });
            await axios.delete(`/api/admin/process?id=${id}`);
            setMessage({ text: "Process phase deleted successfully!", type: "success" });
            fetchPhases();
        } catch (err: any) {
            console.error("Delete process error:", err);
            setMessage({ text: err.response?.data?.error || "Failed to delete process phase.", type: "error" });
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
        <div className="space-y-6 max-w-6xl">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">Workflow Timeline Manager</h1>
                <p className="text-sm text-gray-500 mt-1">Configure phases, ordering, and bullet steps of the "How We Work" timeline.</p>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Form to Create/Edit */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-fit">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                        <h6 className="font-bold text-gray-900 text-sm">
                            {editingPhase ? "Edit Process Phase" : "Add New Phase"}
                        </h6>
                        {editingPhase && (
                            <button onClick={resetForm} className="text-xs text-red-500 hover:underline cursor-pointer">
                                Cancel
                            </button>
                        )}
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phase Number (e.g. 01)</label>
                            <input 
                                type="text" 
                                required
                                value={formData.phaseNumber}
                                onChange={e => setFormData({ ...formData, phaseNumber: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-900"
                                placeholder="01"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phase Title</label>
                            <input 
                                type="text" 
                                required
                                value={formData.phaseTitle}
                                onChange={e => setFormData({ ...formData, phaseTitle: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-900"
                                placeholder="CONCEPT DESIGN"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phase Subtitle</label>
                            <input 
                                type="text" 
                                required
                                value={formData.phaseSubtitle}
                                onChange={e => setFormData({ ...formData, phaseSubtitle: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-900"
                                placeholder="The Vision Phase"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Steps Checklist (One per line)</label>
                            <textarea 
                                value={stepInput}
                                onChange={e => setStepInput(e.target.value)}
                                rows={6}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium resize-none focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-900"
                                placeholder="Client Briefing&#10;Site Analysis&#10;Design Workshop..."
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Sorting Order (Integer)</label>
                            <input 
                                type="number" 
                                value={formData.order}
                                onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-900"
                                placeholder="1"
                            />
                        </div>

                        <button 
                            type="submit"
                            disabled={saving}
                            className={`w-full py-2.5 rounded-lg font-bold text-white text-sm transition active:scale-[0.99] cursor-pointer ${
                                saving ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                            {saving ? "Saving..." : editingPhase ? "Update Phase" : "Create Phase"}
                        </button>
                    </form>
                </div>

                {/* List of Workflow Phases */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h6 className="font-bold text-gray-800 text-sm mb-4">Workflow Steps Timeline</h6>
                        
                        {phases.length === 0 ? (
                            <div className="text-center py-10 text-gray-400 text-sm font-medium">
                                No process phases defined. Add one using the form on the left.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {phases.map((phase) => (
                                    <div key={phase._id} className="border border-gray-150 rounded-xl bg-gray-50/50 p-5 flex flex-col justify-between">
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-start">
                                                <span className="text-4xl font-extrabold text-gray-400/35 leading-none">{phase.phaseNumber}</span>
                                                <span className="text-[10px] bg-gray-150 text-gray-800 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Order {phase.order}</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-800 text-base leading-snug">{phase.phaseTitle}</h4>
                                                <span className="text-xs text-gray-400 font-medium">{phase.phaseSubtitle}</span>
                                            </div>
                                            <ul className="space-y-1.5 pt-2 border-t border-gray-200/60">
                                                {phase.steps.map((step, sIdx) => (
                                                    <li key={sIdx} className="flex items-start gap-2 text-xs text-gray-600">
                                                        <span className="h-1.5 w-1.5 bg-gray-800 shrink-0 rounded-full mt-1.5" />
                                                        <span>{step}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        
                                        <div className="flex gap-3 pt-4 border-t border-gray-200/60 mt-4">
                                            <button 
                                                onClick={() => handleEditClick(phase)}
                                                className="text-xs text-gray-700 hover:text-gray-900 font-bold hover:underline cursor-pointer"
                                            >
                                                Edit details
                                            </button>
                                            <button 
                                                onClick={() => phase._id && handleDelete(phase._id)}
                                                className="text-xs text-red-600 hover:text-red-800 font-bold hover:underline cursor-pointer ml-auto"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
