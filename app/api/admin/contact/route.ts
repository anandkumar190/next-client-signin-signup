import { connect } from "@/dbConfig/dbConfig";
import ContactConfig from "@/models/contactConfigModel";
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
        const { addressLine1, addressLine2, addressLine3, addressShort, email, phone, website, websiteUrl, hours } = body;

        const config = await ContactConfig.findOneAndUpdate(
            {},
            { addressLine1, addressLine2, addressLine3, addressShort, email, phone, website, websiteUrl, hours },
            { new: true, upsert: true }
        );

        return NextResponse.json({
            success: true,
            message: "Contact settings updated successfully!",
            data: config
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
