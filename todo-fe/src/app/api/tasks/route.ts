import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";

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

// Create Task
export async function POST(req: NextRequest) {
  const user = await authenticate(req);
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { title, description, status } = await req.json();

  try {
    const result = await pool.query(
      `INSERT INTO tasks (title, description, status, created_by) 
      VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, description, status, user.id]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error creating task" },
      { status: 500 }
    );
  }
}

// Read All Tasks
export async function GET(req: NextRequest) {
  const user = await authenticate(req);
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const result = await pool.query(
      "SELECT * FROM tasks  ORDER BY updated_at DESC"
    );
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching tasks" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const user = await authenticate(req);

  // If user is not authenticated
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id, title, description, status } = await req.json();

  // Validate task status
  const validStatuses = ["Not Started", "On Progress", "Done", "Reject"];
  if (status && !validStatuses.includes(status)) {
    return NextResponse.json({ message: "Invalid status" }, { status: 400 });
  }

  try {
    // Update the task in the database based on the task id
    const result = await pool.query(
      "UPDATE tasks  SET title = $1, description = $2, status = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *",
      [title, description, status || "Not Started", id]
    );

    // If no task is updated
    if (result.rowCount === 0) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    // Respond with the updated task data
    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { message: "Error updating task" },
      { status: 500 }
    );
  }
}
