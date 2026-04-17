"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, Loader2, CheckCircle2 } from "lucide-react"

interface PaymentFormProps {
  amount: number
  onPaymentSuccess?: () => void
}

export function PaymentForm({ amount, onPaymentSuccess }: PaymentFormProps) {
  const [transactionId, setTransactionId] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("upi")
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!transactionId.trim()) {
      toast.error("Please enter transaction ID")
      return
    }

    setIsProcessing(true)

    try {
      console.log("[v0] Creating payment with transaction ID:", transactionId)

      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          transaction_id: transactionId,
          payment_method: paymentMethod
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Payment creation failed")
      }

      const result = await response.json()
      console.log("[v0] Payment created:", result.payment.id)

      toast.success("Payment submitted successfully! Awaiting admin approval.")
      setTransactionId("")
      onPaymentSuccess?.()
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to process payment"
      console.error("[v0] Payment error:", error)
      toast.error(msg)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 border rounded-lg bg-card">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Complete Payment</h2>

      {/* Payment info */}
      <div className="mb-6 p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground mb-2">Amount to Pay</p>
        <p className="text-2xl font-bold text-foreground">₹{amount.toLocaleString()}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Payment method selection */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Payment Method
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            disabled={isProcessing}
            className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
          >
            <option value="upi">UPI</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="card">Card</option>
          </select>
        </div>

        {/* Instructions */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Instructions:</strong> Send ₹{amount} via {paymentMethod.toUpperCase()} to our account. 
            Then enter your transaction ID below.
          </p>
        </div>

        {/* Transaction ID input */}
        <div>
          <label htmlFor="transaction_id" className="text-sm font-medium text-foreground mb-2 block">
            Transaction ID
          </label>
          <Input
            id="transaction_id"
            type="text"
            placeholder="e.g., TXN123456789"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            disabled={isProcessing}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Enter the transaction reference from your bank or UPI app
          </p>
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          disabled={isProcessing}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Submit Payment for Approval
            </>
          )}
        </Button>
      </form>

      <p className="text-xs text-muted-foreground text-center mt-4">
        Your payment will be verified by our admin team within 24 hours.
      </p>
    </div>
  )
}
