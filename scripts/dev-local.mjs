import { spawn } from "child_process"
import path from "path"
import fs from "fs"

const nodeVersion = process.versions.node
const major = parseInt(nodeVersion.split(".")[0], 10)

console.log(`[dev:local] Detected Node.js ${nodeVersion}`)
if (Number.isNaN(major)) {
  console.warn("[dev:local] Unable to parse Node version; continuing.")
} else if (major < 20) {
  console.warn("[dev:local] Node < 20 detected. The app will still run, but for best results use Node 20+ (LTS).")
}

// Local-only TLS bypass to avoid corporate proxy/CA issues reaching Supabase
// Do NOT use this in production environments.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
console.log("[dev:local] Using local TLS bypass (NODE_TLS_REJECT_UNAUTHORIZED=0).")

const nextBin = path.join(process.cwd(), "node_modules", "next", "dist", "bin", "next")
if (!fs.existsSync(nextBin)) {
  console.error("[dev:local] Next.js binary not found. Run 'npm install' first.")
  process.exit(1)
}

console.log("[dev:local] Starting Next.js dev server...")
const child = spawn(process.execPath, [nextBin, "dev"], {
  stdio: "inherit",
  env: process.env,
})

child.on("exit", (code) => {
  console.log(`[dev:local] Dev server exited with code ${code}`)
  process.exit(code ?? 0)
})

