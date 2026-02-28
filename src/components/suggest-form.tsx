"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { extractTweetId } from "@/lib/tweet-utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SuggestForm() {
  const [url, setUrl] = useState("")
  const [name, setName] = useState("")
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

    const supabase = createClient()
    const { error } = await supabase.from("submissions").insert({
      url: url.trim(),
      submitted_by: name.trim() || null,
    })

    if (error) {
      setStatus("error")
      setErrorMsg(error.message)
    } else {
      setStatus("success")
      setUrl("")
      setName("")
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-foreground font-medium">
          Thanks for your suggestion!
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          We&apos;ll review it and add it if it fits.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => setStatus("idle")}
        >
          Submit another
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="suggest-url" className="text-sm font-medium">
          Tweet URL
        </label>
        <Input
          id="suggest-url"
          type="url"
          placeholder="https://x.com/user/status/123456789"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="suggest-name" className="text-sm font-medium">
          Your name <span className="text-muted-foreground">(optional)</span>
        </label>
        <Input
          id="suggest-name"
          type="text"
          placeholder="@handle or name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Submitting..." : "Submit suggestion"}
      </Button>

      {status === "error" && (
        <p className="text-sm text-destructive">{errorMsg}</p>
      )}
    </form>
  )
}
