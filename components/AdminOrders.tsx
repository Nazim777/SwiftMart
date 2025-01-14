"use client";

import React, { useState } from "react";
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
import { updateOrderStatus,cancelOrder } from "@/actions/order.action";

// Type definitions based on your Prisma schema
type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED";
type OrderStatus = "PENDING" | "COMPLETED" | "CANCELED";

interface Product {
  id: string;
  name: string;
  price: number;
}

interface OrderItem {
  id: string;
  quantity: number;
  product: Product;
}

interface Payment {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: PaymentStatus;
  userId: string;
  orderId: string;
  stripePaymentId: string;
  amount: number;
}

interface User {
  email: string;
  name: string;
}

interface Order {
  id: string;
  createdAt: Date;
  status: OrderStatus;
  totalPrice: number;
  orderItems: OrderItem[];
  user: User;
  payment?: Payment | undefined | null;
}

interface AdminOrdersPageProps {
  initialOrders: Order[];
}

export const AdminOrdersPage: React.FC<AdminOrdersPageProps> = ({
  initialOrders,
}) => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] =useState<"ALL" | OrderStatus>(
    "ALL"
  );
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleStatusChange = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    try {
      console.log('orderId',orderId,'status',newStatus)
      setIsUpdating(true);
      const response = await updateOrderStatus(orderId, newStatus);
      if(response.success){
        console.log('success fully order updated')
      }
      toast.success("Order status updated successfully");

      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.log('error',error)
      toast.error("Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      setIsUpdating(true);
      await cancelOrder(orderId);
      toast.success("Order cancelled successfully");

      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: "CANCELED" } : order
        )
      );
    } catch (error) {
      console.log('error',error)
      toast.error("Failed to cancel order");
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportOrders = () => {
    const csv = [
      [
        "Order ID",
        "Customer",
        "Date",
        "Items",
        "Total",
        "Status",
        "Payment Status",
      ],
      ...filteredOrders.map((order) => [
        order.id,
        order.user.email,
        format(new Date(order.createdAt), "yyyy-MM-dd"),
        order.orderItems.length,
        order.totalPrice,
        order.status,
        order.payment?.status || "PENDING",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">
            Orders Management
          </CardTitle>
          <Button variant="outline" onClick={exportOrders}>
            <Download className="h-4 w-4 mr-2" />
            Export Orders
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search orders by ID or customer email..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value: "ALL" | OrderStatus) =>
                setStatusFilter(value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Orders</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELED">Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      #{order.id.slice(-6)}
                    </TableCell>
                    <TableCell>{order.user.email}</TableCell>
                    <TableCell>
                      {format(new Date(order.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>{order.orderItems.length} items</TableCell>
                    <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                    <TableCell>
                      <Select
                        defaultValue={order.status}
                        onValueChange={(value: OrderStatus) =>
                          handleStatusChange(order.id, value)
                        }
                        disabled={isUpdating}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="COMPLETED">Completed</SelectItem>
                          <SelectItem value="CANCELED">Canceled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge>{order.payment?.status || "PENDING"}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                            >
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Order Details</DialogTitle>
                            </DialogHeader>
                            {selectedOrder && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h3 className="font-semibold">
                                      Customer Information
                                    </h3>
                                    <p>Email: {selectedOrder.user.email}</p>
                                    <p>
                                      Order Date:{" "}
                                      {format(
                                        new Date(selectedOrder.createdAt),
                                        "PPP"
                                      )}
                                    </p>
                                  </div>
                                  <div>
                                    <h3 className="font-semibold">
                                      Order Summary
                                    </h3>
                                    <p>Status: {selectedOrder.status}</p>
                                    <p>
                                      Total:{" "}
                                      {formatCurrency(selectedOrder.totalPrice)}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <h3 className="font-semibold mb-2">
                                    Order Items
                                  </h3>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Total</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {selectedOrder.orderItems.map((item) => (
                                        <TableRow key={item.id}>
                                          <TableCell>
                                            {item.product.name}
                                          </TableCell>
                                          <TableCell>{item.quantity}</TableCell>
                                          <TableCell>
                                            {formatCurrency(item.product.price)}
                                          </TableCell>
                                          <TableCell>
                                            {formatCurrency(
                                              item.product.price * item.quantity
                                            )}
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
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={order.status === "CANCELED" || isUpdating}
                        >
                          Cancel
                        </Button>
                      </div>
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

export default AdminOrdersPage;
