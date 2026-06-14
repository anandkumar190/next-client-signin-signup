import { connect } from "@/dbConfig/dbConfig";
import Section from "@/models/sectionModel";
import Process from "@/models/processModel";
import Service from "@/models/serviceModel";
import About from "@/models/aboutModel";
import ContactConfig from "@/models/contactConfigModel";
import { NextRequest, NextResponse } from "next/server";

connect();

async function seedDefaultContent() {
    // 1. Seed Hero & Footer Sections
    const hero = await Section.findOne({ sectionKey: "hero" });
    if (!hero) {
        await Section.create({
            sectionKey: "hero",
            title: "We Engineer",
            subtitle: "INTERIOR DESIGN & EXECUTION",
            description: "We engineer environments that reflect the identity and ambition of our clients.",
            mediaUrl: "/assets/generated/hero-residence.dim_1920x1080.jpg",
            ctaText: "EXPLORE OUR WORK"
        });
    }

    const footer = await Section.findOne({ sectionKey: "footer" });
    if (!footer) {
        await Section.create({
            sectionKey: "footer",
            title: "URBAN STYLE SPACE",
            description: "We engineer environments that reflect the identity and ambition of our clients."
        });
    }

    // 2. Seed Processes
    const processCount = await Process.countDocuments();
    if (processCount === 0) {
        await Process.insertMany([
            {
                phaseNumber: "01",
                phaseTitle: "CONCEPT DESIGN",
                phaseSubtitle: "The Vision Phase",
                steps: [
                    "Client Briefing",
                    "Site Analysis",
                    "Design Workshop",
                    "Concept Studies",
                    "Budgetary Assistance",
                    "Conceptual Presentation"
                ],
                order: 1
            },
            {
                phaseNumber: "02",
                phaseTitle: "DESIGN DEVELOPMENT",
                phaseSubtitle: "The Technical Phase",
                steps: [
                    "Preliminary Layouts",
                    "Execution Drawings",
                    "Package BOQ Preparation",
                    "Tendering & Comparisons"
                ],
                order: 2
            },
            {
                phaseNumber: "03",
                phaseTitle: "EXECUTION",
                phaseSubtitle: "The Delivery Phase",
                steps: [
                    "Work Order Management",
                    "Project Kick-off",
                    "Stakeholder Reporting",
                    "Performance Monitoring",
                    "Deviation Management",
                    "Final Handover"
                ],
                order: 3
            }
        ]);
    }

    // 3. Seed Services
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
        const defaultServices = [
            "Site Survey",
            "Space Planning",
            "Civil & Interior Work",
            "Electrical Work",
            "HVAC Work",
            "Ceiling Work",
            "Fire Alarm Systems",
            "Networking & Server Racks",
            "UPS & DG",
            "Modular / Customised Furniture"
        ];
        const servicePayloads = defaultServices.map((name, index) => ({
            name,
            isActive: true,
            order: index
        }));
        await Service.insertMany(servicePayloads);
    }

    // 4. Seed About Us Configuration
    const aboutCount = await About.countDocuments();
    if (aboutCount === 0) {
        await About.create({
            title: "Built on Experience. Driven by Craft.",
            subtitle: "ABOUT US",
            introText: "A premier design & execution studio specialising in commercial and corporate environments.",
            narrative: "Urban Style Space is a premier interior design and execution firm specializing in high-impact commercial and corporate environments. Led by founder Rajeev Kumar Ranjan, with over 7 years of specialized experience in banking infrastructure, retail, and large-scale corporate rollouts.",
            notableClients: "Axis Bank · Yes Bank · Bajaj Finserv · Sahayog Bank · Crocs · Red Chief · Samsonite · Timex · Tupperware · Samvardhana Motherson · Baker By Chance · Envision",
            stats: [
                { value: "7+", label: "Years", sub: "Of Experience" },
                { value: "10+", label: "Brand Clients", sub: "Across India" },
                { value: "50+", label: "Projects", sub: "Delivered" }
            ],
            slides: [
                {
                    src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80",
                    alt: "Corporate office interior",
                    tag: "Corporate · Banking",
                },
                {
                    src: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=800&q=80",
                    alt: "Retail store interior design",
                    tag: "Retail · Commercial",
                },
                {
                    src: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=80",
                    alt: "Modern office space",
                    tag: "Office · Workspace",
                },
                {
                    src: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80",
                    alt: "Luxury interior execution",
                    tag: "Luxury · Corporate",
                }
            ],
            founderName: "Rajeev Kumar Ranjan",
            founderRole: "Founder & Principal Designer",
            founderInitials: "RR",
            founderBio: "Our foundation may be new, but it's backed by 7 years of deep experience. Expert in AutoCAD (2D & 3D), 3Ds Max visualization, BOQ preparation, project scheduling, and team management.",
            founderExpertise: ["AutoCAD 2D & 3D", "3Ds Max", "BOQ Preparation", "Project Scheduling"]
        });
    }

    // 5. Seed Contact Configuration
    const contactConfigCount = await ContactConfig.countDocuments();
    if (contactConfigCount === 0) {
        await ContactConfig.create({
            addressLine1: "First Floor Room No-2, Kh no-167,",
            addressLine2: "H NO-B-63/1, Kirti Vihar Colony,",
            addressLine3: "Loni, Ghaziabad, U.P. - 201102",
            addressShort: "Kirti Vihar Colony, Loni\nGhaziabad, U.P. — India",
            email: "urbanstylespace@gmail.com",
            phone: "+91 6202592267",
            website: "www.urbanstylespace.com",
            websiteUrl: "https://www.urbanstylespace.com",
            hours: "Mon – Sat, 9am – 7pm IST"
        });
    }
}

export async function GET(request: NextRequest) {
    try {
        await seedDefaultContent();

        const sections = await Section.find({});
        const processes = await Process.find({}).sort({ order: 1 });
        const services = await Service.find({ isActive: true }).sort({ order: 1 });
        const about = await About.findOne({});
        const contactConfig = await ContactConfig.findOne({});

        // Map sections array to object keys for easier client consumption
        const contentMap: any = {};
        sections.forEach(sec => {
            contentMap[sec.sectionKey] = sec;
        });

        return NextResponse.json({
            success: true,
            data: {
                sections: contentMap,
                processes,
                services,
                about,
                contactConfig
            }
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
}
