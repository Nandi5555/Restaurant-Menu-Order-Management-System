import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const { data: { session } } = await supabase.auth.getSession()
  const url = req.nextUrl.clone()
  const path = url.pathname

  const protectedRoutes = ["/orders", "/cart", "/checkout", "/profile", "/addresses"]
  const isProtected = protectedRoutes.some((p) => path.startsWith(p))
  const isAdmin = path.startsWith("/admin") || path.startsWith("/(admin)")

  if (isAdmin) {
    if (!session) {
      url.pathname = "/auth/login"
      return NextResponse.redirect(url)
    }
    const { data: { user } } = await supabase.auth.getUser()
    const role = user?.user_metadata?.role
    if (role !== "admin" && role !== "staff") {
      url.pathname = "/auth/login"
      return NextResponse.redirect(url)
    }
  }

  if (isProtected && !session) {
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  return res
}

export const config = {
  matcher: ["/(.*)"]
}
