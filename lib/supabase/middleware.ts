import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protected routes
  if (
    !user &&
    (request.nextUrl.pathname.startsWith("/dashboard") )
  ) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }
  
  // 3️⃣ If user exists, check role
  if (user) {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (error || !profile) {
      // If no profile, block access
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }

    const role = profile.role;

  const url = request.nextUrl.clone();
    // 4️⃣ Role-based route restrictions
    if (role === "user" && url.pathname.startsWith("/dashboard")) {
      // Users can only visit these pages
      const allowedRoutes = ["/dashboard/orders", "/dashboard/settings"];
      if (!allowedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard/orders"; // redirect to first allowed page
        return NextResponse.redirect(url);
      }
    }

    // Admins have access to everything, no restriction needed
  }

  return supabaseResponse
}
