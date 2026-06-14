import { connect } from "@/dbConfig/dbConfig";
import About from "@/models/aboutModel";
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

export async function PUT(request: NextRequest) {
    if (!authenticate(request)) {
        return NextResponse.json({ success: false, error: "Unauthorized access." }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { title, subtitle, introText, narrative, notableClients, stats, slides, founderName, founderRole, founderInitials, founderBio, founderExpertise } = body;

        const about = await About.findOneAndUpdate(
            {},
            { title, subtitle, introText, narrative, notableClients, stats, slides, founderName, founderRole, founderInitials, founderBio, founderExpertise },
            { new: true, upsert: true }
        );

        return NextResponse.json({
            success: true,
            message: "About section updated successfully!",
            data: about
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
