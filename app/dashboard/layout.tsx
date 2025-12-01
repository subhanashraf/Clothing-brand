import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  console.log(user);
  
  if (!user) {
    redirect("/auth/sign-up-success")
  }

  // Get user profile
  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar user={profile} />
      <div className="lg:pl-72">
        <DashboardHeader user={profile} />
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
