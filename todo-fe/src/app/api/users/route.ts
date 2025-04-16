import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import jwt from "jsonwebtoken";

// JWT Middleware to authenticate requests using Bearer token
async function authenticate(req: NextRequest) {
  const authorization = req.headers.get("Authorization"); // Get Authorization header
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const token = authorization.split(" ")[1]; // Extract token part after 'Bearer'

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string); // Verify JWT
    return decoded; // Return decoded user data from JWT
  } catch (error) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

// GET all users
export async function GET(req: NextRequest) {
  const user = await authenticate(req);
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const result = await pool.query(
      "SELECT id, email, role, created_at FROM users"
    );

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Error fetching users" },
      { status: 500 }
    );
  }
}
