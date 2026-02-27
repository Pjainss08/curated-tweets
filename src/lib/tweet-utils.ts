export function extractTweetId(urlOrId: string): string | null {
  const trimmed = urlOrId.trim()

  if (/^\d+$/.test(trimmed)) {
    return trimmed
  }

  try {
    const url = new URL(trimmed)
    const host = url.hostname.replace("www.", "")

    if (host !== "twitter.com" && host !== "x.com") {
      return null
    }

    const segments = url.pathname.split("/").filter(Boolean)
    const statusIdx = segments.indexOf("status")
    if (statusIdx !== -1 && segments[statusIdx + 1]) {
      const id = segments[statusIdx + 1]
      if (/^\d+$/.test(id)) {
        return id
      }
    }
  } catch {
    // Invalid URL
  }

  return null
}
