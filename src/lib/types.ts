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
  categories?: Category
}

export interface EnrichedTweet extends Tweet {
  imageUrl: string | null
  authorName: string | null
  authorHandle: string | null
  text: string | null
}
