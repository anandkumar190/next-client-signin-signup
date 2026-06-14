import { connect } from "@/dbConfig/dbConfig";
import Project from "@/models/projectModel";
import { NextRequest, NextResponse } from "next/server";

connect();

const defaultProjects = [
    {
        title: "Baker By Chance",
        category: "Industrial",
        year: "2024",
        location: "Commercial",
        description: "Complete interior fit-out: tile installation, painting, pantry counter fabrication, ceiling and electrical works, ACP façade cladding, furniture design, branding integration.",
        imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
        isActive: true
    },
    {
        title: "Red Chief, Akbarpur",
        category: "Industrial",
        year: "2024",
        location: "U.P.",
        description: "Comprehensive interior fit-out: civil works, specialized painting, final installations.",
        imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
        isActive: true
    },
    {
        title: "Bella Steps",
        category: "Industrial",
        year: "2023",
        location: "Industrial",
        description: "Full design and execution, project incharge from inception to completion.",
        imageUrl: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&q=80",
        isActive: true
    },
    {
        title: "Axis Bank",
        category: "Commercial",
        year: "2023",
        location: "Commercial Infrastructure",
        description: "High-impact Commercial infrastructure, full project lifecycle: design development, BOQ optimization, on-site leadership.",
        imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
        isActive: true
    },
    {
        title: "Yes Bank — GMS Road, Dehradun",
        category: "Commercial",
        year: "2023",
        location: "Dehradun",
        description: "Technical oversight and site supervision, civil and partitions to high-end finishes.",
        imageUrl: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80",
        isActive: true
    },
    {
        title: "Bajaj Finserv, Moonak",
        category: "Commercial",
        year: "2022",
        location: "Punjab",
        description: "End-to-end execution and on-site management.",
        imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
        isActive: true
    },
    {
        title: "Crocs — Multi-City Rollout",
        category: "Industrial",
        year: "2023",
        location: "Ranchi, Patna, Delhi, Kochi",
        description: "Multiple brand outlets across four cities — design and execution lifecycle, civil and interior fit-out.",
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
        isActive: true
    },
    {
        title: "Tupperware Kiosk",
        category: "Industrial",
        year: "2022",
        location: "Industrial",
        description: "Complete kiosk fit-out, designer and project head.",
        imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80",
        isActive: true
    },
    {
        title: "Just Watches (Timex) — Lulu Mall Kochi",
        category: "Industrial",
        year: "2022",
        location: "Kochi",
        description: "Complete fit-out, designer and project head.",
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
        isActive: true
    },
    {
        title: "Mix Clients — Residential & Industrial",
        category: "Residential",
        year: "2024",
        location: "Multiple Locations",
        description: "Design & project coordination across multiple brand environments including American Tourister, Samvardhana Motherson, and more.",
        imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
        isActive: true
    }
];

async function seedDefaultProjects() {
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
        await Project.insertMany(defaultProjects);
    }
}

export async function GET(request: NextRequest) {
    try {
        await seedDefaultProjects();

        // Parse query params for category filtering
        const url = new URL(request.url);
        const category = url.searchParams.get("category");

        const filter: any = { isActive: true };
        if (category && category.toLowerCase() !== "all") {
            // Case-insensitive regex match for category
            filter.category = { $regex: new RegExp(`^${category}$`, "i") };
        }

        const projects = await Project.find(filter).sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: projects
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
