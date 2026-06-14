import { connect } from "@/dbConfig/dbConfig";
import Service from "@/models/serviceModel";
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
        const services = await Service.find({}).sort({ order: 1 });
        return NextResponse.json({ success: true, data: services }, { status: 200 });
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
        const { name, isActive, order } = body;

        if (!name) {
            return NextResponse.json({ success: false, error: "Service name is required." }, { status: 400 });
        }

        const service = new Service({
            name,
            isActive: isActive ?? true,
            order: order ?? 0
        });

        await service.save();

        return NextResponse.json({ success: true, message: "Service added successfully!", data: service }, { status: 201 });
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
        const { _id, name, isActive, order } = body;

        if (!_id) {
            return NextResponse.json({ success: false, error: "Service ID (_id) is required." }, { status: 400 });
        }

        const service = await Service.findByIdAndUpdate(
            _id,
            { name, isActive, order },
            { new: true }
        );

        if (!service) {
            return NextResponse.json({ success: false, error: "Service not found." }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Service updated successfully!", data: service }, { status: 200 });
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
            return NextResponse.json({ success: false, error: "Service ID is required as query param ?id=" }, { status: 400 });
        }

        const service = await Service.findByIdAndDelete(id);

        if (!service) {
            return NextResponse.json({ success: false, error: "Service not found." }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Service deleted successfully!" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
