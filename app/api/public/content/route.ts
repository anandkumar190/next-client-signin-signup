import { connect } from "@/dbConfig/dbConfig";
import Section from "@/models/sectionModel";
import Process from "@/models/processModel";
import Service from "@/models/serviceModel";
import { NextRequest, NextResponse } from "next/server";

connect();

// Helper to seed initial data if collections are empty
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
}

export async function GET(request: NextRequest) {
    try {
        await seedDefaultContent();

        const sections = await Section.find({});
        const processes = await Process.find({}).sort({ order: 1 });
        const services = await Service.find({ isActive: true }).sort({ order: 1 });

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
                services
            }
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
}
