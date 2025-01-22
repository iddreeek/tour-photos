//api/uses/register/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { neon } from "@neondatabase/serverless";

export async function POST(request) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const { username, email, password, full_name } = await request.json();

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await sql`
      INSERT INTO users (username, email, password_hash, full_name)
      VALUES (${username}, ${email}, ${hashedPassword}, ${full_name})
      RETURNING id, username, email, full_name
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
