import { connect } from "@/dbConfig/dbConfig";
import Seo from "@/models/seoModel";
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
        const { pagePath, title, description, keywords, ogImage, canonicalUrl } = body;

        if (!pagePath) {
            return NextResponse.json({ success: false, error: "pagePath is required." }, { status: 400 });
        }

        if (!title) {
            return NextResponse.json({ success: false, error: "title is required." }, { status: 400 });
        }

        const seo = await Seo.findOneAndUpdate(
            { pagePath },
            { 
                title, 
                description, 
                keywords: Array.isArray(keywords) ? keywords.map((k: string) => k.trim()) : [], 
                ogImage, 
                canonicalUrl 
            },
            { new: true, upsert: true }
        );

        return NextResponse.json({
            success: true,
            message: "SEO metadata updated successfully!",
            data: seo
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
