import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { UserRole } from '@/types/database'

export async function getCurrentUser() {
  const cookieStore = cookies()
  const supabase = createServerClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }

  // Get user role from our users table
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (userError || !userData) {
    return null
  }

  return userData
}

export async function requireAuth(allowedRoles?: UserRole[]) {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  if (allowedRoles && !allowedRoles.includes(user.role as UserRole)) {
    redirect('/unauthorized')
  }

  return user
}

export async function signOut() {
  const cookieStore = cookies()
  const supabase = createServerClient()
  
  await supabase.auth.signOut()
  redirect('/')
}

export function isAdmin(user: any): boolean {
  return user?.role === 'admin'
}

export function isStaff(user: any): boolean {
  return user?.role === 'staff' || user?.role === 'admin'
}

export function isCustomer(user: any): boolean {
  return user?.role === 'customer'
}