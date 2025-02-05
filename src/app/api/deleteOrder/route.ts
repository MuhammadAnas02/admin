import { client } from "@/sanity/lib/client";
import { revalidatePath } from "next/cache";

export async function POST(request) {
  const { id } = await request.json();

  try {
    await client.delete(id);
    revalidatePath("/dashboard");
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Delete error:", error);
    return new Response(JSON.stringify({ error: "Delete failed" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}