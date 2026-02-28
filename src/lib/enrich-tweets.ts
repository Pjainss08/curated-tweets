import { extractTweetId } from "./tweet-utils"

export interface TweetMetadata {
  image_url: string | null
  author_name: string | null
  author_handle: string | null
  text_content: string | null
}

/**
 * Server-side fallback using Twitter's oEmbed API.
 * oEmbed is an official API that works from Vercel servers (not blocked).
 * It returns author_name and limited text, but no images.
 */
export async function enrichSingleTweet(url: string): Promise<TweetMetadata> {
  const empty: TweetMetadata = {
    image_url: null,
    author_name: null,
    author_handle: null,
    text_content: null,
  }

  const tweetId = extractTweetId(url)
  if (!tweetId) return empty

  try {
    const oembedUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}&omit_script=true`
    const res = await fetch(oembedUrl)
    if (!res.ok) return empty

    const data = await res.json()

    // oEmbed returns author_name like "Author Name" and author_url like "https://twitter.com/handle"
    let author_handle: string | null = null
    if (data.author_url) {
      const match = data.author_url.match(/(?:twitter\.com|x\.com)\/([^/]+)/)
      if (match) author_handle = match[1]
    }

    // Extract text from the HTML blockquote
    let text_content: string | null = null
    if (data.html) {
      const textMatch = data.html.match(/<p[^>]*>([\s\S]*?)<\/p>/)
      if (textMatch) {
        text_content = textMatch[1]
          .replace(/<a[^>]*>(.*?)<\/a>/g, "$1")
          .replace(/<br\s*\/?>/g, "\n")
          .replace(/<[^>]+>/g, "")
          .trim()
      }
    }

    return {
      image_url: null, // oEmbed doesn't return images
      author_name: data.author_name ?? null,
      author_handle,
      text_content,
    }
  } catch {
    return empty
  }
}
