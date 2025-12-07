"use server"

import { createServerClient } from "@/lib/supabase"
import { loginSchema, registerSchema } from "@/types/schemas"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"

export async function login(formData: FormData) {
  const supabase = createServerActionClient({ cookies })
  
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }
  
  const validation = loginSchema.safeParse(data)
  if (!validation.success) {
    return { error: validation.error.errors[0].message }
  }
  
  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })
  
  if (error) {
    return { error: error.message }
  }
  
  revalidatePath("/", "layout")
  redirect("/")
}

export async function signup(formData: FormData) {
  const supabaseAuth = createServerActionClient({ cookies })
  const supabaseService = createServerClient()
  
  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }
  
  const validation = registerSchema.safeParse(data)
  if (!validation.success) {
    return { error: validation.error.errors[0].message }
  }
  
  const { data: authData, error: signUpError } = await supabaseAuth.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        name: data.name,
        role: "customer",
      },
    },
  })
  
  if (signUpError) {
    return { error: signUpError.message }
  }
  
  if (authData.user) {
    // Create user record in our users table (store hashed password)
    const passwordHash = await bcrypt.hash(data.password, 12)
    const { error: userError } = await supabaseService
      .from("users")
      .insert({
        id: authData.user.id,
        email: data.email,
        name: data.name,
        role: "customer",
        password_hash: passwordHash,
      })
    
    if (userError) {
      return { error: userError.message }
    }
  }
  
  revalidatePath("/", "layout")
  redirect("/")
}

export async function logout() {
  const supabase = createServerActionClient({ cookies })
  
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    return { error: error.message }
  }
  
  revalidatePath("/", "layout")
  redirect("/")
}

export async function getCurrentUser() {
  const supabase = createServerClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }
  
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single()
  
  if (userError || !userData) {
    return null
  }
  
  return userData
}

export async function getUserRole() {
  const user = await getCurrentUser()
  return user?.role || null
}
