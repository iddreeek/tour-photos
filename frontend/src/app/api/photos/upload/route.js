//photos/upload/route.js
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { neon } from "@neondatabase/serverless";

export async function POST(request) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const token = request.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = verifyToken(token);
    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const title = formData.get("title");
    const description = formData.get("description");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Invalid file" }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Store the file in blob storage
    const blob = await put(`photos/${userId}/${file.name}`, file, {
      access: "public",
    });

    if (!blob?.url) {
      throw new Error("Failed to upload file to blob storage");
    }

    // Insert photo metadata into the database
    const result = await sql`
      INSERT INTO photos (user_id, title, description, file_url, original_filename, file_size, content_type)
      VALUES (${userId}, ${title}, ${description}, ${blob.url}, ${file.name}, ${file.size}, ${file.type})
      RETURNING id, title, description, file_url
    `;

    // Return the uploaded photo metadata
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error uploading photo:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
