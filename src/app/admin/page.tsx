import { createClient } from "@/lib/supabase/server"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export default async function AdminPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name")

  const { data: tweets } = await supabase
    .from("tweets")
    .select("*, categories(*)")
    .order("created_at", { ascending: false })

  const { data: submissions } = await supabase
    .from("submissions")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false })

  return (
    <AdminDashboard
      categories={categories ?? []}
      tweets={tweets ?? []}
      submissions={submissions ?? []}
    />
  )
}
