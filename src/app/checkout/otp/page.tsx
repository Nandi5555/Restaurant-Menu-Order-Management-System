"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { payOrder } from "@/app/actions/orders"
import { ArrowRight, ShieldCheck } from "lucide-react"
import { useCart } from "@/hooks/use-cart"

export default function OtpPage() {
  const params = useSearchParams()
  const router = useRouter()
  const { clearCart } = useCart()
  const [otp, setOtp] = useState("")
  const [processing, setProcessing] = useState(false)
  const orderId = params.get("orderId") || ""

  const submit = async () => {
    if (!orderId) return
    setProcessing(true)
    if (otp !== "123456") { setProcessing(false); return }
    const res = await payOrder(orderId)
    setProcessing(false)
    clearCart()
    router.push(`/checkout/processing?orderId=${orderId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-green-600" />
              OTP Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Enter OTP <span className="font-semibold">123456</span> to confirm payment for Order <span className="font-mono">{orderId.slice(0,8)}</span>.</p>
            <div>
              <Label>OTP</Label>
              <Input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="123456" />
            </div>
            <Button className="w-full bg-orange-500 hover:bg-orange-600" disabled={processing || !orderId} onClick={submit}>
              {processing ? "Processing..." : "Confirm Payment"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
