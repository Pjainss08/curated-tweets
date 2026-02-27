"use client"

import Image from "next/image"
import type { EnrichedTweet } from "@/lib/types"

interface TweetCardProps {
  tweet: EnrichedTweet
}

export function TweetCard({ tweet }: TweetCardProps) {
  if (!tweet.imageUrl) {
    // Fallback for tweets without images: text-only card
    return (
      <a
        href={tweet.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block rounded-lg border border-border bg-card p-5 transition-colors hover:border-foreground/20 aspect-[4/3] overflow-hidden"
      >
        {tweet.text && (
          <p className="text-sm text-foreground leading-relaxed line-clamp-4">
            {tweet.text}
          </p>
        )}
        {tweet.authorHandle && (
          <p className="text-xs text-muted-foreground mt-3">
            @{tweet.authorHandle}
          </p>
        )}
        {tweet.note && (
          <p className="text-xs text-muted-foreground/60 italic mt-2 truncate">
            {tweet.note}
          </p>
        )}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="flex items-center gap-1.5 bg-foreground text-background text-xs font-medium px-2.5 py-1.5 rounded-md">
            <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            View on X
          </span>
        </div>
      </a>
    )
  }

  return (
    <a
      href={tweet.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block rounded-lg overflow-hidden bg-muted aspect-[4/3]"
    >
      <Image
        src={tweet.imageUrl}
        alt={tweet.text ?? "Tweet image"}
        width={720}
        height={480}
        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
        unoptimized
      />
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200" />
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <span className="flex items-center gap-1.5 bg-white text-black text-xs font-medium px-2.5 py-1.5 rounded-md shadow-sm">
          <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          View on X
        </span>
      </div>
      {/* Note badge at bottom */}
      {tweet.note && (
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <p className="text-xs text-white/90 italic truncate">{tweet.note}</p>
        </div>
      )}
    </a>
  )
}
