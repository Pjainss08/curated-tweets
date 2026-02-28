import { getTweet } from "react-tweet/api"
import { extractTweetId } from "./tweet-utils"

export interface TweetMetadata {
  image_url: string | null
  author_name: string | null
  author_handle: string | null
  text_content: string | null
}

export async function enrichSingleTweet(url: string): Promise<TweetMetadata> {
  const tweetId = extractTweetId(url)
  if (!tweetId) {
    return { image_url: null, author_name: null, author_handle: null, text_content: null }
  }

  try {
    const data = await getTweet(tweetId)
    if (!data) {
      return { image_url: null, author_name: null, author_handle: null, text_content: null }
    }

    let image_url: string | null = null
    if (data.photos && data.photos.length > 0) {
      image_url = data.photos[0].url
    } else if (data.video?.poster) {
      image_url = data.video.poster
    }

    return {
      image_url,
      author_name: data.user?.name ?? null,
      author_handle: data.user?.screen_name ?? null,
      text_content: data.text ?? null,
    }
  } catch {
    return { image_url: null, author_name: null, author_handle: null, text_content: null }
  }
}
