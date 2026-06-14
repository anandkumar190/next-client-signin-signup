"use client"
import React from "react";

export default function Dashboard() {
    return (
        <div className="space-y-6">
            
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">Dashboard</h1>
                <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow transition-colors active:scale-[0.99] cursor-pointer">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Generate Report
                </button>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Earnings (Monthly) */}
                <div className="bg-white rounded-xl shadow-sm border-l-4 border-gray-900 p-6 flex items-center justify-between hover:shadow-md transition">
                    <div>
                        <span className="text-xs font-bold text-gray-800 uppercase tracking-wider block mb-1">Earnings (Monthly)</span>
                        <span className="text-xl font-bold text-gray-800">$40,000</span>
                    </div>
                    <div className="text-gray-300">
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                </div>

                {/* Earnings (Annual) */}
                <div className="bg-white rounded-xl shadow-sm border-l-4 border-green-600 p-6 flex items-center justify-between hover:shadow-md transition">
                    <div>
                        <span className="text-xs font-bold text-green-600 uppercase tracking-wider block mb-1">Earnings (Annual)</span>
                        <span className="text-xl font-bold text-gray-800">$215,000</span>
                    </div>
                    <div className="text-gray-300">
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16v1" />
                        </svg>
                    </div>
                </div>

                {/* Tasks */}
                <div className="bg-white rounded-xl shadow-sm border-l-4 border-gray-600 p-6 hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider block">Tasks Completed</span>
                            <span className="text-xl font-bold text-gray-800">50%</span>
                        </div>
                        <div className="text-gray-300">
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                        </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-gray-600 h-2 rounded-full" style={{ width: "50%" }}></div>
                    </div>
                </div>

                {/* Pending Requests */}
                <div className="bg-white rounded-xl shadow-sm border-l-4 border-yellow-600 p-6 flex items-center justify-between hover:shadow-md transition">
                    <div>
                        <span className="text-xs font-bold text-yellow-600 uppercase tracking-wider block mb-1">Pending Requests</span>
                        <span className="text-xl font-bold text-gray-800">18</span>
                    </div>
                    <div className="text-gray-300">
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                </div>

            </div>

            {/* Graphs / Mock Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Earnings Overview */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm lg:col-span-2 overflow-hidden flex flex-col">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <h6 className="font-bold text-gray-900 text-sm">Earnings Overview</h6>
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between min-h-[300px]">
                        {/* Mock Line Graph visual */}
                        <div className="relative flex-1 flex items-end justify-between border-b border-l border-gray-200 pb-2 pl-2 gap-2 mt-4">
                            {/* Columns and trend line mockup */}
                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                                <div className="border-t border-dashed border-gray-200 w-full h-0"></div>
                                <div className="border-t border-dashed border-gray-200 w-full h-0"></div>
                                <div className="border-t border-dashed border-gray-200 w-full h-0"></div>
                            </div>
                            <svg className="absolute inset-0 w-full h-full p-2 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <path 
                                    d="M 0,90 Q 20,40 40,60 T 80,20 T 100,5" 
                                    fill="none" 
                                    stroke="#111827" 
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                />
                                <path 
                                    d="M 0,90 Q 20,40 40,60 T 80,20 T 100,5 L 100,100 L 0,100 Z" 
                                    fill="url(#earningsGrad)" 
                                    opacity="0.1"
                                />
                                <defs>
                                    <linearGradient id="earningsGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#111827" />
                                        <stop offset="100%" stopColor="#ffffff" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-400 font-semibold uppercase tracking-wider pt-3 pl-4">
                            <span>Jan</span>
                            <span>Mar</span>
                            <span>May</span>
                            <span>Jul</span>
                            <span>Sep</span>
                            <span>Nov</span>
                        </div>
                    </div>
                </div>

                {/* Revenue Sources */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                        <h6 className="font-bold text-gray-900 text-sm">Revenue Sources</h6>
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-center items-center min-h-[300px]">
                        {/* Mock Donut Chart */}
                        <div className="relative h-40 w-40 flex items-center justify-center">
                            <svg className="h-full w-full rotate-[-90deg]" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#eaecf4" strokeWidth="3" />
                                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#111827" strokeWidth="3" strokeDasharray="55 45" strokeDashoffset="0" />
                                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="30 70" strokeDashoffset="-55" />
                                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#6b7280" strokeWidth="3" strokeDasharray="15 85" strokeDashoffset="-85" />
                            </svg>
                            <div className="absolute flex flex-col items-center justify-center">
                                <span className="text-xl font-bold text-gray-800">55%</span>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Direct</span>
                            </div>
                        </div>
                        <div className="flex gap-4 justify-center mt-6 text-xs font-semibold text-gray-600 w-full">
                            <span className="flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full bg-gray-900 block"></span>
                                Direct
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full bg-green-500 block"></span>
                                Social
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full bg-gray-400 block"></span>
                                Referral
                            </span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Cards & Lists Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Projects */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                        <h6 className="font-bold text-gray-900 text-sm">Projects</h6>
                    </div>
                    <div className="p-6 space-y-5">
                        
                        {/* Server Migration */}
                        <div>
                            <div className="flex justify-between text-xs font-bold text-gray-700 mb-1.5">
                                <span>Server Migration</span>
                                <span>20%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5">
                                <div className="bg-red-500 h-2.5 rounded-full" style={{ width: "20%" }}></div>
                            </div>
                        </div>
 
                        {/* Sales Tracking */}
                        <div>
                            <div className="flex justify-between text-xs font-bold text-gray-700 mb-1.5">
                                <span>Sales Tracking</span>
                                <span>40%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5">
                                <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: "40%" }}></div>
                            </div>
                        </div>

                        {/* Customer Database */}
                        <div>
                            <div className="flex justify-between text-xs font-bold text-gray-700 mb-1.5">
                                <span>Customer Database</span>
                                <span>60%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5">
                                <div className="bg-gray-900 h-2.5 rounded-full" style={{ width: "60%" }}></div>
                            </div>
                        </div>

                        {/* Payout Details */}
                        <div>
                            <div className="flex justify-between text-xs font-bold text-gray-700 mb-1.5">
                                <span>Payout Details</span>
                                <span>80%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5">
                                <div className="bg-gray-500 h-2.5 rounded-full" style={{ width: "80%" }}></div>
                            </div>
                        </div>

                        {/* Account Setup */}
                        <div>
                            <div className="flex justify-between text-xs font-bold text-gray-700 mb-1.5">
                                <span>Account Setup</span>
                                <span className="text-green-600 font-extrabold">Complete!</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5">
                                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "100%" }}></div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Color System & Approach */}
                <div className="space-y-6">
                    
                    {/* Colors grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-900 text-white rounded-lg p-4 shadow-sm font-semibold text-sm hover:opacity-95 transition">
                            Primary
                            <div className="text-white/60 text-xs font-normal mt-1">#111827</div>
                        </div>
                        <div className="bg-green-600 text-white rounded-lg p-4 shadow-sm font-semibold text-sm hover:opacity-95 transition">
                            Success
                            <div className="text-white/60 text-xs font-normal mt-1">#16a34a</div>
                        </div>
                        <div className="bg-gray-500 text-white rounded-lg p-4 shadow-sm font-semibold text-sm hover:opacity-95 transition">
                            Neutral Gray
                            <div className="text-white/60 text-xs font-normal mt-1">#6b7280</div>
                        </div>
                        <div className="bg-yellow-500 text-white rounded-lg p-4 shadow-sm font-semibold text-sm hover:opacity-95 transition">
                            Warning
                            <div className="text-white/60 text-xs font-normal mt-1">#f6c23e</div>
                        </div>
                        <div className="bg-red-500 text-white rounded-lg p-4 shadow-sm font-semibold text-sm hover:opacity-95 transition">
                            Danger
                            <div className="text-white/60 text-xs font-normal mt-1">#e74a3b</div>
                        </div>
                        <div className="bg-gray-800 text-white rounded-lg p-4 shadow-sm font-semibold text-sm hover:opacity-95 transition">
                            Dark
                            <div className="text-white/60 text-xs font-normal mt-1">#1f2937</div>
                        </div>
                    </div>

                    {/* Development Approach */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-3">
                        <h6 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Development Approach</h6>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            SB Admin 2 makes extensive use of utility classes in order to reduce CSS bloat and poor page performance. Custom CSS classes can be used to create custom components and custom utility classes.
                        </p>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            We have integrated these styles inside a robust Next.js setup with Server-Side rendering support and clean App routing structures.
                        </p>
                    </div>

                </div>

            </div>

        </div>
    );
}