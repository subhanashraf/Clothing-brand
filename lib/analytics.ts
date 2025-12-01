import { createClient } from "@/lib/supabase/client"

export async function trackEvent(eventName: string, eventValue?: string, page?: string) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Detect device type
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    const device = isMobile ? "mobile" : "desktop"

    await supabase.from("analytics").insert({
      user_id: user?.id || null,
      event_name: eventName,
      event_value: eventValue || null,
      page: page || window.location.pathname,
      device,
    })
  } catch (error) {
    console.error("Failed to track event:", error)
  }
}

export async function trackPageView(page?: string) {
  return trackEvent("page_view", undefined, page)
}

export async function trackConversion(value: string) {
  return trackEvent("conversion", value)
}
