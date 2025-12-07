"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Menu, X, ShoppingCart, User, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { logout } from "@/app/actions/auth"
import { supabase } from "@/lib/supabase"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/hooks/use-cart"

interface HeaderProps {
  user?: any
}

export default function Header({ user }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isAuthed, setIsAuthed] = useState(!!user)
  const router = useRouter()
  const { toast } = useToast()
  const { getTotalItems, clearCart } = useCart()

  const handleLogout = async () => {
    try { await supabase.auth.signOut() } catch {}
    try {
      const result = await logout()
      if (result?.error) {
        toast({ title: "Error", description: result.error, variant: "destructive" })
        return
      }
    } catch {}
    try { clearCart() } catch {}
    setIsAuthed(false)
    router.push("/")
  }

  useEffect(() => {
    setMounted(true)
    const syncAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setIsAuthed(!!user)
    }
    syncAuth()
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setIsAuthed(!!session?.user)
    })
    return () => { sub.subscription.unsubscribe() }
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const authed = isAuthed || !!user
  const navItems = authed ? [{ href: "/menu", label: "Menu" }] : [{ href: "/", label: "Home" }]

  const adminItems = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/menu", label: "Menu Management" },
    { href: "/admin/categories", label: "Categories" },
    { href: "/admin/orders", label: "Orders" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-gradient-orange">
              🍕 Restaurant
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-orange-600 dark:hover:text-orange-400"
              >
                {item.label}
              </Link>
            ))}
            {user?.role === "admin" && (
              <>
                <div className="h-4 w-px bg-border" />
                {adminItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium transition-colors hover:text-orange-600 dark:hover:text-orange-400"
                  >
                    {item.label}
                  </Link>
                ))}
              </>
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="hidden md:flex"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            )}

            {authed && (
              <Link href="/cart" className="relative">
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="h-4 w-4" />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </Button>
              </Link>
            )}

            {authed ? (
              <div className="hidden md:flex items-center">
                <div className="relative">
                  <details className="group">
                    <summary className="list-none cursor-pointer flex items-center gap-2 px-2 py-1 rounded-md hover:bg-accent">
                      <User className="h-4 w-4" />
                      <span className="text-sm font-medium">{user.name}</span>
                    </summary>
                    <div className="absolute right-0 mt-2 w-48 rounded-md border bg-background shadow-md p-2">
                      <Link href="/profile" className="block px-2 py-2 text-sm hover:text-orange-600">Profile</Link>
                      <Link href="/orders" className="block px-2 py-2 text-sm hover:text-orange-600">Orders</Link>
                      <div className="h-px bg-border my-2" />
                      <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-start">Logout</Button>
                    </div>
                  </details>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="bg-gradient-orange hover:bg-gradient-orange-hover" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium transition-colors hover:text-orange-600 dark:hover:text-orange-400 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {user?.role === "admin" && (
                <>
                  <div className="h-px bg-border my-2" />
                  {adminItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-sm font-medium transition-colors hover:text-orange-600 dark:hover:text-orange-400 py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </>
              )}
              <div className="h-px bg-border my-2" />
              {authed ? (
                <div className="flex flex-col space-y-2">
                  <span className="text-sm font-medium">{user.name}</span>
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="justify-start">
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full justify-start bg-gradient-orange hover:bg-gradient-orange-hover">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
