//api/uses/profile/route.js
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { neon } from "@neondatabase/serverless";

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

    const users =
      await sql`SELECT id, username, email, full_name, bio, profile_picture_url FROM users WHERE id = ${userId}`;

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(users[0]);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
