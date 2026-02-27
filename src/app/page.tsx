import { Header } from "@/components/header"
import { GalleryShell } from "@/components/gallery/gallery-shell"
import { createClient } from "@/lib/supabase/server"
import { enrichTweets } from "@/lib/enrich-tweets"

export default async function Home() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name")

  const { data: tweets } = await supabase
    .from("tweets")
    .select("*, categories(*)")
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(20)

  const enrichedTweets = await enrichTweets(tweets ?? [])

  return (
    <main className="min-h-screen bg-background pb-16">
      <Header />
      <GalleryShell
        categories={categories ?? []}
        initialTweets={enrichedTweets}
      />
    </main>
  )
}
