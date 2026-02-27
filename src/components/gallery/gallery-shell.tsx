"use client"

import { useState } from "react"
import { CategoryTabs } from "./category-tabs"
import { TweetFeed } from "./tweet-feed"
import type { Category, EnrichedTweet } from "@/lib/types"

interface GalleryShellProps {
  categories: Category[]
  initialTweets: EnrichedTweet[]
}

export function GalleryShell({ categories, initialTweets }: GalleryShellProps) {
  const [activeCategory, setActiveCategory] = useState("all")

  return (
    <>
      <CategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <TweetFeed
        categories={categories}
        initialTweets={initialTweets}
        activeCategorySlug={activeCategory}
      />
    </>
  )
}
