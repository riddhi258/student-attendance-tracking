import { eq, sql, and, desc } from "drizzle-orm";
import db from "@/Utills";
import { ATTENDANCE, STUDENTS } from "@/Utills/schema";
import { NextResponse } from "next/server";

export async function GET(req) {
    const url = new URL(req.url); // Parse the request URL
    const date = url.searchParams.get('date');
    const grade = url.searchParams.get('grade');

    try {
        // Querying the database
        const result = await db
            .select({
                day: ATTENDANCE.day,
                presentCount: sql`COUNT(${ATTENDANCE.day})`.as('presentCount')
            })
            .from(ATTENDANCE)
            .leftJoin(STUDENTS, and(eq(ATTENDANCE.date, date),eq(ATTENDANCE.studentId, STUDENTS.id)))
            .where( eq(STUDENTS.grade, grade))
            .groupBy(ATTENDANCE.day)
            .orderBy(desc(ATTENDANCE.day))
            .limit(7);

        return NextResponse.json(result);
    } catch (error) {
        // Handle errors gracefully
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
