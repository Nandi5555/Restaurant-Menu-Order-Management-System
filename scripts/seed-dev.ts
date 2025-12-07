import { createClient } from "@supabase/supabase-js"

const url = process.env.SUPABASE_URL!
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@example.com"
const adminPassword = process.env.SEED_ADMIN_PASSWORD || "Admin123!"
const userEmail = process.env.SEED_USER_EMAIL || "user@example.com"
const userPassword = process.env.SEED_USER_PASSWORD || "User123!"

async function run() {
  if (!url || !serviceKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
    process.exit(1)
  }

  const supabase = createClient(url, serviceKey)

  // Create admin user
  const { data: adminCreate, error: adminCreateErr } = await supabase.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
    user_metadata: { role: "admin", name: "Admin" },
  })
  if (adminCreateErr) console.error("admin create error", adminCreateErr.message)

  const adminId = adminCreate?.user?.id
  if (adminId) {
    await supabase.from("users").upsert({
      id: adminId,
      email: adminEmail,
      name: "Admin",
      role: "admin",
      password_hash: "",
    })
  }

  // Create customer user
  const { data: userCreate, error: userCreateErr } = await supabase.auth.admin.createUser({
    email: userEmail,
    password: userPassword,
    email_confirm: true,
    user_metadata: { role: "customer", name: "Customer" },
  })
  if (userCreateErr) console.error("user create error", userCreateErr.message)

  const userId = userCreate?.user?.id
  if (userId) {
    await supabase.from("users").upsert({
      id: userId,
      email: userEmail,
      name: "Customer",
      role: "customer",
      password_hash: "",
    })
  }

  console.log("Seed complete: admin and customer ready")
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})

