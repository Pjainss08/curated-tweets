import { BookmarkletSetup } from "@/components/bookmarklet-setup"

export default function BookmarkletPage() {
  return (
    <main className="min-h-screen bg-background pb-16">
      <div className="pt-12 pb-8 px-4">
        <div className="max-w-[600px] mx-auto">
          <h1 className="text-lg font-medium tracking-tight text-foreground">
            Quick Save Tools
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Save tweets to your gallery from anywhere.
          </p>
        </div>
      </div>
      <BookmarkletSetup />
    </main>
  )
}
