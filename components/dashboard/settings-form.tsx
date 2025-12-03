"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Copy, Check } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import type { User } from "@/lib/types"

interface SettingsFormProps {
  user: User | null
}

export function SettingsForm({ user }: SettingsFormProps) {
  const [name, setName] = useState(user?.name || "")
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()

      // First, update the user metadata in auth
      const { error: authError } = await supabase.auth.updateUser({
        data: { name }
      })

      if (authError) throw authError

      // Then update the users table if it exists
      const { error: dbError } = await supabase
        .from("users")
        .update({ name })
        .eq("id", user?.id)

      if (dbError) {
        // If users table doesn't exist or has issues, log it but don't fail
        console.warn("Could not update users table:", dbError.message)
      }

      toast.success("Profile updated successfully")
      router.refresh()
    } catch (error) {
      console.error("Update error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const copyApiKey = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success("User ID copied to clipboard")
    }
  }

  // Function to handle account deletion
  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return
    }

    setIsLoading(true)
    try {
      const supabase = createClient()
      
      // Delete from users table first
      const { error: dbError } = await supabase
        .from("users")
        .delete()
        .eq("id", user?.id)

      if (dbError) {
        console.warn("Could not delete from users table:", dbError.message)
      }

      // Delete the auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(user?.id || "")

      if (authError) throw authError

      toast.success("Account deleted successfully")
      
      // Redirect to home page
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Delete error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to delete account")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Profile Section */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg">Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Your name" 
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                value={user?.email || ""} 
                disabled 
                className="bg-muted" 
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* API Keys Section */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg">API Keys</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Your User ID</Label>
            <div className="flex gap-2">
              <Input 
                value={user?.id || ""} 
                readOnly 
                className="font-mono text-sm bg-muted" 
              />
              <Button 
                type="button" 
                variant="outline" 
                size="icon" 
                onClick={copyApiKey}
                disabled={!user?.id}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Use this ID to authenticate API requests
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="glass border-destructive/20">
        <CardHeader>
          <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="font-medium text-foreground">Delete Account</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all data
              </p>
            </div>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleDeleteAccount}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Account"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}