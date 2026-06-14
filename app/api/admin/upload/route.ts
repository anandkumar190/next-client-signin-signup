import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getDataFromToken } from "@/helpers/getDataFromToken";

// Helper to authenticate
function authenticate(request: NextRequest) {
    try {
        getDataFromToken(request);
        return true;
    } catch {
        return false;
    }
}

export async function POST(request: NextRequest) {
    if (!authenticate(request)) {
        return NextResponse.json({ success: false, error: "Unauthorized access." }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ success: false, error: "No file was uploaded." }, { status: 400 });
        }

        // Validate file type
        const validTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json({ 
                success: false, 
                error: "Invalid file type. Only JPG, PNG, WEBP, and SVG are allowed." 
            }, { status: 400 });
        }

        // Validate file size (5MB limit)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json({ 
                success: false, 
                error: "File size exceeds the 5MB limit." 
            }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Define upload path inside the public/uploads folder
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        
        // Ensure upload directory exists
        await mkdir(uploadDir, { recursive: true });

        // Generate a unique filename to avoid overwrites
        const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
        const filePath = path.join(uploadDir, filename);

        // Write file to local disk
        await writeFile(filePath, buffer);

        // Return client-accessible URL path
        const fileUrl = `/uploads/${filename}`;

        return NextResponse.json({
            success: true,
            message: "File uploaded successfully!",
            url: fileUrl
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
