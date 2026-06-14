"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ServicesManager() {
    const [services, setServices] = useState<any[]>([]);
    const [newServiceName, setNewServiceName] = useState("");
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [message, setMessage] = useState({ text: "", type: "" });

    // Fetch services on mount
    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = () => {
        axios.get("/api/admin/services")
            .then(res => {
                setServices(res.data.data);
            })
            .catch(err => {
                console.error("Failed to fetch services:", err);
                setMessage({ text: "Failed to load services list.", type: "error" });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleAddService = async (e: React.FormEvent) => {
        e.preventDefault();
        const name = newServiceName.trim();
        if (!name) return;

        try {
            setAdding(true);
            setMessage({ text: "", type: "" });
            const res = await axios.post("/api/admin/services", {
                name,
                order: services.length,
                isActive: true
            });
            setServices(prev => [...prev, res.data.data]);
            setNewServiceName("");
            setMessage({ text: "Service capability added successfully!", type: "success" });
        } catch (err: any) {
            console.error("Add error:", err);
            setMessage({ text: err.response?.data?.error || "Failed to add service.", type: "error" });
        } finally {
            setAdding(false);
        }
    };

    const toggleServiceStatus = async (service: any) => {
        try {
            setUpdatingId(service._id);
            const updated = { ...service, isActive: !service.isActive };
            const res = await axios.put("/api/admin/services", updated);
            setServices(prev => prev.map(s => s._id === service._id ? res.data.data : s));
        } catch (err: any) {
            console.error("Toggle error:", err);
            setMessage({ text: err.response?.data?.error || "Failed to toggle service status.", type: "error" });
        } finally {
            setUpdatingId(null);
        }
    };

    const deleteService = async (id: string) => {
        if (!confirm("Are you sure you want to delete this service capability?")) return;

        try {
            setUpdatingId(id);
            await axios.delete(`/api/admin/services?id=${id}`);
            setServices(prev => prev.filter(s => s._id !== id));
            setMessage({ text: "Service capability deleted successfully!", type: "success" });
        } catch (err: any) {
            console.error("Delete error:", err);
            setMessage({ text: err.response?.data?.error || "Failed to delete service.", type: "error" });
        } finally {
            setUpdatingId(null);
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
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">Services Checklist</h1>
                <p className="text-sm text-gray-500 mt-1">Add, update, or remove the core services displayed on the client homepage.</p>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left side Form: Add Capability */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-fit">
                    <h6 className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-4">Add Capability</h6>
                    <form onSubmit={handleAddService} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Service Name</label>
                            <input 
                                type="text"
                                value={newServiceName}
                                onChange={e => setNewServiceName(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-950/10 focus:border-gray-900 text-sm font-medium"
                                placeholder="e.g. Demolition & Civil Work"
                                required
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={adding}
                            className={`w-full py-2.5 rounded-lg font-semibold text-white text-sm transition active:scale-[0.99] cursor-pointer ${
                                adding ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                            {adding ? "Adding capability..." : "Add Service"}
                        </button>
                    </form>
                </div>

                {/* Right side Table: Services List */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden lg:col-span-2">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                        <h6 className="font-bold text-gray-900 text-sm">Capabilities Grid List</h6>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-500 border-collapse">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-150">
                                <tr>
                                    <th className="px-6 py-3 font-semibold">Service Name</th>
                                    <th className="px-6 py-3 font-semibold text-center">Active Status</th>
                                    <th className="px-6 py-3 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {services.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-10 text-center text-gray-400 font-medium">
                                            No services found. Add one on the left.
                                        </td>
                                    </tr>
                                ) : (
                                    services.map((service, index) => (
                                        <tr key={service._id} className="border-b border-gray-100 hover:bg-gray-50/40 transition">
                                            <td className="px-6 py-4 font-semibold text-gray-800">{service.name}</td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => toggleServiceStatus(service)}
                                                    disabled={updatingId === service._id}
                                                    className={`px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-full border transition cursor-pointer select-none ${
                                                        service.isActive
                                                            ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                                                            : "bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                                                    }`}
                                                >
                                                    {service.isActive ? "Active" : "Disabled"}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => deleteService(service._id)}
                                                    disabled={updatingId === service._id}
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

            </div>

        </div>
    );
}
