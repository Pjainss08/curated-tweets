"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { extractTweetId } from "@/lib/tweet-utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Category } from "@/lib/types"

interface AddTweetFormProps {
  categories: Category[]
}

export function AddTweetForm({ categories }: AddTweetFormProps) {
  const router = useRouter()
  const [url, setUrl] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [note, setNote] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setErrorMsg("")

    const tweetId = extractTweetId(url)
    if (!tweetId) {
      setStatus("error")
      setErrorMsg("Invalid tweet URL. Must be a twitter.com or x.com status link.")
      return
    }

    if (!categoryId) {
      setStatus("error")
      setErrorMsg("Please select a category.")
      return
    }

    try {
      const res = await fetch("/api/tweets/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: url.trim(),
          category_id: categoryId,
          note: note.trim() || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to add tweet")
      }

      setStatus("success")
      setUrl("")
      setNote("")
      router.refresh()
      setTimeout(() => setStatus("idle"), 2000)
    } catch (err) {
      setStatus("error")
      setErrorMsg(err instanceof Error ? err.message : "Failed to add tweet")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div className="space-y-2">
        <label htmlFor="url" className="text-sm font-medium">
          Tweet URL
        </label>
        <Input
          id="url"
          type="url"
          placeholder="https://x.com/user/status/123456789"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="category" className="text-sm font-medium">
          Category
        </label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          required
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="note" className="text-sm font-medium">
          Note <span className="text-muted-foreground">(optional)</span>
        </label>
        <Input
          id="note"
          type="text"
          placeholder="Why is this worth saving?"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Adding..." : "Add Tweet"}
      </Button>

      {status === "success" && (
        <p className="text-sm text-green-600">Tweet added successfully.</p>
      )}
      {status === "error" && (
        <p className="text-sm text-destructive">{errorMsg}</p>
      )}
    </form>
  )
}
