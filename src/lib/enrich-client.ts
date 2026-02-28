"use client"

import { extractTweetId } from "./tweet-utils"

export interface ClientTweetMetadata {
  image_url: string | null
  author_name: string | null
  author_handle: string | null
  text_content: string | null
}

/**
 * Fetches tweet metadata from Twitter's syndication API directly in the browser.
 * This works because browsers aren't blocked by Twitter, unlike Vercel's servers.
 */
export async function enrichTweetClient(url: string): Promise<ClientTweetMetadata> {
  const empty: ClientTweetMetadata = {
    image_url: null,
    author_name: null,
    author_handle: null,
    text_content: null,
  }

  const tweetId = extractTweetId(url)
  if (!tweetId) return empty

  try {
    // react-tweet's syndication endpoint — works from browsers
    const token = ((Number(tweetId) / 1e15) * Math.PI)
      .toString(36)
      .replace(/(0+|\.)/g, "")

    const res = await fetch(
      `https://cdn.syndication.twimg.com/tweet-result?id=${tweetId}&lang=en&token=${token}`,
    )

    if (!res.ok) return empty

    const data = await res.json()
    if (!data) return empty

    let image_url: string | null = null
    if (data.photos && data.photos.length > 0) {
      image_url = data.photos[0].url
    } else if (data.video?.poster) {
      image_url = data.video.poster
    } else if (data.mediaDetails && data.mediaDetails.length > 0) {
      image_url = data.mediaDetails[0].media_url_https ?? null
    }

    return {
      image_url,
      author_name: data.user?.name ?? null,
      author_handle: data.user?.screen_name ?? null,
      text_content: data.text ?? null,
    }
  } catch {
    return empty
  }
}
