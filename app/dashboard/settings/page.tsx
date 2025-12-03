import { createClient } from "@/lib/supabase/server"
import { SettingsForm } from "@/components/dashboard/settings-form"

export default async function SettingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch user profile from your 'users' table (not 'profiles')
  const { data: userProfile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user?.id)
    .single()

  // Create a user object that matches the User type expected by SettingsForm
  const userData = userProfile || {
    id: user?.id || "",
    email: user?.email || "",
    name: user?.user_metadata?.name || "",
  }

  

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>

      <SettingsForm user={userData} />
    </div>
  )
}