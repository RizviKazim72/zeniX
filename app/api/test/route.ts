// app/api/test/route.ts
import { connectDB } from "@/lib/connectDB";

export async function GET() {
  await connectDB();
  return Response.json({ message: "Hello DB" });
}
