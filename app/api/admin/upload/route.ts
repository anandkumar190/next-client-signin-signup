import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
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
        
        // Support both single file ("file") or multiple files ("files" or multiple "file" fields)
        const files: File[] = [];
        const singleFile = formData.get("file");
        const multipleFiles = formData.getAll("files");
        const allSingleFiles = formData.getAll("file");

        if (multipleFiles && multipleFiles.length > 0) {
            files.push(...(multipleFiles as File[]));
        } else if (allSingleFiles && allSingleFiles.length > 0) {
            files.push(...(allSingleFiles as File[]));
        } else if (singleFile) {
            files.push(singleFile as File);
        }

        if (files.length === 0) {
            return NextResponse.json({ success: false, error: "No file was uploaded." }, { status: 400 });
        }

        // Validate file types and sizes first
        const validTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
        const maxSize = 5 * 1024 * 1024;
        
        for (const file of files) {
            if (!validTypes.includes(file.type)) {
                return NextResponse.json({ 
                    success: false, 
                    error: `Invalid file type for ${file.name}. Only JPG, PNG, WEBP, and SVG are allowed.` 
                }, { status: 400 });
            }
            if (file.size > maxSize) {
                return NextResponse.json({ 
                    success: false, 
                    error: `File "${file.name}" exceeds the 5MB limit.` 
                }, { status: 400 });
            }
        }

        const useCloud = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
        const urls: string[] = [];

        for (const file of files) {
            if (useCloud) {
                const timestamp = Math.round(new Date().getTime() / 1000).toString();
                const signatureStr = `timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`;
                const signature = crypto.createHash("sha1").update(signatureStr).digest("hex");

                const cloudFormData = new FormData();
                const bytes = await file.arrayBuffer();
                const blob = new Blob([bytes], { type: file.type });
                
                cloudFormData.append("file", blob, file.name);
                cloudFormData.append("api_key", process.env.CLOUDINARY_API_KEY!);
                cloudFormData.append("timestamp", timestamp);
                cloudFormData.append("signature", signature);

                const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`;
                const response = await fetch(cloudinaryUrl, {
                    method: "POST",
                    body: cloudFormData,
                });

                if (!response.ok) {
                    const errText = await response.text();
                    throw new Error(`Cloudinary upload failed: ${errText}`);
                }

                const data = await response.json();
                urls.push(data.secure_url);
            } else {
                const uploadDir = path.join(process.cwd(), "public", "uploads");
                
                // Ensure upload directory exists
                await mkdir(uploadDir, { recursive: true });

                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);

                // Generate a unique filename to avoid overwrites
                const filename = `${Date.now()}-${Math.floor(Math.random() * 1000000)}-${file.name.replace(/\s+/g, "_")}`;
                const filePath = path.join(uploadDir, filename);

                // Write file to local disk
                await writeFile(filePath, buffer);
                urls.push(`/uploads/${filename}`);
            }
        }

        return NextResponse.json({
            success: true,
            message: files.length > 1 ? "Files uploaded successfully!" : "File uploaded successfully!",
            urls: urls,
            url: urls[0] // Backward compatibility
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
