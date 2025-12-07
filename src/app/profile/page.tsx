import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ProfileAddresses from "@/components/profile-addresses"
import ProfileMobile from "@/components/profile-mobile"
import { redirect } from "next/navigation"

export default async function ProfilePage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Name</div>
              <div className="font-medium">{user.user_metadata?.name || user.email}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Email</div>
              <div className="font-medium">{user.email}</div>
            </div>
          </div>
          <ProfileMobile initial={String(user.user_metadata?.phone || "")} />
          <ProfileAddresses />
        </CardContent>
      </Card>
    </div>
  )
}
