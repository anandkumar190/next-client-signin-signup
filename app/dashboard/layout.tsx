"use client"
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [fullname, setFullname] = useState("Loading...");
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const isAuthPage = pathname.includes("/login") || pathname.includes("/registration");

    // Fetch user details dynamically to show in the topbar
    useEffect(() => {
        if (isAuthPage) return;

        axios.get("/api/users/profile")
            .then(res => {
                const user = res.data.data;
                if (user) {
                    setFullname(`${user.firstname} ${user.lastname}`);
                } else {
                    setFullname("Guest User");
                }
            })
            .catch(err => {
                console.error("Failed to fetch profile in layout:", err);
                setFullname("Guest User");
            });
    }, [pathname, isAuthPage]);

    const handleLogout = async () => {
        try {
            await axios.get("/api/users/logout");
            console.log("Logged out successfully");
            router.push("/dashboard/login");
        } catch (error: any) {
            console.error("Logout failed:", error.message);
        }
    };

    if (isAuthPage) {
        return <>{children}</>;
    }

    const getLinkClass = (path: string) => {
        const isActive = pathname === path;
        return `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors font-semibold text-sm ${
            isActive 
                ? "bg-gray-150 text-gray-900 shadow-sm" 
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`;
    };

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans selection:bg-gray-900 selection:text-white">
            
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 text-gray-800 flex flex-col shrink-0 shadow-sm">
                
                {/* Brand Logo */}
                <div className="h-16 flex items-center justify-center border-b border-gray-200 px-6 gap-3">
                    <svg className="h-8 w-8 text-gray-800 rotate-[-15deg]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-extrabold text-base tracking-wider text-gray-900">SB ADMIN <sup className="text-[10px] font-normal opacity-85">2</sup></span>
                </div>

                {/* Sidebar Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                    
                    {/* Dashboard Link */}
                    <Link href="/dashboard" className={getLinkClass("/dashboard")}>
                        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
                        </svg>
                        Dashboard
                    </Link>

                    <div className="border-t border-gray-200/80 my-4 pt-4">
                        <span className="px-4 text-[9px] uppercase font-bold tracking-wider text-gray-400 block mb-2">Interface CMS</span>
                    </div>

                    {/* Homepage CMS */}
                    <Link href="/dashboard/homepage" className={getLinkClass("/dashboard/homepage")}>
                        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Homepage Layout
                    </Link>

                    {/* About Us CMS */}
                    <Link href="/dashboard/about" className={getLinkClass("/dashboard/about")}>
                        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        About Us
                    </Link>

                    {/* Services */}
                    <Link href="/dashboard/services" className={getLinkClass("/dashboard/services")}>
                        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
                        </svg>
                        Services Checklist
                    </Link>

                    {/* Workflow timeline */}
                    <Link href="/dashboard/process" className={getLinkClass("/dashboard/process")}>
                        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
                        </svg>
                        Workflow Timeline
                    </Link>

                    {/* Portfolio */}
                    <Link href="/dashboard/portfolio" className={getLinkClass("/dashboard/portfolio")}>
                        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Portfolio Items
                    </Link>

                    {/* Contact Config */}
                    <Link href="/dashboard/contact" className={getLinkClass("/dashboard/contact")}>
                        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Contact Settings
                    </Link>

                    {/* Client Inquiries */}
                    <Link href="/dashboard/inquiries" className={getLinkClass("/dashboard/inquiries")}>
                        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v4m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6" />
                        </svg>
                        Client Inquiries
                    </Link>

                    {/* SEO Settings */}
                    <Link href="/dashboard/seo" className={getLinkClass("/dashboard/seo")}>
                        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        SEO Metadata
                    </Link>

                    <div className="border-t border-gray-200/80 my-4 pt-4">
                        <span className="px-4 text-[9px] uppercase font-bold tracking-wider text-gray-400 block mb-2">Account</span>
                    </div>

                    {/* Profile Link */}
                    <Link href="/dashboard/profile" className={getLinkClass("/dashboard/profile")}>
                        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile Settings
                    </Link>

                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-gray-200 text-center text-[10px] text-gray-400">
                    SB Admin 2 &bull; Next.js App
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                
                {/* Topbar */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-20">
                    
                    {/* Left side Search */}
                    <div className="hidden sm:flex items-center bg-gray-100 rounded-lg overflow-hidden border border-gray-200 w-80">
                        <input 
                            type="text" 
                            placeholder="Search for..." 
                            className="bg-transparent px-4 py-2 text-sm w-full outline-none placeholder-gray-400"
                        />
                        <button className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 transition shrink-0 cursor-pointer">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>

                    {/* Right side Actions */}
                    <div className="flex items-center gap-6 ml-auto">
                        
                        {/* Notification Bell (Mockup) */}
                        <button className="text-gray-400 hover:text-gray-600 relative transition cursor-pointer">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-extrabold text-[9px] h-4 w-4 rounded-full flex items-center justify-center">3</span>
                        </button>

                        {/* Messages Mail (Mockup) */}
                        <button className="text-gray-400 hover:text-gray-600 relative transition cursor-pointer">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L22 8m-9 11h.01m-2.858-3.048A14.852 14.852 0 0012 17a14.85 14.85 0 00-2.22-.048m-2.858-3.048A14.85 14.85 0 0112 13a14.853 14.853 0 015.078 1.952M12 17c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z" />
                            </svg>
                            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-extrabold text-[9px] h-4 w-4 rounded-full flex items-center justify-center">7</span>
                        </button>

                        <div className="h-8 border-l border-gray-200"></div>

                        {/* User Dropdown */}
                        <div className="relative">
                            <button 
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-3 text-gray-700 hover:text-gray-900 focus:outline-none transition group select-none cursor-pointer"
                            >
                                <span className="text-sm font-semibold hidden md:inline group-hover:text-gray-950 transition">{fullname}</span>
                                <div className="h-10 w-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-800 font-bold text-sm overflow-hidden">
                                    {fullname.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase()}
                                </div>
                            </button>

                            {/* Dropdown Card */}
                            {dropdownOpen && (
                                <>
                                    <div className="fixed inset-0 z-30" onClick={() => setDropdownOpen(false)} />
                                    <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
                                        <Link 
                                            href="/dashboard/profile" 
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                                        >
                                            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Profile Settings
                                        </Link>
                                        <div className="border-t border-gray-100 my-1"></div>
                                        <button 
                                            onClick={() => {
                                                setDropdownOpen(false);
                                                handleLogout();
                                            }}
                                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50/50 transition text-left cursor-pointer"
                                        >
                                            <svg className="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Logout
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                    </div>
                </header>

                {/* Dashboard Page Body */}
                <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
