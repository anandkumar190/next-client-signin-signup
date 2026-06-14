"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function InquiriesInbox() {
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    // Fetch inquiries on mount
    useEffect(() => {
        axios.get("/api/admin/inquiries")
            .then(res => {
                setInquiries(res.data.data);
            })
            .catch(err => {
                console.error("Failed to load inquiries:", err);
                setMessage({ text: "Failed to load inquiries.", type: "error" });
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const toggleReadStatus = async (inquiry: any) => {
        try {
            setUpdatingId(inquiry._id);
            const res = await axios.put("/api/admin/inquiries", {
                _id: inquiry._id,
                isRead: !inquiry.isRead
            });
            setInquiries(prev => prev.map(i => i._id === inquiry._id ? res.data.data : i));
        } catch (err: any) {
            console.error("Failed to update status:", err);
            alert("Failed to update status.");
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[300px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">Client Inquiries Inbox</h1>
                <p className="text-sm text-gray-500 mt-1">Review contact form submissions sent by potential clients.</p>
            </div>

            {/* Error banner */}
            {message.text && (
                <div className="p-4 rounded-xl text-sm border bg-red-50 border-red-200 text-red-700">
                    {message.text}
                </div>
            )}

            {/* Inbox */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <h6 className="font-bold text-blue-600 text-sm">Messages Box</h6>
                    <span className="bg-blue-100 text-blue-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {inquiries.filter(i => !i.isRead).length} Unread
                    </span>
                </div>
                
                <div className="divide-y divide-gray-100">
                    {inquiries.length === 0 ? (
                        <div className="px-6 py-12 text-center text-gray-400 font-medium">
                            Inbox is empty. No inquiries received yet.
                        </div>
                    ) : (
                        inquiries.map(inq => (
                            <div 
                                key={inq._id} 
                                className={`p-6 transition flex flex-col md:flex-row gap-4 items-start justify-between ${
                                    inq.isRead ? "bg-white opacity-80" : "bg-blue-50/20 font-semibold"
                                }`}
                            >
                                <div className="space-y-2 max-w-3xl">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="text-gray-900 text-sm font-bold">{inq.name}</span>
                                        <span className="text-xs text-gray-400 font-normal">&bull;</span>
                                        <a href={`mailto:${inq.email}`} className="text-xs text-blue-600 font-medium hover:underline">{inq.email}</a>
                                        <span className="text-xs text-gray-400 font-normal">&bull;</span>
                                        <span className="text-xs text-gray-400 font-normal">{new Date(inq.createdAt).toLocaleString()}</span>
                                    </div>
                                    <p className="text-gray-700 text-sm leading-relaxed font-normal whitespace-pre-wrap">
                                        {inq.message}
                                    </p>
                                </div>
                                
                                <button
                                    onClick={() => toggleReadStatus(inq)}
                                    disabled={updatingId === inq._id}
                                    className={`px-4 py-2 border rounded-lg text-xs font-bold transition select-none cursor-pointer hover:shadow-sm ${
                                        inq.isRead 
                                            ? "border-gray-200 bg-white text-gray-500 hover:bg-gray-50" 
                                            : "border-blue-200 bg-blue-600 text-white hover:bg-blue-700"
                                    }`}
                                >
                                    {updatingId === inq._id ? "..." : inq.isRead ? "Mark as Unread" : "Mark as Read"}
                                </button>

                            </div>
                        ))
                    )}
                </div>
            </div>

        </div>
    );
}
