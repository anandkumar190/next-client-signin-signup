import { connect } from "@/dbConfig/dbConfig";
import Project from "@/models/projectModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";

connect();

// Helper to authenticate
function authenticate(request: NextRequest) {
    try {
        getDataFromToken(request);
        return true;
    } catch {
        return false;
    }
}

export async function GET(request: NextRequest) {
    if (!authenticate(request)) {
        return NextResponse.json({ success: false, error: "Unauthorized access." }, { status: 401 });
    }

    try {
        const projects = await Project.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: projects }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    if (!authenticate(request)) {
        return NextResponse.json({ success: false, error: "Unauthorized access." }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { title, category, year, location, description, imageUrl, isActive } = body;

        if (!title || !category || !year || !location || !description || !imageUrl) {
            return NextResponse.json({ success: false, error: "Missing required fields." }, { status: 400 });
        }

        const project = new Project({
            title,
            category,
            year,
            location,
            description,
            imageUrl,
            isActive: isActive ?? true
        });

        await project.save();

        return NextResponse.json({ success: true, message: "Project created successfully!", data: project }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    if (!authenticate(request)) {
        return NextResponse.json({ success: false, error: "Unauthorized access." }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { _id, title, category, year, location, description, imageUrl, isActive } = body;

        if (!_id) {
            return NextResponse.json({ success: false, error: "Project ID (_id) is required." }, { status: 400 });
        }

        const project = await Project.findByIdAndUpdate(
            _id,
            { title, category, year, location, description, imageUrl, isActive },
            { new: true }
        );

        if (!project) {
            return NextResponse.json({ success: false, error: "Project not found." }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Project updated successfully!", data: project }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    if (!authenticate(request)) {
        return NextResponse.json({ success: false, error: "Unauthorized access." }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ success: false, error: "Project ID is required as query param ?id=" }, { status: 400 });
        }

        const project = await Project.findByIdAndDelete(id);

        if (!project) {
            return NextResponse.json({ success: false, error: "Project not found." }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Project deleted successfully!" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
