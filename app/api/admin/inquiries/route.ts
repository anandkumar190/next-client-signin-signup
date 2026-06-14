import { connect } from "@/dbConfig/dbConfig";
import Inquiry from "@/models/inquiryModel";
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
        const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: inquiries }, { status: 200 });
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
        const { _id, isRead } = body;

        if (!_id) {
            return NextResponse.json({ success: false, error: "Inquiry ID (_id) is required." }, { status: 400 });
        }

        const inquiry = await Inquiry.findByIdAndUpdate(
            _id,
            { isRead },
            { new: true }
        );

        if (!inquiry) {
            return NextResponse.json({ success: false, error: "Inquiry not found." }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Inquiry marked as read!", data: inquiry }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
