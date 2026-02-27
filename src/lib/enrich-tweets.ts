import { getTweet } from "react-tweet/api"
import { extractTweetId } from "./tweet-utils"
import type { Tweet, EnrichedTweet } from "./types"

export async function enrichTweets(tweets: Tweet[]): Promise<EnrichedTweet[]> {
  const results = await Promise.allSettled(
    tweets.map(async (tweet): Promise<EnrichedTweet> => {
      const tweetId = extractTweetId(tweet.url)
      if (!tweetId) {
        return { ...tweet, imageUrl: null, authorName: null, authorHandle: null, text: null }
      }

      try {
        const data = await getTweet(tweetId)
        if (!data) {
          return { ...tweet, imageUrl: null, authorName: null, authorHandle: null, text: null }
        }

        // Get the first photo or video thumbnail
        let imageUrl: string | null = null
        if (data.photos && data.photos.length > 0) {
          imageUrl = data.photos[0].url
        } else if (data.video?.poster) {
          imageUrl = data.video.poster
        }

        return {
          ...tweet,
          imageUrl,
          authorName: data.user?.name ?? null,
          authorHandle: data.user?.screen_name ?? null,
          text: data.text ?? null,
        }
      } catch {
        return { ...tweet, imageUrl: null, authorName: null, authorHandle: null, text: null }
      }
    })
  )

  return results.map((result, i) =>
    result.status === "fulfilled"
      ? result.value
      : { ...tweets[i], imageUrl: null, authorName: null, authorHandle: null, text: null }
  )
}
