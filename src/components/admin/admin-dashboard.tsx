"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddTweetForm } from "./add-tweet-form"
import { TweetList } from "./tweet-list"
import { AddCategoryForm } from "./add-category-form"
import { SubmissionList } from "./submission-list"
import type { Category, Tweet, Submission } from "@/lib/types"

interface AdminDashboardProps {
  categories: Category[]
  tweets: Tweet[]
  submissions: Submission[]
}

export function AdminDashboard({ categories, tweets, submissions }: AdminDashboardProps) {
  return (
    <Tabs defaultValue="add-tweet" className="space-y-6">
      <TabsList>
        <TabsTrigger value="add-tweet">Add Tweet</TabsTrigger>
        <TabsTrigger value="manage">Manage Tweets</TabsTrigger>
        <TabsTrigger value="review">
          Review{submissions.length > 0 && ` (${submissions.length})`}
        </TabsTrigger>
        <TabsTrigger value="categories">Categories</TabsTrigger>
      </TabsList>

      <TabsContent value="add-tweet">
        <AddTweetForm categories={categories} />
      </TabsContent>

      <TabsContent value="manage">
        <TweetList tweets={tweets} />
      </TabsContent>

      <TabsContent value="review">
        <SubmissionList submissions={submissions} categories={categories} />
      </TabsContent>

      <TabsContent value="categories">
        <AddCategoryForm categories={categories} />
      </TabsContent>
    </Tabs>
  )
}
