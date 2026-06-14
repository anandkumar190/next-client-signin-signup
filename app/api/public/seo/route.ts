import { connect } from "@/dbConfig/dbConfig";
import Seo from "@/models/seoModel";
import { NextRequest, NextResponse } from "next/server";

connect();

async function seedDefaultSeo() {
    let homeSeo = await Seo.findOne({ pagePath: "/" });
    if (!homeSeo) {
        await Seo.create({
            pagePath: "/",
            title: "Urban Style Space | Interior Design & Execution",
            description: "Urban Style Space is a premier interior design and execution firm specializing in high-impact commercial and corporate environments.",
            keywords: ["interior design", "interior execution", "office interiors", "commercial design", "Rajeev Kumar Ranjan"],
            canonicalUrl: "https://www.urbanstylespace.com",
            brandName: "URBAN STYLE SPACE",
            logo: "",
            ogType: "website",
            favicon: ""
        });
    } else {
        let needsUpdate = false;
        if (homeSeo.brandName === undefined || homeSeo.brandName === "") {
            homeSeo.brandName = "URBAN STYLE SPACE";
            needsUpdate = true;
        }
        if (homeSeo.logo === undefined) {
            homeSeo.logo = "";
            needsUpdate = true;
        }
        if (homeSeo.ogType === undefined || homeSeo.ogType === "") {
            homeSeo.ogType = "website";
            needsUpdate = true;
        }
        if (homeSeo.favicon === undefined) {
            homeSeo.favicon = "";
            needsUpdate = true;
        }
        if (needsUpdate) {
            await homeSeo.save();
        }
    }
}

export async function GET(request: NextRequest) {
    try {
        await seedDefaultSeo();

        const url = new URL(request.url);
        const pagePath = url.searchParams.get("pagePath") || "/";

        const seo = await Seo.findOne({ pagePath });

        return NextResponse.json({
            success: true,
            data: seo
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
