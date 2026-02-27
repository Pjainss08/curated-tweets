"use client"

import { useState, useEffect, useCallback } from "react"
import { TweetCard } from "./tweet-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { Category, EnrichedTweet } from "@/lib/types"

const PAGE_SIZE = 20

interface TweetFeedProps {
  categories: Category[]
  initialTweets: EnrichedTweet[]
  activeCategorySlug: string
}

export function TweetFeed({
  categories,
  initialTweets,
  activeCategorySlug,
}: TweetFeedProps) {
  const [tweets, setTweets] = useState<EnrichedTweet[]>(initialTweets)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(initialTweets.length === PAGE_SIZE)
  const [loading, setLoading] = useState(false)
  const [initialLoad, setInitialLoad] = useState(false)

  const fetchTweets = useCallback(
    async (pageNum: number, replace: boolean) => {
      setLoading(true)
      if (replace) setInitialLoad(true)

      try {
        const params = new URLSearchParams({
          category: activeCategorySlug,
          page: pageNum.toString(),
        })
        const res = await fetch(`/api/tweets?${params}`)
        const data: EnrichedTweet[] = await res.json()

        setTweets((prev) => (replace ? data : [...prev, ...data]))
        setHasMore(data.length === PAGE_SIZE)
      } catch {
        // Silently fail
      }

      setLoading(false)
      setInitialLoad(false)
    },
    [activeCategorySlug]
  )

  useEffect(() => {
    setPage(0)
    if (activeCategorySlug === "all") {
      setTweets(initialTweets)
      setHasMore(initialTweets.length === PAGE_SIZE)
    } else {
      fetchTweets(0, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategorySlug])

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchTweets(nextPage, false)
  }

  if (initialLoad) {
    return (
      <div className="max-w-[1100px] mx-auto px-4 sm:px-0 pt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3] w-full rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-0 pt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tweets.map((tweet) => (
          <TweetCard key={tweet.id} tweet={tweet} />
        ))}
      </div>

      {hasMore && tweets.length > 0 && (
        <div className="flex justify-center py-8">
          <Button variant="outline" onClick={loadMore} disabled={loading}>
            {loading ? "Loading..." : "Load more"}
          </Button>
        </div>
      )}

      {!hasMore && tweets.length > 0 && (
        <p className="text-center text-muted-foreground py-8 text-sm">
          You&apos;ve reached the end.
        </p>
      )}

      {!loading && tweets.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-sm">
            No tweets in this category yet.
          </p>
        </div>
      )}
    </div>
  )
}
