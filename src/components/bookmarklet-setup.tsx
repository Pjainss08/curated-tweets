"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function BookmarkletSetup() {
  const [apiKey, setApiKey] = useState("")
  const [siteUrl, setSiteUrl] = useState("")
  const [copied, setCopied] = useState(false)

  const bookmarkletCode = `javascript:void(function(){var u=window.location.href;if(!u.match(/x\\.com|twitter\\.com/)){alert('Not a tweet page');return;}var c=prompt('Category ID (leave blank for default):','');fetch('${siteUrl || "https://your-site.vercel.app"}/api/tweets/add',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer ${apiKey || "YOUR_API_KEY"}'},body:JSON.stringify({url:u,category_id:c||'default',note:''})}).then(r=>r.json()).then(d=>{if(d.error)alert('Error: '+d.error);else alert('Tweet saved!')}).catch(()=>alert('Failed to save tweet'))}())`

  const handleCopy = () => {
    navigator.clipboard.writeText(bookmarkletCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="px-4">
      <div className="max-w-[600px] mx-auto space-y-8">
        {/* Bookmarklet Section */}
        <section className="space-y-4">
          <h2 className="text-base font-medium text-foreground">
            Browser Bookmarklet
          </h2>
          <p className="text-sm text-muted-foreground">
            Drag the button below to your bookmarks bar. When viewing a tweet on
            X/Twitter, click it to save the tweet to your gallery.
          </p>

          <div className="space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Your site URL</label>
              <Input
                type="url"
                placeholder="https://your-site.vercel.app"
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">API Secret</label>
              <Input
                type="password"
                placeholder="Your API_SECRET value"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={bookmarkletCode}
              className="inline-flex items-center gap-1.5 bg-foreground text-background text-sm font-medium px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
              onClick={(e) => e.preventDefault()}
              draggable
            >
              Save to Curated
            </a>
            <span className="text-xs text-muted-foreground">
              Drag this to your bookmarks bar
            </span>
          </div>

          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? "Copied!" : "Copy bookmarklet code"}
          </Button>
        </section>

        {/* iOS Shortcut Section */}
        <section className="space-y-4 border-t border-border pt-8">
          <h2 className="text-base font-medium text-foreground">
            iOS Shortcut
          </h2>
          <p className="text-sm text-muted-foreground">
            Save tweets directly from the X app on your iPhone using the share
            sheet.
          </p>

          <div className="space-y-3 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Setup steps:</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>
                Open the <strong>Shortcuts</strong> app on your iPhone
              </li>
              <li>
                Tap <strong>+</strong> to create a new shortcut
              </li>
              <li>
                Add action: <strong>Receive input from Share Sheet</strong> (type: URLs)
              </li>
              <li>
                Add action: <strong>Get URLs from Input</strong>
              </li>
              <li>
                Add action: <strong>Get Contents of URL</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    URL: <code className="bg-muted px-1 py-0.5 rounded text-xs">{siteUrl || "https://your-site.vercel.app"}/api/tweets/add</code>
                  </li>
                  <li>Method: <strong>POST</strong></li>
                  <li>
                    Headers: <code className="bg-muted px-1 py-0.5 rounded text-xs">Authorization: Bearer {apiKey || "YOUR_API_KEY"}</code> and <code className="bg-muted px-1 py-0.5 rounded text-xs">Content-Type: application/json</code>
                  </li>
                  <li>
                    Request Body (JSON): <code className="bg-muted px-1 py-0.5 rounded text-xs">{`{"url": "Shortcut Input", "category_id": "your-category-id"}`}</code>
                  </li>
                </ul>
              </li>
              <li>
                Add action: <strong>Show Notification</strong> — &quot;Tweet saved!&quot;
              </li>
              <li>
                Name it <strong>&quot;Save to Curated&quot;</strong> and enable <strong>Show in Share Sheet</strong>
              </li>
            </ol>
          </div>

          <p className="text-xs text-muted-foreground">
            Now when you share a tweet from the X app, you&apos;ll see &quot;Save to
            Curated&quot; in your share sheet.
          </p>
        </section>

        <div className="border-t border-border pt-6">
          <a
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            &larr; Back to gallery
          </a>
        </div>
      </div>
    </div>
  )
}
