import { createClient } from "@/lib/supabase/server"
import { SettingsForm } from "@/components/dashboard/settings-form"

export default async function SettingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase.from("users").select("*").eq("id", user?.id).single()

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>

      <SettingsForm user={profile} />
    </div>
  )
}
