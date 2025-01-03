import db from "@/Utills";
import { NextResponse } from "next/server";
import { ATTENDANCE, STUDENTS } from "@/Utills/schema";
import { eq, or, isNull } from "drizzle-orm";

export async function GET(req) {
  try {
    // Log the incoming request URL
    console.log("Request URL:", req.url);

    // Parse the request URL
    const url = new URL(req.url);
    const grade = url.searchParams.get("grade");
    const month = url.searchParams.get("month");

    // Log extracted query parameters
    console.log("Grade:", grade, "Month:", month);



    // Query the database
    const result = await db
      .select({
        name: STUDENTS.name,
        present: ATTENDANCE.present,
        day: ATTENDANCE.day,
        date: ATTENDANCE.date,
        grade: STUDENTS.grade,
        studentId: STUDENTS.id,
        attendanceId: ATTENDANCE.id,
      })
      .from(STUDENTS)
      .leftJoin(ATTENDANCE, eq(STUDENTS.id, ATTENDANCE.studentId))
      .where(
        or(
          eq(STUDENTS.grade, grade),
          or(eq(ATTENDANCE.date, month), isNull(ATTENDANCE.date))
        )
      );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching attendance data:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching attendance data." },
      { status: 500 }
    );
  }
}

export async function POST(req,res) {
    const data = await req.json();
    const result = await db.insert(ATTENDANCE)
    .values({
      studentId:data.studentId,
      present:data.present,
      day : data.day,
      date : data.date,
    })

    return NextResponse.json(result);
}

export async function DELETE(req) {
   const searchParams=req.nextUrl.searchParams;
   const studentId= searchParams.get('studentId');
   const date= searchParams.get('date');
   const day= searchParams.get('day');

   const result = await db.delete(ATTENDANCE)
   .where(eq(ATTENDANCE.studentId,studentId))
   .where(eq(ATTENDANCE.date,date))
   .where(eq(ATTENDANCE.day,day))
   
}