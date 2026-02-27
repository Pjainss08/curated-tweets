"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { Category } from "@/lib/types"

interface AddCategoryFormProps {
  categories: Category[]
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
}

export function AddCategoryForm({ categories }: AddCategoryFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [autoSlug, setAutoSlug] = useState(true)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editSlug, setEditSlug] = useState("")
  const [editLoading, setEditLoading] = useState(false)

  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const handleNameChange = (value: string) => {
    setName(value)
    if (autoSlug) {
      setSlug(toSlug(value))
    }
  }

  const handleSlugChange = (value: string) => {
    setAutoSlug(false)
    setSlug(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setErrorMsg("")

    const { error } = await supabase.from("categories").insert({
      name: name.trim(),
      slug: slug.trim(),
    })

    if (error) {
      setStatus("error")
      setErrorMsg(error.message)
    } else {
      setStatus("success")
      setName("")
      setSlug("")
      setAutoSlug(true)
      router.refresh()
      setTimeout(() => setStatus("idle"), 2000)
    }
  }

  const startEdit = (cat: Category) => {
    setEditingId(cat.id)
    setEditName(cat.name)
    setEditSlug(cat.slug)
  }

  const handleSaveEdit = async () => {
    if (!editingId) return
    setEditLoading(true)

    const { error } = await supabase
      .from("categories")
      .update({ name: editName.trim(), slug: editSlug.trim() })
      .eq("id", editingId)

    setEditLoading(false)
    if (!error) {
      setEditingId(null)
      router.refresh()
    }
  }

  const handleDelete = async (id: string) => {
    setDeleteLoading(true)
    await supabase.from("categories").delete().eq("id", id)
    setDeleteLoading(false)
    setDeleteId(null)
    router.refresh()
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div className="space-y-2">
          <label htmlFor="cat-name" className="text-sm font-medium">
            Category Name
          </label>
          <Input
            id="cat-name"
            type="text"
            placeholder="e.g. Design"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="cat-slug" className="text-sm font-medium">
            Slug
          </label>
          <Input
            id="cat-slug"
            type="text"
            placeholder="e.g. design"
            value={slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            required
          />
        </div>

        <Button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Creating..." : "Create Category"}
        </Button>

        {status === "success" && (
          <p className="text-sm text-green-600">Category created.</p>
        )}
        {status === "error" && (
          <p className="text-sm text-destructive">{errorMsg}</p>
        )}
      </form>

      {categories.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Existing Categories</h3>
          <div className="space-y-1">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between gap-3 text-sm p-3 border border-border rounded-md"
              >
                {editingId === cat.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="h-8 text-sm"
                    />
                    <Input
                      value={editSlug}
                      onChange={(e) => setEditSlug(e.target.value)}
                      className="h-8 text-sm w-32"
                    />
                    <Button
                      size="sm"
                      onClick={handleSaveEdit}
                      disabled={editLoading}
                      className="text-xs"
                    >
                      {editLoading ? "..." : "Save"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingId(null)}
                      className="text-xs"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-medium">{cat.name}</span>
                      <span className="text-muted-foreground">/{cat.slug}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEdit(cat)}
                        className="text-xs"
                      >
                        Edit
                      </Button>
                      <Dialog
                        open={deleteId === cat.id}
                        onOpenChange={(open) => setDeleteId(open ? cat.id : null)}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-destructive"
                          >
                            Delete
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete category</DialogTitle>
                            <DialogDescription>
                              This will permanently delete &ldquo;{cat.name}&rdquo; and all tweets in this category.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setDeleteId(null)}>
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleDelete(cat.id)}
                              disabled={deleteLoading}
                            >
                              {deleteLoading ? "Deleting..." : "Delete"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
