import Link from "next/link"

export function Header() {
  return (
    <header className="pt-12 pb-8 px-4">
      <div className="max-w-[1100px] mx-auto flex items-start justify-between">
        <div>
          <h1 className="text-lg font-medium tracking-tight text-foreground">
            Curated Tweets
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            A small library of things worth re-reading.
          </p>
        </div>
        <Link
          href="/suggest"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors mt-1"
        >
          Suggest a tweet
        </Link>
      </div>
    </header>
  )
}
