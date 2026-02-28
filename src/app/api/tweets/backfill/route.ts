import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { enrichSingleTweet } from "@/lib/enrich-tweets"

export async function POST(request: Request) {
  // Auth: API_SECRET or Supabase session
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
    return NextResponse.json({
      error: "Unauthorized",
      debug: {
        hasApiSecret: !!apiSecret,
        apiSecretLength: apiSecret?.length ?? 0,
        authHeaderPrefix: authHeader?.substring(0, 15) ?? "none",
      }
    }, { status: 401 })
  }

  // Fetch all tweets that haven't been enriched yet
  const { data: tweets, error } = await supabase
    .from("tweets")
    .select("id, url")
    .is("image_url", null)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!tweets || tweets.length === 0) {
    return NextResponse.json({ message: "No tweets to backfill", updated: 0 })
  }

  let updated = 0

  for (const tweet of tweets) {
    const metadata = await enrichSingleTweet(tweet.url)

    const { error: updateError } = await supabase
      .from("tweets")
      .update({
        image_url: metadata.image_url,
        author_name: metadata.author_name,
        author_handle: metadata.author_handle,
        text_content: metadata.text_content,
      })
      .eq("id", tweet.id)

    if (!updateError) {
      updated++
    }
  }

  return NextResponse.json({ message: `Backfilled ${updated}/${tweets.length} tweets`, updated })
}
