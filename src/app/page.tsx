import { Header } from "@/components/header"
import { GalleryShell } from "@/components/gallery/gallery-shell"
import { createClient } from "@/lib/supabase/server"
import type { Tweet } from "@/lib/types"

export const dynamic = "force-dynamic"

export default async function Home() {
  const supabase = await createClient()

  const [categoriesResult, tweetsResult, countResult] = await Promise.all([
    supabase.from("categories").select("*").order("name"),
    supabase
      .from("tweets")
      .select("*, categories(*)")
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("tweets")
      .select("category_id"),
  ])

  const categories = categoriesResult.data ?? []
  const tweets = (tweetsResult.data ?? []) as Tweet[]
  const allTweetsForCounts = countResult.data ?? []

  // Compute counts from fetched data
  const categoryCounts: Record<string, number> = { all: allTweetsForCounts.length }
  for (const cat of categories) {
    categoryCounts[cat.slug] = allTweetsForCounts.filter(
      (t) => t.category_id === cat.id
    ).length
  }

  return (
    <main className="min-h-screen bg-background pb-16">
      <Header />
      <GalleryShell
        categories={categories}
        initialTweets={tweets}
        categoryCounts={categoryCounts}
      />
    </main>
  )
}
