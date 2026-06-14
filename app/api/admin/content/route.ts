import { connect } from "@/dbConfig/dbConfig";
import Section from "@/models/sectionModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function PUT(request: NextRequest) {
    try {
        // Authenticate admin token
        try {
            getDataFromToken(request);
        } catch (authError) {
            return NextResponse.json({ success: false, error: "Unauthorized access." }, { status: 401 });
        }

        const body = await request.json();
        const { sectionKey, title, subtitle, description, mediaUrl, ctaText } = body;

        if (!sectionKey) {
            return NextResponse.json({ success: false, error: "sectionKey is required." }, { status: 400 });
        }

        const section = await Section.findOneAndUpdate(
            { sectionKey },
            { title, subtitle, description, mediaUrl, ctaText },
            { new: true, upsert: true }
        );

        return NextResponse.json({
            success: true,
            message: "Section updated successfully!",
            data: section
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
