"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { enrichTweetClient } from "@/lib/enrich-client"
import { Button } from "@/components/ui/button"
import type { Tweet } from "@/lib/types"

export default function BackfillPage() {
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [results, setResults] = useState<Record<string, "success" | "failed" | "processing">>({})

  useEffect(() => {
    async function fetchTweets() {
      const supabase = createClient()
      const { data } = await supabase
        .from("tweets")
        .select("*")
        .is("image_url", null)
        .order("created_at", { ascending: false })

      setTweets(data ?? [])
      setLoading(false)
    }
    fetchTweets()
  }, [])

  const handleBackfillAll = async () => {
    setProcessing(true)

    for (const tweet of tweets) {
      setResults((prev) => ({ ...prev, [tweet.id]: "processing" }))

      try {
        const metadata = await enrichTweetClient(tweet.url)

        const res = await fetch(`/api/tweets/${tweet.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(metadata),
        })

        if (res.ok && metadata.image_url) {
          setResults((prev) => ({ ...prev, [tweet.id]: "success" }))
        } else {
          setResults((prev) => ({ ...prev, [tweet.id]: "failed" }))
        }
      } catch {
        setResults((prev) => ({ ...prev, [tweet.id]: "failed" }))
      }
    }

    setProcessing(false)
  }

  const handleBackfillOne = async (tweet: Tweet) => {
    setResults((prev) => ({ ...prev, [tweet.id]: "processing" }))

    try {
      const metadata = await enrichTweetClient(tweet.url)

      const res = await fetch(`/api/tweets/${tweet.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metadata),
      })

      if (res.ok && metadata.image_url) {
        setResults((prev) => ({ ...prev, [tweet.id]: "success" }))
      } else {
        setResults((prev) => ({ ...prev, [tweet.id]: "failed" }))
      }
    } catch {
      setResults((prev) => ({ ...prev, [tweet.id]: "failed" }))
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <p className="text-muted-foreground">Loading tweets...</p>
      </div>
    )
  }

  const successCount = Object.values(results).filter((r) => r === "success").length

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-2">Backfill Tweet Images</h1>
      <p className="text-muted-foreground text-sm mb-6">
        {tweets.length} tweet{tweets.length !== 1 ? "s" : ""} missing image data.
        This page fetches metadata from Twitter directly in your browser.
      </p>

      {tweets.length === 0 ? (
        <p className="text-green-600 text-sm">All tweets have images. Nothing to backfill.</p>
      ) : (
        <>
          <Button onClick={handleBackfillAll} disabled={processing} className="mb-6">
            {processing
              ? `Processing... (${successCount}/${tweets.length})`
              : `Backfill all ${tweets.length} tweets`}
          </Button>

          <div className="space-y-3">
            {tweets.map((tweet) => (
              <div
                key={tweet.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-border text-sm"
              >
                <div className="flex-1 min-w-0">
                  <p className="truncate font-mono text-xs text-muted-foreground">
                    {tweet.url}
                  </p>
                  {tweet.author_handle && (
                    <p className="text-xs text-muted-foreground">@{tweet.author_handle}</p>
                  )}
                </div>
                <div className="shrink-0">
                  {results[tweet.id] === "success" && (
                    <span className="text-green-600 text-xs font-medium">Done</span>
                  )}
                  {results[tweet.id] === "failed" && (
                    <span className="text-destructive text-xs font-medium">Failed</span>
                  )}
                  {results[tweet.id] === "processing" && (
                    <span className="text-muted-foreground text-xs">Processing...</span>
                  )}
                  {!results[tweet.id] && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBackfillOne(tweet)}
                      disabled={processing}
                    >
                      Enrich
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
