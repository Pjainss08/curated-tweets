import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const authHeader = request.headers.get("authorization")
  const apiSecret = process.env.API_SECRET

  let authenticated = false

  if (apiSecret && authHeader === `Bearer ${apiSecret}`) {
    authenticated = true
  }

  const supabase = await createClient()

  if (!authenticated) {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      authenticated = true
    }
  }

  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { image_url, author_name, author_handle, text_content } = body

  const { error } = await supabase
    .from("tweets")
    .update({ image_url, author_name, author_handle, text_content })
    .eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
