"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, CreditCard, CheckCircle, XCircle, Clock } from "lucide-react"
import { toast } from "sonner"

interface Payment {
  id: string
  user_id: string
  resource_id: string | null
  amount: number
  payment_type: string
  transaction_id: string | null
  status: string
  created_at: string
  profiles?: {
    full_name: string | null
    email: string | null
  }
  resources?: {
    title: string
  }
}

export function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")
  const supabase = createClient()

  useEffect(() => {
    fetchPayments()
  }, [])

  async function fetchPayments() {
    try {
      console.log("[v0] Fetching payments...")
      const { data, error } = await supabase
        .from("payments")
        .select(`
          *,
          profiles:user_id (full_name, email),
          resources:resource_id (title)
        `)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("[v0] Fetch payments error:", error)
        toast.error(`Failed to load payments: ${error.message}`)
      } else {
        console.log("[v0] Payments loaded:", data?.length || 0)
        setPayments(data || [])
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load payments"
      console.error("[v0] Fetch exception:", err)
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  async function updatePaymentStatus(paymentId: string, newStatus: string, userId: string) {
    try {
      console.log("[v0] Updating payment status:", paymentId, "->", newStatus)
      const { error } = await supabase
        .from("payments")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", paymentId)

      if (error) {
        console.error("[v0] Payment update error:", error)
        toast.error(`Failed to update payment status: ${error.message}`)
        return
      }

      // If approved, update user subscription
      if (newStatus === "approved") {
        console.log("[v0] Updating subscription for user:", userId)
        const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        const { error: subError } = await supabase
          .from("profiles")
          .update({
            is_subscribed: true,
            subscription_expires_at: expiryDate,
            updated_at: new Date().toISOString()
          })
          .eq("id", userId)
        
        if (subError) {
          console.error("[v0] Subscription update error:", subError)
          toast.error(`Payment approved but subscription update failed: ${subError.message}`)
        }
      }

      console.log("[v0] Payment status updated successfully")
      toast.success(`Payment ${newStatus} successfully!`)
      fetchPayments()
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error"
      console.error("[v0] Status update exception:", err)
      toast.error(msg)
    }
  }

  const filteredPayments = statusFilter === "all"
    ? payments
    : payments.filter((p) => p.status === statusFilter)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-600 text-white">
            <CheckCircle className="h-3 w-3 mr-1" /> Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-600 text-white">
            <XCircle className="h-3 w-3 mr-1" /> Rejected
          </Badge>
        )
      default:
        return (
          <Badge className="bg-yellow-600 text-white">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        )
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-foreground">Payment Management</CardTitle>
            <CardDescription>Review and approve payment requests</CardDescription>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-input text-foreground">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {filteredPayments.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No payments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-muted-foreground">User</TableHead>
                  <TableHead className="text-muted-foreground">Type</TableHead>
                  <TableHead className="text-muted-foreground">Amount</TableHead>
                  <TableHead className="text-muted-foreground">Transaction ID</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Date</TableHead>
                  <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id} className="border-border">
                    <TableCell>
                      <div>
                        <p className="text-foreground font-medium">
                          {payment.profiles?.full_name || "Unknown"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {payment.profiles?.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground capitalize">
                      {payment.payment_type}
                      {payment.resources && (
                        <p className="text-xs text-muted-foreground">
                          {payment.resources.title}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="text-foreground font-medium">
                      ₹{payment.amount}
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-sm">
                      {payment.transaction_id || "-"}
                    </TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {payment.status === "pending" && (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            onClick={() => updatePaymentStatus(payment.id, "approved", payment.user_id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updatePaymentStatus(payment.id, "rejected", payment.user_id)}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <Card className="bg-secondary border-border">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Pending</p>
                <p className="text-2xl font-bold text-yellow-500">
                  ₹{payments.filter(p => p.status === "pending").reduce((acc, p) => acc + p.amount, 0)}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-secondary border-border">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Approved</p>
                <p className="text-2xl font-bold text-green-500">
                  ₹{payments.filter(p => p.status === "approved").reduce((acc, p) => acc + p.amount, 0)}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-secondary border-border">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Rejected</p>
                <p className="text-2xl font-bold text-red-500">
                  ₹{payments.filter(p => p.status === "rejected").reduce((acc, p) => acc + p.amount, 0)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}
