"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, Loader2, CheckCircle2, Upload, X } from "lucide-react"

interface PaymentFormProps {
  amount: number
  onPaymentSuccess?: () => void
}

export function PaymentForm({ amount, onPaymentSuccess }: PaymentFormProps) {
  const [transactionId, setTransactionId] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("upi")
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const { toast } = useToast()

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB")
      return
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, etc.)")
      return
    }

    setProofFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  function clearFile() {
    setProofFile(null)
    setPreviewUrl(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!transactionId.trim()) {
      toast.error("Please enter transaction ID")
      return
    }

    if (!proofFile) {
      toast.error("Please upload payment proof screenshot")
      return
    }

    setIsProcessing(true)

    try {
      console.log("[v0] Creating payment with transaction ID:", transactionId)

      // First, upload the proof image to Vercel Blob
      let proofUrl = null
      if (proofFile) {
        const formData = new FormData()
        formData.append("file", proofFile)

        const uploadResponse = await fetch("/api/upload-proof", {
          method: "POST",
          body: formData,
        })

        if (!uploadResponse.ok) {
          const error = await uploadResponse.json()
          throw new Error(error.error || "Failed to upload payment proof")
        }

        const uploadResult = await uploadResponse.json()
        proofUrl = uploadResult.url
        console.log("[v0] Proof uploaded:", proofUrl)
      }

      // Then, create the payment record
      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          transaction_id: transactionId,
          payment_method: paymentMethod,
          proof_url: proofUrl
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Payment creation failed")
      }

      const result = await response.json()
      console.log("[v0] Payment created:", result.payment.id)

      toast.success("Payment submitted successfully! Your proof has been recorded. Awaiting admin approval.")
      setTransactionId("")
      clearFile()
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
            Then enter your transaction ID and upload the payment screenshot below.
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

        {/* Payment Proof Upload */}
        <div>
          <label htmlFor="proof" className="text-sm font-medium text-foreground mb-2 block">
            Payment Proof Screenshot
          </label>
          {previewUrl ? (
            <div className="space-y-3">
              <div className="relative w-full h-40 rounded-lg border-2 border-dashed border-border overflow-hidden bg-muted">
                <img 
                  src={previewUrl} 
                  alt="Payment proof preview" 
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  onClick={clearFile}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  disabled={isProcessing}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-green-600 dark:text-green-400">✓ File uploaded: {proofFile?.name}</p>
            </div>
          ) : (
            <label className="block w-full p-6 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted transition-colors">
              <div className="flex flex-col items-center justify-center">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium text-foreground">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB</p>
              </div>
              <input
                id="proof"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isProcessing}
                className="hidden"
              />
            </label>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            Upload a screenshot of your payment confirmation showing the transaction
          </p>
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          disabled={isProcessing || !proofFile}
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
        Your payment and proof will be verified by our admin team within 24 hours.
      </p>
    </div>
  )
}
