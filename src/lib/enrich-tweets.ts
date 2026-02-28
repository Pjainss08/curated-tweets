import { extractTweetId } from "./tweet-utils"

export interface TweetMetadata {
  image_url: string | null
  author_name: string | null
  author_handle: string | null
  text_content: string | null
}

/**
 * Server-side enrichment via fxtwitter API.
 * Works from Vercel servers (not blocked by Twitter, unlike syndication API).
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

  // Extract username from URL for fxtwitter API path
  let username = "i"
  try {
    const parsed = new URL(url.trim())
    const segments = parsed.pathname.split("/").filter(Boolean)
    if (segments.length > 0) username = segments[0]
  } catch {
    // fallback username
  }

  try {
    const res = await fetch(
      `https://api.fxtwitter.com/${username}/status/${tweetId}`,
    )

    if (!res.ok) return empty

    const json = await res.json()
    const tweet = json.tweet
    if (!tweet) return empty

    let image_url: string | null = null
    if (tweet.media?.photos && tweet.media.photos.length > 0) {
      image_url = tweet.media.photos[0].url
    } else if (tweet.media?.videos && tweet.media.videos.length > 0) {
      image_url = tweet.media.videos[0].thumbnail_url ?? null
    }

    return {
      image_url,
      author_name: tweet.author?.name ?? null,
      author_handle: tweet.author?.screen_name ?? null,
      text_content: tweet.text ?? null,
    }
  } catch {
    return empty
  }
}
