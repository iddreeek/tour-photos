//api/albums/user/route.js
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET(request) {
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

    const albums = await sql`
      SELECT a.id, a.title, a.description, a.is_public, a.created_at, 
             p.file_url as cover_photo_url
      FROM albums a
      LEFT JOIN photos p ON a.cover_photo_id = p.id
      WHERE a.user_id = ${userId}
      ORDER BY a.created_at DESC
    `;

    return NextResponse.json(albums);
  } catch (error) {
    console.error("Error fetching user's albums:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
