//api/uses/login/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { neon } from "@neondatabase/serverless";

export async function POST(request) {
  try {
      const sql = neon(process.env.DATABASE_URL);
    const { email, password } = await request.json();

    const users = await sql`SELECT * FROM users WHERE email = ${email}`;

    if (users.length === 0) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return NextResponse.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    console.error("Error logging in:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

