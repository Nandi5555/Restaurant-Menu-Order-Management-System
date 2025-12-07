"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, CreditCard } from "lucide-react"

export default function PaymentDetailsPage() {
  const params = useSearchParams()
  const router = useRouter()
  const orderId = params.get("orderId") || ""

  const [number, setNumber] = useState("")
  const [name, setName] = useState("")
  const [exp, setExp] = useState("")
  const [cvv, setCvv] = useState("")

  const continueToOtp = () => {
    if (!orderId) return
    router.push(`/checkout/otp?orderId=${orderId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Details (Dummy)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Card Number</Label>
              <Input value={number} onChange={(e) => setNumber(e.target.value)} placeholder="4111 1111 1111 1111" />
            </div>
            <div>
              <Label>Cardholder Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Expiry</Label>
                <Input value={exp} onChange={(e) => setExp(e.target.value)} placeholder="MM/YY" />
              </div>
              <div>
                <Label>CVV</Label>
                <Input value={cvv} onChange={(e) => setCvv(e.target.value)} placeholder="123" />
              </div>
            </div>
            <Button className="w-full bg-orange-500 hover:bg-orange-600" disabled={!orderId} onClick={continueToOtp}>
              Continue to OTP
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

