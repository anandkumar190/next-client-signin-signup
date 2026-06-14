import { connect } from "@/dbConfig/dbConfig";
import Process from "@/models/processModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";

connect();

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
        const processes = await Process.find({}).sort({ order: 1 });
        return NextResponse.json({ success: true, data: processes }, { status: 200 });
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
        const { phaseNumber, phaseTitle, phaseSubtitle, steps, order } = body;

        if (!phaseNumber || !phaseTitle || !phaseSubtitle) {
            return NextResponse.json({ success: false, error: "Missing required fields." }, { status: 400 });
        }

        const newProcess = new Process({
            phaseNumber,
            phaseTitle,
            phaseSubtitle,
            steps: Array.isArray(steps) ? steps.map((s: string) => s.trim()) : [],
            order: order ?? 0
        });

        await newProcess.save();

        return NextResponse.json({
            success: true,
            message: "Process phase added successfully!",
            data: newProcess
        }, { status: 201 });

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
        const { _id, phaseNumber, phaseTitle, phaseSubtitle, steps, order } = body;

        if (!_id) {
            return NextResponse.json({ success: false, error: "Process ID (_id) is required." }, { status: 400 });
        }

        const updatedProcess = await Process.findByIdAndUpdate(
            _id,
            { phaseNumber, phaseTitle, phaseSubtitle, steps: Array.isArray(steps) ? steps.map((s: string) => s.trim()) : [], order },
            { new: true }
        );

        if (!updatedProcess) {
            return NextResponse.json({ success: false, error: "Process phase not found." }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Process phase updated successfully!",
            data: updatedProcess
        }, { status: 200 });

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
            return NextResponse.json({ success: false, error: "Process ID is required as query param ?id=" }, { status: 400 });
        }

        const deletedProcess = await Process.findByIdAndDelete(id);

        if (!deletedProcess) {
            return NextResponse.json({ success: false, error: "Process phase not found." }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Process phase deleted successfully!"
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
