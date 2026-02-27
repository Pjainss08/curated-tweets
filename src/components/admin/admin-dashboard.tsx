"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddTweetForm } from "./add-tweet-form"
import { TweetList } from "./tweet-list"
import { AddCategoryForm } from "./add-category-form"
import type { Category, Tweet } from "@/lib/types"

interface AdminDashboardProps {
  categories: Category[]
  tweets: Tweet[]
}

export function AdminDashboard({ categories, tweets }: AdminDashboardProps) {
  return (
    <Tabs defaultValue="add-tweet" className="space-y-6">
      <TabsList>
        <TabsTrigger value="add-tweet">Add Tweet</TabsTrigger>
        <TabsTrigger value="manage">Manage Tweets</TabsTrigger>
        <TabsTrigger value="categories">Categories</TabsTrigger>
      </TabsList>

      <TabsContent value="add-tweet">
        <AddTweetForm categories={categories} />
      </TabsContent>

      <TabsContent value="manage">
        <TweetList tweets={tweets} />
      </TabsContent>

      <TabsContent value="categories">
        <AddCategoryForm categories={categories} />
      </TabsContent>
    </Tabs>
  )
}
