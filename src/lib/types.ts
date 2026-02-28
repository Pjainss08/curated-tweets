export interface Category {
  id: string
  name: string
  slug: string
  created_at: string
}

export interface Tweet {
  id: string
  url: string
  category_id: string
  note: string | null
  pinned: boolean
  created_at: string
  image_url: string | null
  author_name: string | null
  author_handle: string | null
  text_content: string | null
  categories?: Category
}

export interface Submission {
  id: string
  url: string
  submitted_by: string | null
  status: "pending" | "approved" | "rejected"
  created_at: string
}
