"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, Users, Shield, ShieldOff, Crown, CrownOff } from "lucide-react"
import { toast } from "sonner"

interface Profile {
  id: string
  full_name: string | null
  email: string | null
  is_admin: boolean
  is_subscribed: boolean
  subscription_expires_at: string | null
  created_at: string
}

export function AdminUsers() {
  const [users, setUsers] = useState<Profile[]>([])
  const [filteredUsers, setFilteredUsers] = useState<Profile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const supabase = createClient()

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredUsers(
        users.filter(
          (user) =>
            user.email?.toLowerCase().includes(query) ||
            user.full_name?.toLowerCase().includes(query)
        )
      )
    }
  }, [searchQuery, users])

  async function fetchUsers() {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      toast.error("Failed to load users")
    } else {
      setUsers(data || [])
      setFilteredUsers(data || [])
    }
    setIsLoading(false)
  }

  async function toggleAdmin(userId: string, currentValue: boolean) {
    const { error } = await supabase
      .from("profiles")
      .update({ is_admin: !currentValue })
      .eq("id", userId)

    if (error) {
      toast.error("Failed to update user")
    } else {
      toast.success(`User ${!currentValue ? "promoted to" : "removed from"} admin`)
      fetchUsers()
    }
  }

  async function toggleSubscription(userId: string, currentValue: boolean) {
    const newExpiry = !currentValue
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
      : null

    const { error } = await supabase
      .from("profiles")
      .update({
        is_subscribed: !currentValue,
        subscription_expires_at: newExpiry
      })
      .eq("id", userId)

    if (error) {
      toast.error("Failed to update subscription")
    } else {
      toast.success(`Subscription ${!currentValue ? "activated" : "deactivated"}`)
      fetchUsers()
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
            <CardTitle className="text-foreground">User Management</CardTitle>
            <CardDescription>Manage user roles and subscriptions</CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-input text-foreground"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {searchQuery ? "No users found matching your search" : "No users yet"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-muted-foreground">User</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Subscription</TableHead>
                  <TableHead className="text-muted-foreground">Joined</TableHead>
                  <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="border-border">
                    <TableCell>
                      <div>
                        <p className="text-foreground font-medium">
                          {user.full_name || "No name"}
                        </p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.is_admin ? (
                        <Badge className="bg-primary text-primary-foreground">Admin</Badge>
                      ) : (
                        <Badge variant="secondary">User</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.is_subscribed ? (
                        <div>
                          <Badge className="bg-green-600 text-white">Subscribed</Badge>
                          {user.subscription_expires_at && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Expires: {new Date(user.subscription_expires_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      ) : (
                        <Badge variant="outline" className="border-muted-foreground text-muted-foreground">
                          Free
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleAdmin(user.id, user.is_admin)}
                          title={user.is_admin ? "Remove admin" : "Make admin"}
                        >
                          {user.is_admin ? (
                            <ShieldOff className="h-4 w-4 text-red-500" />
                          ) : (
                            <Shield className="h-4 w-4 text-green-500" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSubscription(user.id, user.is_subscribed)}
                          title={user.is_subscribed ? "Remove subscription" : "Add subscription"}
                        >
                          {user.is_subscribed ? (
                            <CrownOff className="h-4 w-4 text-red-500" />
                          ) : (
                            <Crown className="h-4 w-4 text-yellow-500" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
