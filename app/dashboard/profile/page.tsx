"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Profile() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch user details on mount
    useEffect(() => {
        axios.get("/api/users/profile")
            .then(res => {
                setUser(res.data.data);
            })
            .catch(err => {
                console.error("Failed to load user profile:", err);
                setError(err.response?.data?.error || err.message || "Failed to load profile.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleLogout = async () => {
        try {
            await axios.get("/api/users/logout");
            console.log("Logged out successfully");
            router.push("/dashboard/login");
        } catch (error: any) {
            console.error("Logout failed:", error.message);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[300px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-center shadow-sm">
                <p className="font-bold">Error Loading Profile</p>
                <p className="text-sm mt-1">{error}</p>
                <button 
                    onClick={() => router.push("/dashboard/login")}
                    className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                    Back to Login
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            
            {/* Page Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">Profile Settings</h1>
                <p className="text-sm text-gray-500 mt-1">Manage and view your user profile details.</p>
            </div>

            {/* Content Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Card: Avatar and Details */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center flex flex-col items-center">
                    <div className="h-24 w-24 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center text-gray-800 font-bold text-3xl shadow-sm mb-4">
                        {user ? `${user.firstname[0]}${user.lastname[0]}`.toUpperCase() : "U"}
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg">
                        {user ? `${user.firstname} ${user.lastname}` : "User Profile"}
                    </h3>
                    <p className="text-sm text-gray-400">{user?.email}</p>
                    
                    <div className="mt-4 px-3 py-1 bg-green-50 border border-green-200 text-green-700 text-[10px] uppercase font-extrabold tracking-wider rounded-full">
                        Secure Connection Active
                    </div>
 
                    <div className="border-t border-gray-100 w-full my-6"></div>

                    <button 
                        onClick={handleLogout}
                        className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-2.5 rounded-lg text-sm font-semibold transition active:scale-[0.99] cursor-pointer"
                    >
                        Sign Out of Session
                    </button>
                </div>

                {/* Right Card: Details Form */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm lg:col-span-2 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                        <h6 className="font-bold text-gray-900 text-sm">Account Information</h6>
                    </div>
                    <div className="p-6 space-y-4">
                        
                        {/* Name Block */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">First Name</label>
                                <input 
                                    type="text" 
                                    readOnly 
                                    value={user?.firstname || ""}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 outline-none text-sm font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Last Name</label>
                                <input 
                                    type="text" 
                                    readOnly 
                                    value={user?.lastname || ""}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 outline-none text-sm font-medium"
                                />
                            </div>
                        </div>

                        {/* Email Address */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                            <input 
                                type="email" 
                                readOnly 
                                value={user?.email || ""}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 outline-none text-sm font-medium"
                            />
                        </div>

                        {/* Database Info */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">User ID (Mongoose ObjectID)</label>
                            <input 
                                type="text" 
                                readOnly 
                                value={user?._id || ""}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 outline-none text-sm font-mono"
                            />
                        </div>

                        <div className="pt-2 text-xs text-gray-400">
                            * Profile details are fetched securely from the database. To update your name, please contact the workspace administrator.
                        </div>

                    </div>
                </div>

            </div>

        </div>
    );
}