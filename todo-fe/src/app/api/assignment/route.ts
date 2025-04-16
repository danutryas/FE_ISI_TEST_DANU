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

export async function POST(req: NextRequest) {
  const user = await authenticate(req);
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { task_id, user_id } = await req.json();

    if (!task_id || !user_id) {
      return NextResponse.json(
        { message: "task_id and user_id are required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `
      INSERT INTO task_assignments (task_id, user_id, updated_by)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
      [task_id, user_id, user.id]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error("Error creating task assignment:", err);
    return NextResponse.json(
      { message: "Error creating task assignment" },
      { status: 500 }
    );
  }
}
