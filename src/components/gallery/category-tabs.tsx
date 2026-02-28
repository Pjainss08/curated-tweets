"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Category } from "@/lib/types"

interface CategoryTabsProps {
  categories: Category[]
  activeCategory: string
  onCategoryChange: (slug: string) => void
  categoryCounts: Record<string, number>
}

export function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
  categoryCounts,
}: CategoryTabsProps) {
  return (
    <div className="px-4">
      <div className="max-w-[1100px] mx-auto">
        <Tabs value={activeCategory} onValueChange={onCategoryChange}>
          <TabsList className="h-auto p-1 bg-transparent gap-1 flex-nowrap overflow-x-auto justify-start w-full scrollbar-hide">
            <TabsTrigger
              value="all"
              className="text-sm px-3 py-1.5 rounded-md data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=inactive]:text-muted-foreground shrink-0"
            >
              All
              {categoryCounts.all > 0 && (
                <span className="ml-1.5 text-xs opacity-60">
                  {categoryCounts.all}
                </span>
              )}
            </TabsTrigger>
            {categories.map((cat) => (
              <TabsTrigger
                key={cat.id}
                value={cat.slug}
                className="text-sm px-3 py-1.5 rounded-md data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=inactive]:text-muted-foreground shrink-0"
              >
                {cat.name}
                {(categoryCounts[cat.slug] ?? 0) > 0 && (
                  <span className="ml-1.5 text-xs opacity-60">
                    {categoryCounts[cat.slug]}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}
