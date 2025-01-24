"use client";

import React from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Filter } from "lucide-react";
import { updateUserRole } from "@/actions/action.user";
import { Role } from "@prisma/client";

interface Order {
  id: string;
  status: "PENDING" | "COMPLETED" | "CANCELED";
  totalPrice: number;
}

interface Payment {
  id: string;
  amount: number;
  status: "PENDING" | "SUCCESS" | "FAILED";
}

interface User {
  id: string;
  clerkId: string;
  role: Role;
  createdAt: Date;
  name: string;
  email: string;
  orders: Order[];
  payments: Payment[];
  _count: {
    orders: number;
    payments: number;
  };
}

interface AdminUsersPageProps {
  initialUsers: User[];
}

const AdminUsersPage: React.FC<AdminUsersPageProps> = ({ initialUsers }) => {
  const [users, setUsers] = React.useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState<"ALL" | Role>("ALL");
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleRoleChange = async (userId: string, newRole: Role) => {
    try {
      setIsUpdating(true);
      await updateUserRole(userId, newRole);
      toast.success("User role updated successfully");

      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.log("error", error);
      toast.error("Failed to update user role");
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const exportUsers = () => {
    const csv = [
      [
        "User ID",
        "Name",
        "Email",
        "Role",
        "Join Date",
        "Orders",
        "Total Spent",
      ],
      ...filteredUsers.map((user) => [
        user.id,
        user.name,
        user.email,
        user.role,
        format(new Date(user.createdAt), "yyyy-MM-dd"),
        user._count.orders,
        user.payments.reduce(
          (sum, payment) =>
            sum + (payment.status === "SUCCESS" ? payment.amount : 0),
          0
        ),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">User Management</CardTitle>
          <Button variant="outline" onClick={exportUsers}>
            <Download className="h-4 w-4 mr-2" />
            Export Users
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users by name or email..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={roleFilter}
              onValueChange={(value: "ALL" | Role) => setRoleFilter(value)}
            >
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Users</SelectItem>
                <SelectItem value="ADMIN">Admins</SelectItem>
                <SelectItem value="USER">Users</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Select
                        defaultValue={user.role}
                        onValueChange={(value: Role) =>
                          handleRoleChange(user.id, value)
                        }
                        disabled={isUpdating}
                      >
                        <SelectTrigger className="w-[100px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                          <SelectItem value="USER">User</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {format(new Date(user.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>{user._count.orders}</TableCell>
                    <TableCell>
                      $
                      {user.payments
                        .reduce(
                          (sum, payment) =>
                            sum +
                            (payment.status === "SUCCESS" ? payment.amount : 0),
                          0
                        )
                        .toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>User Details</DialogTitle>
                          </DialogHeader>
                          {selectedUser && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h3 className="font-semibold">
                                    User Information
                                  </h3>
                                  <p>Name: {selectedUser.name}</p>
                                  <p>Email: {selectedUser.email}</p>
                                  <p>Role: {selectedUser.role}</p>
                                  <p>
                                    Join Date:{" "}
                                    {format(
                                      new Date(selectedUser.createdAt),
                                      "PPP"
                                    )}
                                  </p>
                                </div>
                                <div>
                                  <h3 className="font-semibold">
                                    Activity Summary
                                  </h3>
                                  <p>
                                    Total Orders: {selectedUser._count.orders}
                                  </p>
                                  <p>
                                    Total Payments:{" "}
                                    {selectedUser._count.payments}
                                  </p>
                                  <p>
                                    Total Spent: $
                                    {selectedUser.payments
                                      .reduce(
                                        (sum, payment) =>
                                          sum +
                                          (payment.status === "SUCCESS"
                                            ? payment.amount
                                            : 0),
                                        0
                                      )
                                      .toFixed(2)}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <h3 className="font-semibold mb-2">
                                  Recent Orders
                                </h3>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Order ID</TableHead>
                                      <TableHead>Status</TableHead>
                                      <TableHead>Amount</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {selectedUser.orders
                                      .slice(0, 5)
                                      .map((order) => (
                                        <TableRow key={order.id}>
                                          <TableCell>
                                            #{order.id.slice(-6)}
                                          </TableCell>
                                          <TableCell>
                                            <Badge
                                              variant={
                                                order.status === "COMPLETED"
                                                  ? "default"
                                                  : order.status === "CANCELED"
                                                  ? "destructive"
                                                  : "secondary"
                                              }
                                            >
                                              {order.status}
                                            </Badge>
                                          </TableCell>
                                          <TableCell>
                                            ${order.totalPrice.toFixed(2)}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsersPage;
