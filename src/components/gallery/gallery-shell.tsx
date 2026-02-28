"use client"

import { useState } from "react"
import { CategoryTabs } from "./category-tabs"
import { TweetFeed } from "./tweet-feed"
import type { Category, Tweet } from "@/lib/types"

interface GalleryShellProps {
  categories: Category[]
  initialTweets: Tweet[]
  categoryCounts: Record<string, number>
}

export function GalleryShell({ categories, initialTweets, categoryCounts }: GalleryShellProps) {
  const [activeCategory, setActiveCategory] = useState("all")

  return (
    <>
      <CategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        categoryCounts={categoryCounts}
      />
      <TweetFeed
        categories={categories}
        initialTweets={initialTweets}
        activeCategorySlug={activeCategory}
      />
    </>
  )
}
