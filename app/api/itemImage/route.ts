

import { NextRequest, NextResponse } from 'next/server';
import ImageKit from 'imagekit';
import { getToken } from 'next-auth/jwt';
import db  from '@/backend/db'; // Adjust this to match your Drizzle setup
import { menuItems } from '@/backend/db/schema'; // Replace with your actual Drizzle schema
import { eq } from 'drizzle-orm';

// Configuration
const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!
});

const MAX_FILE_SIZE = 200 * 1024; // 200KB in bytes

export async function POST(request: NextRequest) {
    const token = await getToken({ req: request });
    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await request.formData();

        console.log(formData);
        
        const file = formData.get("file") as File | null;
        const itemId = formData.get("itemId");
        if (!file) {
            return NextResponse.json({ error: "File not found" }, { status: 400 });
        }

        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({
                error: "File size exceeds limit. Maximum size allowed is 200KB"
            }, { status: 400 });
        }

        if (!file.type.startsWith('image/')) {
            return NextResponse.json({
                error: "Only image files are allowed"
            }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64File = buffer.toString('base64');
        const timestamp = new Date().getTime();
        const uniqueFileName = `${timestamp}_${file.name.replace(/\s+/g, '_')}`;

        // Upload to ImageKit
        const result = await imagekit.upload({
            file: base64File,
            fileName: uniqueFileName,
            folder: `/Menu/items/${token.sub || 'general'}`
        });

        try {
            // Save to database
            const uploadRecord = {
                // userId: token.sub, // Adjust based on your user identification strategy
                // fileId: result.fileId,
                // url: result.url,
                // size: file.size,
                // fileName: uniqueFileName,
                // createdAt: new Date()
                imageFileId:result.fileId,
                imageUrl:result.url
            };

            await db.update(menuItems)
            .set(uploadRecord)
            .where(eq(menuItems.id, itemId)); // Use the correct method to specify the condition
            return NextResponse.json({
                fileId: result.fileId,
                url: result.url,
                size: file.size,
                filename: uniqueFileName
            }, { status: 200 });

        } catch (dbError) {
            // Rollback: Delete the uploaded file from ImageKit
            await imagekit.deleteFile(result.fileId);

            console.error("Database operation failed:", dbError);
            return NextResponse.json({
                error: "Database operation failed. Upload reverted.",
                details: dbError instanceof Error ? dbError.message : "Unknown error"
            }, { status: 500 });
        }

    } catch (error) {
        console.error("Error during upload or database operation:", error);

        return NextResponse.json({
            error: "Upload or save failed",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const fileIds = searchParams.get('fileIds');
    console.log(fileIds);
    
    // const { fileIds } = await request.json();
    // console.log(fileIds);
    
    if (!fileIds) {
        return NextResponse.json({ error: "Invalid file IDs" }, { status: 400 });
    }
    const fileIdArray = fileIds.split(',').filter(fileId => fileId.trim() !== '');
    console.log(fileIdArray);
    
    if (fileIdArray.length === 0) {
        return NextResponse.json({ error: "No valid file IDs provided" }, { status: 400 });
    }

    try {
        const promises = fileIdArray.map(fileId => imagekit.getFileDetails(fileId));
        const results = await Promise.all(promises);

        const images = results.map(result => ({
            fileId: result.fileId,
            url: result.url,
        }));
        
        

        return NextResponse.json(images);
    } catch (error) {
        console.error('Error fetching images:', error);
        return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
    }
}
