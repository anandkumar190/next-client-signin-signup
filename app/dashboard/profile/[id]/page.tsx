"use client"
import React from "react";
import { useParams } from "next/navigation";

export default function UserProfile() {
    const params = useParams();
    const id = params?.id;

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 max-w-2xl mx-auto text-center space-y-4">
            <h1 className="text-2xl font-bold text-gray-800">User Details Page</h1>
            <p className="text-sm text-gray-500">You are viewing the details of a specific user ID:</p>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <code className="text-gray-900 font-mono font-semibold text-sm break-all">
                    {id}
                </code>
            </div>
            <div className="text-xs text-gray-400">
                This dynamic page handles parameterized route routing for profile identifiers.
            </div>
        </div>
    );
}
