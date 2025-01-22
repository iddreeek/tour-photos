import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { verifyToken } from "@/lib/auth";

export async function POST(request, { params }) {
  const albumId = (await params).id;
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

  const sql = neon(process.env.DATABASE_URL);

  // Store the file in blob storage
  const blob = await put(`photos/${userId}/${file.name}`, file, {
    access: "public",
  });

  if (!blob?.url) {
    return NextResponse.json(
      { error: "Failed to upload file to blob storage" },
      { status: 500 }
    );
  }

  // Insert photo metadata into the database
  const result = await sql`
    INSERT INTO photos (user_id, title, description, file_url, original_filename, file_size, content_type)
    VALUES (${userId}, ${title}, ${description}, ${blob.url}, ${file.name}, ${file.size}, ${file.type})
    RETURNING id, title, description, file_url, created_at
  `;

  // Link the photo to the album
  await sql`
    INSERT INTO album_photos (album_id, photo_id)
    VALUES (${albumId}, ${result[0].id})
  `;

  return NextResponse.json(result[0], { status: 201 });
}
