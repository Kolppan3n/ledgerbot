import { db } from "@/lib/neon";

export async function GET() {
  try {
    await db.query("SELECT NOW()");
    return Response.json({
      success: true,
      message: "Database connection successful",
    });
  } catch (error) {
    console.error("Database test failed:", error);
    return Response.json(
      { error: "Database connection failed" },
      { status: 500 },
    );
  }
}
