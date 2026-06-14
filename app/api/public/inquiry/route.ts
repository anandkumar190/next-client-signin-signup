import { connect } from "@/dbConfig/dbConfig";
import Inquiry from "@/models/inquiryModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        let { name, email, message } = body;

        name = name?.trim();
        email = email?.trim().toLowerCase();
        message = message?.trim();

        if (!name || !email || !message) {
            return NextResponse.json({
                success: false,
                error: "All fields (name, email, message) are required."
            }, { status: 400 });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({
                success: false,
                error: "Invalid email format."
            }, { status: 400 });
        }

        const newInquiry = new Inquiry({
            name,
            email,
            message
        });

        await newInquiry.save();

        return NextResponse.json({
            success: true,
            message: "Inquiry sent successfully!"
        }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
