import  db  from "@/Utills";
import {GRADES}from "@/Utills/schema";
import { NextResponse } from "next/server";

export async function GET(req) {
  const result = await db.select().from(GRADES);
  return NextResponse.json(result);
}
