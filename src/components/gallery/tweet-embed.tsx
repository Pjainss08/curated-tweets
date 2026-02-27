"use client"

import { Tweet } from "react-tweet"
import { Skeleton } from "@/components/ui/skeleton"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"

interface TweetEmbedProps {
  tweetId: string
}

export function TweetEmbed({ tweetId }: TweetEmbedProps) {
  const { ref, isIntersecting } = useIntersectionObserver({
    rootMargin: "200px 0px",
    triggerOnce: true,
  })

  return (
    <div ref={ref} className="min-h-[200px]">
      {isIntersecting ? (
        <div data-theme="light">
          <Tweet id={tweetId} />
        </div>
      ) : (
        <div className="space-y-3 p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
          <Skeleton className="h-3 w-3/5" />
        </div>
      )}
    </div>
  )
}
