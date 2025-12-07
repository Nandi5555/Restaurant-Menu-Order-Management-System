import { createClient } from "@supabase/supabase-js"
import fs from "fs"
import path from "path"
import bcrypt from "bcryptjs"

// Load .env.local if present (without logging secrets)
try {
  const envPath = path.join(process.cwd(), ".env.local")
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf8")
    content.split(/\r?\n/).forEach((line) => {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
      if (m) {
        const key = m[1]
        let val = m[2]
        if (val.startsWith("\"") && val.endsWith("\"")) {
          val = val.slice(1, -1)
        }
        if (!process.env[key]) process.env[key] = val
      }
    })
  }
} catch {}

const url = process.env.SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
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

  const { data: adminCreate, error: adminCreateErr } = await supabase.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
    user_metadata: { role: "admin", name: "Admin" },
  })
  if (adminCreateErr) console.error("admin create error", adminCreateErr.message)

  const adminId = adminCreate?.user?.id
  if (adminId) {
    const adminHash = await bcrypt.hash(adminPassword, 12)
    await supabase.from("users").upsert({
      id: adminId,
      email: adminEmail,
      name: "Admin",
      role: "admin",
      password_hash: adminHash,
    })
  }

  const { data: userCreate, error: userCreateErr } = await supabase.auth.admin.createUser({
    email: userEmail,
    password: userPassword,
    email_confirm: true,
    user_metadata: { role: "customer", name: "Customer" },
  })
  if (userCreateErr) console.error("user create error", userCreateErr.message)

  const userId = userCreate?.user?.id
  if (userId) {
    const userHash = await bcrypt.hash(userPassword, 12)
    await supabase.from("users").upsert({
      id: userId,
      email: userEmail,
      name: "Customer",
      role: "customer",
      password_hash: userHash,
    })
  }

  console.log("Seed complete: admin and customer ready")
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
