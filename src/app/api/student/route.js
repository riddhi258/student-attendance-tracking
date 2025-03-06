import { STUDENTS } from "../../../Utills/schema";
import db from "../../../Utills";
import { NextResponse } from "next/server";
import { eq } from 'drizzle-orm';

export async function POST(req) {
  try {
      const data = await req.json();

      const result = await db.insert(STUDENTS).values({
          name: data.name,
          grade: data.grade,
          address: data.address,
          contact: data.contact
      });

      // Fetch the newly inserted student
      const insertedStudent = await db
          .select()
          .from(STUDENTS)
          .orderBy(STUDENTS.id)
          .limit(1);

      return NextResponse.json({ message: "Student added successfully", student: insertedStudent[0] });
  } catch (error) {
      console.error("Error inserting student:", error);
      return NextResponse.json({ error: "Failed to insert student" }, { status: 500 });
  }
}



export async function GET(req) {
    const result =await db.select().from(STUDENTS);
    return NextResponse.json(result);
}

export async function DELETE(req) {
    try {
      const url = new URL(req.url); // Parse the request URL
      const id = url.searchParams.get("id"); // Extract 'id' from query params
  
      const result = await db.delete(STUDENTS).where(eq(STUDENTS.id, id));
      return NextResponse.json({ message: "Student deleted successfully.", result });
    } catch (error) {
      console.error("Error deleting student:", error);
      return NextResponse.json(
        { error: "Failed to delete student." },
        { status: 500 }
      );
    }
  }