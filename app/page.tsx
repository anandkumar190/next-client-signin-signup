"use client"
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { REMOTE_ASSET_BASE } from "@/helpers/config";

export default function Home() {
    const [content, setContent] = useState<any>(null);
    const [projects, setProjects] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [loading, setLoading] = useState(true);
    const [loadingProjects, setLoadingProjects] = useState(false);

    // Contact Form State
    const [contact, setContact] = useState({ name: "", email: "", message: "" });
    const [contactStatus, setContactStatus] = useState({ text: "", type: "" });
    const [sending, setSending] = useState(false);

    // Project Detail Lightbox State
    const [selectedProject, setSelectedProject] = useState<any | null>(null);
    const [activeImgIndex, setActiveImgIndex] = useState(0);

    const openProjectDetails = (proj: any) => {
        setSelectedProject(proj);
        setActiveImgIndex(0);
    };

    const closeProjectDetails = () => {
        setSelectedProject(null);
    };

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, url: string) => {
        const target = e.currentTarget;
        if (url && url.startsWith("/uploads/") && !target.src.includes(REMOTE_ASSET_BASE)) {
            target.src = `${REMOTE_ASSET_BASE}${url}`;
        }
    };

    const nextImage = (e: React.MouseEvent, max: number) => {
        e.stopPropagation();
        setActiveImgIndex(prev => (prev + 1) % max);
    };

    const prevImage = (e: React.MouseEvent, max: number) => {
        e.stopPropagation();
        setActiveImgIndex(prev => (prev - 1 + max) % max);
    };

    // Inline Card Slider State
    const [cardImageIndices, setCardImageIndices] = useState<Record<string, number>>({});

    const handleCardNextImage = (e: React.MouseEvent, proj: any) => {
        e.stopPropagation();
        const urls = proj.imageUrls && proj.imageUrls.length > 0 ? proj.imageUrls : [proj.imageUrl];
        setCardImageIndices(prev => ({
            ...prev,
            [proj._id]: ((prev[proj._id] || 0) + 1) % urls.length
        }));
    };

    const handleCardPrevImage = (e: React.MouseEvent, proj: any) => {
        e.stopPropagation();
        const urls = proj.imageUrls && proj.imageUrls.length > 0 ? proj.imageUrls : [proj.imageUrl];
        setCardImageIndices(prev => ({
            ...prev,
            [proj._id]: ((prev[proj._id] || 0) - 1 + urls.length) % urls.length
        }));
    };

    // Fetch core content & projects on mount
    useEffect(() => {
        const loadPageData = async () => {
            try {
                const contentRes = await axios.get("/api/public/content");
                setContent(contentRes.data.data);

                const projectsRes = await axios.get("/api/public/projects");
                setProjects(projectsRes.data.data);
            } catch (err) {
                console.error("Failed to load page content:", err);
            } finally {
                setLoading(false);
            }
        };
        loadPageData();
    }, []);

    // Filter projects by category
    const handleCategoryChange = async (category: string) => {
        setSelectedCategory(category);
        try {
            setLoadingProjects(true);
            const res = await axios.get(`/api/public/projects?category=${category}`);
            setProjects(res.data.data);
        } catch (err) {
            console.error("Failed to filter projects:", err);
        } finally {
            setLoadingProjects(false);
        }
    };

    // Submit inquiry
    const handleContactSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setContactStatus({ text: "", type: "" });

        if (!contact.name || !contact.email || !contact.message) {
            setContactStatus({ text: "Please fill out all fields.", type: "error" });
            return;
        }

        try {
            setSending(true);
            const res = await axios.post("/api/public/inquiry", contact);
            setContactStatus({ text: res.data.message, type: "success" });
            setContact({ name: "", email: "", message: "" });
        } catch (err: any) {
            setContactStatus({ text: err.response?.data?.error || "Failed to send message.", type: "error" });
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center font-sans text-white">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-bold">Loading Space...</p>
            </div>
        );
    }

    const hero = content?.sections?.hero || {};
    const footer = content?.sections?.footer || {};
    const processes = content?.processes || [];
    const services = content?.services || [];

    const categories = ["All", "Commercial", "Industrial", "Residential"];

    return (
        <div className="bg-neutral-50 text-slate-900 font-sans selection:bg-indigo-600 selection:text-white min-h-screen">
            
            {/* Header / Navbar */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <span className="font-extrabold text-base tracking-[0.25em] text-slate-900 uppercase">
                        {footer.title || "URBAN STYLE SPACE"}
                    </span>
                    <nav className="hidden md:flex items-center gap-10">
                        <a href="#hero" className="text-xs font-bold tracking-widest text-slate-600 hover:text-indigo-600 transition uppercase">Home</a>
                        <a href="#process" className="text-xs font-bold tracking-widest text-slate-600 hover:text-indigo-600 transition uppercase">Process</a>
                        <a href="#services" className="text-xs font-bold tracking-widest text-slate-600 hover:text-indigo-600 transition uppercase">Services</a>
                        <a href="#portfolio" className="text-xs font-bold tracking-widest text-slate-600 hover:text-indigo-600 transition uppercase">Portfolio</a>
                        <a href="#contact" className="text-xs font-bold tracking-widest text-slate-600 hover:text-indigo-600 transition uppercase">Contact</a>
                    </nav>
                    <Link 
                        href="/dashboard/login"
                        className="text-xs font-bold tracking-widest border border-slate-900 px-5 py-2.5 hover:bg-slate-900 hover:text-white transition uppercase rounded-lg"
                    >
                        Portal Login
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-neutral-900 text-white">
                <div className="absolute inset-0 z-0">
                    <img 
                        src={hero.mediaUrl || "/assets/generated/hero-residence.dim_1920x1080.jpg"} 
                        onError={(e) => handleImageError(e, hero.mediaUrl)}
                        className="h-full w-full object-cover opacity-35" 
                        alt="Hero Bg" 
                    />
                </div>
                <div className="max-w-7xl mx-auto px-6 w-full relative z-10 space-y-6">
                    <span className="text-xs font-bold tracking-[0.3em] text-indigo-400 block uppercase">
                        {hero.subtitle || "INTERIOR DESIGN & EXECUTION"}
                    </span>
                    <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight tracking-tight max-w-3xl">
                        {hero.title?.split("Environments")[0]}
                        <span className="text-indigo-400">Environments.</span>
                    </h1>
                    <p className="text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed">
                        {hero.description || "We engineer environments that reflect the identity and ambition of our clients."}
                    </p>
                    <div className="pt-4">
                        <a 
                            href="#portfolio"
                            className="inline-block bg-white text-slate-950 font-bold tracking-widest text-xs px-8 py-4 hover:bg-indigo-500 hover:text-white transition uppercase rounded-lg shadow-lg"
                        >
                            {hero.ctaText || "EXPLORE OUR WORK"}
                        </a>
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section id="process" className="py-24 md:py-32 px-6 bg-white border-t border-neutral-100">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-16 max-w-2xl">
                        <span className="text-xs font-bold text-indigo-600 tracking-[0.25em] block mb-3 uppercase">HOW WE WORK</span>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">A Proven Three-Phase Process</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {processes.map((proc: any) => (
                            <div key={proc._id} className="bg-neutral-50 border border-neutral-200 rounded-2xl p-8 shadow-sm flex flex-col justify-between">
                                <div>
                                    <span className="text-4xl font-extrabold text-indigo-200 block mb-4">{proc.phaseNumber}</span>
                                    <h3 className="font-extrabold text-lg text-slate-900 tracking-tight uppercase">{proc.phaseTitle}</h3>
                                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wide block mb-6">{proc.phaseSubtitle}</span>
                                    <ul className="space-y-3">
                                        {proc.steps.map((step: string, index: number) => (
                                            <li key={index} className="text-sm text-slate-600 flex items-center gap-3">
                                                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 block"></span>
                                                {step}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-24 md:py-32 px-6 bg-neutral-50 border-t border-neutral-100">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-16 max-w-2xl">
                        <span className="text-xs font-bold text-indigo-600 tracking-[0.25em] block mb-3 uppercase">WHAT WE DO</span>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">End-to-End Interior Execution</h2>
                        <p className="text-sm text-slate-500 mt-3">From concept to handover &mdash; we handle every layer of your space.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((serv: any) => (
                            <div key={serv._id} className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs hover:shadow-sm transition flex items-center gap-4">
                                <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="font-semibold text-slate-800 text-sm">{serv.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Portfolio Section */}
            <section id="portfolio" className="py-24 md:py-32 px-6 bg-white border-t border-neutral-100">
                <div className="max-w-7xl mx-auto">
                    
                    {/* Header & Filters */}
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
                        <div>
                            <span className="text-xs font-bold text-indigo-600 tracking-[0.25em] block mb-3 uppercase">EXPLORE OUR WORK</span>
                            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">Projects Showcase</h2>
                        </div>
                        {/* Categories filters */}
                        <div className="flex flex-wrap gap-2">
                            {categories.map(cat => (
                                <button 
                                    key={cat}
                                    onClick={() => handleCategoryChange(cat)}
                                    className={`px-5 py-2 text-xs font-bold tracking-widest uppercase transition rounded-lg border ${
                                        selectedCategory === cat 
                                            ? "bg-slate-900 border-slate-900 text-white shadow-md" 
                                            : "bg-white border-neutral-200 text-slate-600 hover:bg-neutral-50"
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Gallery Grid */}
                    {loadingProjects ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="text-center py-20 text-slate-400 font-medium text-sm">
                            No projects found in this category.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {projects.map((proj: any) => (
                                <article 
                                    key={proj._id} 
                                    onClick={() => openProjectDetails(proj)}
                                    className="bg-neutral-50 border border-neutral-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition duration-200 flex flex-col h-full group cursor-pointer"
                                >
                                    <div className="h-56 overflow-hidden bg-neutral-100 relative shrink-0">
                                        <img 
                                            src={
                                                proj.imageUrls && proj.imageUrls.length > 0
                                                    ? proj.imageUrls[cardImageIndices[proj._id] || 0]
                                                    : proj.imageUrl
                                            } 
                                            onError={(e) => handleImageError(e, proj.imageUrls && proj.imageUrls.length > 0 ? proj.imageUrls[cardImageIndices[proj._id] || 0] : proj.imageUrl)}
                                            className="h-full w-full object-cover group-hover:scale-102 transition duration-300 select-none" 
                                            alt={proj.title} 
                                        />
                                        <span className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider z-10">
                                            {proj.category}
                                        </span>
                                        
                                        {/* Inline Slider Indicators / Navigation */}
                                        {proj.imageUrls && proj.imageUrls.length > 1 ? (
                                            <>
                                                {/* Left Arrow */}
                                                <button
                                                    onClick={(e) => handleCardPrevImage(e, proj)}
                                                    className="absolute left-2.5 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full transition duration-150 z-10 opacity-0 group-hover:opacity-100 cursor-pointer select-none"
                                                >
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                                                    </svg>
                                                </button>
                                                
                                                {/* Right Arrow */}
                                                <button
                                                    onClick={(e) => handleCardNextImage(e, proj)}
                                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full transition duration-150 z-10 opacity-0 group-hover:opacity-100 cursor-pointer select-none"
                                                >
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </button>

                                                {/* Dot Indicators */}
                                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10 bg-black/30 backdrop-blur-xs px-2.5 py-1 rounded-full">
                                                    {proj.imageUrls.map((_: any, idx: number) => {
                                                        const activeIdx = cardImageIndices[proj._id] || 0;
                                                        return (
                                                            <span 
                                                                key={idx} 
                                                                className={`h-1.5 w-1.5 rounded-full transition-all duration-150 ${
                                                                    activeIdx === idx ? "bg-white scale-110" : "bg-white/45"
                                                                }`}
                                                            />
                                                        );
                                                    })}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                                        <div className="space-y-2">
                                            <h3 className="font-extrabold text-lg text-slate-900 tracking-tight leading-snug group-hover:text-indigo-600 transition duration-150">{proj.title}</h3>
                                            <div className="flex gap-2 text-xs text-slate-400 font-medium">
                                                <span>{proj.location}</span>
                                                <span>&bull;</span>
                                                <span>{proj.year}</span>
                                            </div>
                                            <p className="text-slate-600 text-xs leading-relaxed font-normal line-clamp-3">
                                                {proj.description}
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-24 md:py-32 px-6 bg-neutral-900 text-white border-t border-neutral-800">
                <div className="max-w-4xl mx-auto text-center space-y-12">
                    <div className="space-y-4">
                        <span className="text-xs font-bold text-indigo-400 tracking-[0.25em] block uppercase">INQUIRIES</span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Let's Design Your Space</h2>
                        <p className="text-slate-400 text-sm max-w-lg mx-auto">
                            Submit your project criteria below, and our engineering design leads will get in touch with you shortly.
                        </p>
                    </div>

                    {contactStatus.text && (
                        <div className={`p-4 rounded-xl text-sm border max-w-md mx-auto ${
                            contactStatus.type === "success" 
                                ? "bg-green-950/20 border-green-500/30 text-green-400" 
                                : "bg-red-950/20 border-red-500/30 text-red-400"
                        }`}>
                            {contactStatus.text}
                        </div>
                    )}

                    <form onSubmit={handleContactSubmit} className="max-w-md mx-auto text-left space-y-6">
                        <div>
                            <input 
                                type="text"
                                placeholder="Your Name"
                                value={contact.name}
                                onChange={e => setContact({ ...contact, name: e.target.value })}
                                className="w-full bg-transparent border-b border-slate-700 py-3 text-sm text-white focus:outline-none focus:border-indigo-400 transition"
                            />
                        </div>
                        <div>
                            <input 
                                type="email"
                                placeholder="Email Address"
                                value={contact.email}
                                onChange={e => setContact({ ...contact, email: e.target.value })}
                                className="w-full bg-transparent border-b border-slate-700 py-3 text-sm text-white focus:outline-none focus:border-indigo-400 transition"
                            />
                        </div>
                        <div>
                            <textarea 
                                placeholder="Tell us about your project (location, scope, scale...)"
                                value={contact.message}
                                onChange={e => setContact({ ...contact, message: e.target.value })}
                                rows={4}
                                className="w-full bg-transparent border-b border-slate-700 py-3 text-sm text-white focus:outline-none focus:border-indigo-400 transition resize-none"
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={sending}
                            className={`w-full py-3.5 rounded-lg text-xs font-bold tracking-widest uppercase transition ${
                                sending ? "bg-slate-700 text-slate-500 cursor-not-allowed" : "bg-white text-slate-950 hover:bg-indigo-500 hover:text-white"
                            }`}
                        >
                            {sending ? "Sending..." : "Send Inquiry"}
                        </button>
                    </form>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-neutral-950 text-slate-400 py-16 px-6 border-t border-neutral-900 text-sm">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="space-y-4">
                        <span className="font-extrabold text-white tracking-widest uppercase">{footer.title || "URBAN STYLE SPACE"}</span>
                        <p className="text-slate-500 text-xs leading-relaxed max-w-xs">
                            {footer.description || "We engineer environments that reflect the identity and ambition of our clients."}
                        </p>
                    </div>
                    <div className="space-y-4">
                        <span className="font-bold text-white tracking-wider uppercase">Contact Channels</span>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Email: contact@urbanstylespace.com<br />
                            Office hours: Mon - Fri: 9:00 AM - 6:00 PM
                        </p>
                    </div>
                    <div className="space-y-4">
                        <span className="font-bold text-white tracking-wider uppercase">Portal Access</span>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Authorized project heads can access workspace configurations inside the administrative portal.
                        </p>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto border-t border-neutral-900 mt-12 pt-8 text-center text-xs text-slate-600">
                    &copy; {new Date().getFullYear()} Urban Style Space. All rights reserved.
                </div>
            </footer>

            {/* Project Details Lightbox Modal */}
            {selectedProject && (() => {
                const gallery = selectedProject.imageUrls && selectedProject.imageUrls.length > 0
                    ? selectedProject.imageUrls
                    : [selectedProject.imageUrl];
                const activeUrl = gallery[activeImgIndex] || "";
                return (
                    <div 
                        className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-8 animate-in fade-in duration-200"
                        onClick={closeProjectDetails}
                    >
                        <div 
                            className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-5xl w-full h-[85vh] sm:h-[75vh] md:h-[70vh] flex flex-col md:flex-row relative animate-in zoom-in-95 duration-200"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Close button */}
                            <button 
                                onClick={closeProjectDetails}
                                className="absolute top-4 right-4 z-10 bg-slate-900/80 hover:bg-slate-950 text-white p-2.5 rounded-full transition shadow cursor-pointer focus:outline-none"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Left Column: Image Viewer */}
                            <div className="flex-1 bg-slate-950 relative flex items-center justify-center min-h-[40%] md:min-h-0">
                                <img 
                                    src={activeUrl} 
                                    onError={(e) => handleImageError(e, activeUrl)}
                                    className="max-h-full max-w-full object-contain select-none" 
                                    alt={`${selectedProject.title} Detail`} 
                                />

                                {/* Carousel Navigation Arrows */}
                                {gallery.length > 1 && (
                                    <>
                                        <button 
                                            onClick={(e) => prevImage(e, gallery.length)}
                                            className="absolute left-4 bg-black/45 hover:bg-black/65 text-white p-3 rounded-full transition cursor-pointer select-none"
                                        >
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <button 
                                            onClick={(e) => nextImage(e, gallery.length)}
                                            className="absolute right-4 bg-black/45 hover:bg-black/65 text-white p-3 rounded-full transition cursor-pointer select-none"
                                        >
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </>
                                )}

                                {/* Image count indicator */}
                                {gallery.length > 1 && (
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-widest uppercase">
                                        {activeImgIndex + 1} / {gallery.length}
                                    </div>
                                )}
                            </div>

                            {/* Right Column: Project Info */}
                            <div className="w-full md:w-[360px] p-6 sm:p-8 flex flex-col justify-between overflow-y-auto border-t md:border-t-0 md:border-l border-neutral-100 bg-white">
                                <div className="space-y-5">
                                    {/* Category badge */}
                                    <div>
                                        <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest">
                                            {selectedProject.category}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
                                        {selectedProject.title}
                                    </h3>

                                    {/* Meta grid */}
                                    <div className="grid grid-cols-2 gap-4 border-y border-neutral-100 py-4">
                                        <div>
                                            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Location</span>
                                            <span className="text-sm font-semibold text-slate-800">{selectedProject.location}</span>
                                        </div>
                                        <div>
                                            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Year</span>
                                            <span className="text-sm font-semibold text-slate-800">{selectedProject.year}</span>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-2">
                                        <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Project Scope</span>
                                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal">
                                            {selectedProject.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Thumbnail indicator roll */}
                                {gallery.length > 1 && (
                                    <div className="pt-6 mt-6 border-t border-neutral-100">
                                        <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Gallery Preview</span>
                                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-neutral-200">
                                            {gallery.map((url: string, idx: number) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setActiveImgIndex(idx)}
                                                    className={`h-10 w-14 rounded-md overflow-hidden border shrink-0 transition cursor-pointer ${
                                                        activeImgIndex === idx 
                                                            ? "border-indigo-600 ring-2 ring-indigo-100" 
                                                            : "border-neutral-200 hover:border-neutral-400"
                                                    }`}
                                                >
                                                    <img 
                                                        src={url} 
                                                        onError={(e) => handleImageError(e, url)}
                                                        className="h-full w-full object-cover" 
                                                        alt="thumb" 
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })()}

        </div>
    );
}
