import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { enrichSingleTweet } from "@/lib/enrich-tweets"
import { extractTweetId } from "@/lib/tweet-utils"

export async function POST(request: Request) {
  // Auth: either API_SECRET bearer token or Supabase session
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
  const { url, category_id, note } = body

  if (!url || !category_id) {
    return NextResponse.json({ error: "url and category_id are required" }, { status: 400 })
  }

  const tweetId = extractTweetId(url)
  if (!tweetId) {
    return NextResponse.json({ error: "Invalid tweet URL" }, { status: 400 })
  }

  // Enrich the tweet with metadata from Twitter
  const metadata = await enrichSingleTweet(url)

  const { data, error } = await supabase.from("tweets").insert({
    url: url.trim(),
    category_id,
    note: note?.trim() || null,
    image_url: metadata.image_url,
    author_name: metadata.author_name,
    author_handle: metadata.author_handle,
    text_content: metadata.text_content,
  }).select("*").single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
