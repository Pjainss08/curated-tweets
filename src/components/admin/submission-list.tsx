"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import type { Submission, Category } from "@/lib/types"

interface SubmissionListProps {
  submissions: Submission[]
  categories: Category[]
}

export function SubmissionList({ submissions, categories }: SubmissionListProps) {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleApprove = async (submission: Submission, categoryId: string) => {
    setLoadingId(submission.id)

    try {
      // Add the tweet via the enrichment API
      const res = await fetch("/api/tweets/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: submission.url,
          category_id: categoryId,
          note: submission.submitted_by ? `Suggested by ${submission.submitted_by}` : null,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to approve")
      }

      // Mark submission as approved
      const supabase = createClient()
      await supabase
        .from("submissions")
        .update({ status: "approved" })
        .eq("id", submission.id)

      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to approve")
    }

    setLoadingId(null)
  }

  const handleReject = async (submissionId: string) => {
    setLoadingId(submissionId)
    const supabase = createClient()

    await supabase
      .from("submissions")
      .update({ status: "rejected" })
      .eq("id", submissionId)

    router.refresh()
    setLoadingId(null)
  }

  if (submissions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No pending submissions.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {submissions.map((sub) => (
        <SubmissionItem
          key={sub.id}
          submission={sub}
          categories={categories}
          loading={loadingId === sub.id}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      ))}
    </div>
  )
}

function SubmissionItem({
  submission,
  categories,
  loading,
  onApprove,
  onReject,
}: {
  submission: Submission
  categories: Category[]
  loading: boolean
  onApprove: (submission: Submission, categoryId: string) => void
  onReject: (id: string) => void
}) {
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "")

  return (
    <div className="flex flex-col gap-3 p-4 border border-border rounded-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <a
            href={submission.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-foreground hover:underline break-all"
          >
            {submission.url}
          </a>
          <div className="flex items-center gap-2 mt-1">
            {submission.submitted_by && (
              <span className="text-xs text-muted-foreground">
                by {submission.submitted_by}
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              {new Date(submission.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="flex h-8 rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          disabled={loading}
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <Button
          size="sm"
          onClick={() => onApprove(submission, categoryId)}
          disabled={loading || !categoryId}
        >
          {loading ? "..." : "Approve"}
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => onReject(submission.id)}
          disabled={loading}
        >
          Reject
        </Button>
      </div>
    </div>
  )
}
