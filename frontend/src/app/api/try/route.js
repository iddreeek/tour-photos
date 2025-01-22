import { neon } from "@neondatabase/serverless";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL);

    const bal = await sql`SELECT * FROM users`;

    return new Response(JSON.stringify(bal), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching data from the database:", error);
    return new Response(
      JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
