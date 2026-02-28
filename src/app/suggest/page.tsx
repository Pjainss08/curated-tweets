import { SuggestForm } from "@/components/suggest-form"

export default function SuggestPage() {
  return (
    <main className="min-h-screen bg-background pb-16">
      <div className="pt-12 pb-8 px-4">
        <div className="max-w-[500px] mx-auto">
          <h1 className="text-lg font-medium tracking-tight text-foreground">
            Suggest a Tweet
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Found something worth saving? Submit it for review.
          </p>
        </div>
      </div>
      <div className="px-4">
        <div className="max-w-[500px] mx-auto">
          <SuggestForm />
          <div className="mt-8 pt-6 border-t border-border">
            <a
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              &larr; Back to gallery
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
