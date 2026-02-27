"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { Tweet } from "@/lib/types"

interface TweetListProps {
  tweets: Tweet[]
}

export function TweetList({ tweets }: TweetListProps) {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const supabase = createClient()

  const handleDelete = async (id: string) => {
    setLoadingId(id)
    await supabase.from("tweets").delete().eq("id", id)
    setDeleteId(null)
    setLoadingId(null)
    router.refresh()
  }

  const handleTogglePin = async (id: string, currentPinned: boolean) => {
    setLoadingId(id)
    await supabase
      .from("tweets")
      .update({ pinned: !currentPinned })
      .eq("id", id)
    setLoadingId(null)
    router.refresh()
  }

  if (tweets.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No tweets yet. Add one first.</p>
    )
  }

  return (
    <div className="space-y-2">
      {tweets.map((tweet) => (
        <div
          key={tweet.id}
          className="flex items-center justify-between gap-4 p-3 border border-border rounded-md"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              {tweet.pinned && (
                <span className="text-xs bg-foreground text-background px-1.5 py-0.5 rounded">
                  Pinned
                </span>
              )}
              <a
                href={tweet.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm truncate hover:underline"
              >
                {tweet.url}
              </a>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-muted-foreground">
                {tweet.categories?.name ?? "Unknown"}
              </span>
              {tweet.note && (
                <span className="text-xs text-muted-foreground/70 italic truncate">
                  {tweet.note}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleTogglePin(tweet.id, tweet.pinned)}
              disabled={loadingId === tweet.id}
              className="text-xs"
            >
              {tweet.pinned ? "Unpin" : "Pin"}
            </Button>

            <Dialog
              open={deleteId === tweet.id}
              onOpenChange={(open) => setDeleteId(open ? tweet.id : null)}
            >
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-xs text-destructive">
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete tweet</DialogTitle>
                  <DialogDescription>
                    This will permanently remove this tweet from your gallery.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDeleteId(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(tweet.id)}
                    disabled={loadingId === tweet.id}
                  >
                    {loadingId === tweet.id ? "Deleting..." : "Delete"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      ))}
    </div>
  )
}
