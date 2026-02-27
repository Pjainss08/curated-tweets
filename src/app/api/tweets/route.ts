import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { enrichTweets } from "@/lib/enrich-tweets"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const categorySlug = searchParams.get("category") ?? "all"
  const page = parseInt(searchParams.get("page") ?? "0", 10)
  const pageSize = 20
  const from = page * pageSize
  const to = from + pageSize - 1

  const supabase = await createClient()

  let query = supabase
    .from("tweets")
    .select("*, categories(*)")
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .range(from, to)

  if (categorySlug !== "all") {
    const { data: categories } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .limit(1)

    if (categories && categories.length > 0) {
      query = query.eq("category_id", categories[0].id)
    }
  }

  const { data: tweets } = await query
  const enriched = await enrichTweets(tweets ?? [])

  return NextResponse.json(enriched)
}
