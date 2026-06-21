import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
    request: NextRequest,
    { params }: { params: any }
) {
    try {
        const resolvedParams = await params;
        const filename = resolvedParams?.filename;

        if (!filename) {
            return new NextResponse("Filename parameter missing", { status: 400 });
        }

        // Define the target path on local disk
        const filePath = path.join(process.cwd(), "public", "uploads", filename);

        // Security check: Make sure the resolved path is inside public/uploads to prevent directory traversal
        const safePath = path.normalize(filePath);
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        if (!safePath.startsWith(uploadDir)) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        // If the file does not exist, return a 404
        if (!fs.existsSync(safePath)) {
            return new NextResponse("File not found on local disk", { status: 404 });
        }

        const fileBuffer = fs.readFileSync(safePath);

        // Determine correct Content-Type header based on file extension
        const ext = path.extname(filename).toLowerCase();
        let contentType = "application/octet-stream";
        if (ext === ".png") contentType = "image/png";
        else if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
        else if (ext === ".webp") contentType = "image/webp";
        else if (ext === ".svg") contentType = "image/svg+xml";
        else if (ext === ".gif") contentType = "image/gif";

        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch (error: any) {
        return new NextResponse(error.message || "Internal Server Error", { status: 500 });
    }
}
