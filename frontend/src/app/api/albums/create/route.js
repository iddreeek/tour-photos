//albums/create/route.js
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

    const { title, description, is_public } = await request.json();

    const result = await sql`
      INSERT INTO albums (user_id, title, description, is_public)
      VALUES (${userId}, ${title}, ${description}, ${is_public})
      RETURNING id, title, description, is_public
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error creating album:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

