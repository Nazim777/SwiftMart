'use client'

import React from 'react';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { ArrowUpCircle, ArrowDownCircle, DollarSign, Package, Users, ShoppingCart, LucideIcon } from 'lucide-react';

interface DashboardStats {
  users: {
    total: number;
    newThisMonth: number;
    growth: number;
  };
  orders: {
    total: number;
    thisMonth: number;
    growth: number;
  };
  revenue: {
    total: number;
    thisMonth: number;
    growth: number;
  };
  topProducts: {
    id: string;
    name: string;
    price: number;
    stock: number;
    _count: {
      orderItems: number;
    };
  }[];
  recentOrders: any[]; // Full type definition omitted for brevity
  paymentStats: {
    status: string;
    _count: number;
  }[];
  monthlyStats: {
    createdAt: Date;
    _count: number;
    _sum: {
      totalPrice: number | null;
    };
  }[];
}

interface AdminDashboardProps {
  initialStats: DashboardStats;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ initialStats }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const StatCard = ({ title, value, growth, icon: Icon, prefix = '' }:{title:string;value:number | string; growth:number, icon:LucideIcon,prefix?:string}) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{prefix}{value}</div>
        <div className="flex items-center text-sm text-muted-foreground">
          {growth >= 0 ? (
            <ArrowUpCircle className="h-4 w-4 text-green-500 mr-1" />
          ) : (
            <ArrowDownCircle className="h-4 w-4 text-red-500 mr-1" />
          )}
          {Math.abs(growth).toFixed(1)}% from last month
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(initialStats.revenue.total)}
          growth={initialStats.revenue.growth}
          icon={DollarSign}
        />
        <StatCard
          title="Orders This Month"
          value={initialStats.orders.thisMonth}
          growth={initialStats.orders.growth}
          icon={Package}
        />
        <StatCard
          title="Total Users"
          value={initialStats.users.total}
          growth={initialStats.users.growth}
          icon={Users}
        />
        <StatCard
          title="New Users"
          value={initialStats.users.newThisMonth}
          growth={initialStats.users.growth}
          icon={ShoppingCart}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={initialStats.monthlyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="createdAt" 
                    tickFormatter={(date) => format(new Date(date), 'MMM')}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={(date) => format(new Date(date), 'MMMM yyyy')}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="_sum.totalPrice" 
                    stroke="#8884d8" 
                    name="Revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={initialStats.monthlyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="createdAt"
                    tickFormatter={(date) => format(new Date(date), 'MMM')}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(date) => format(new Date(date), 'MMMM yyyy')}
                  />
                  <Bar 
                    dataKey="_count" 
                    fill="#8884d8" 
                    name="Orders"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products and Recent Orders */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {initialStats.topProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product._count.orderItems} orders
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(product.price)}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.stock} in stock
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {initialStats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Order #{order.id.slice(-6)}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.user.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(order.totalPrice)}</p>
                    <Badge 
                    variant={
                        order.status === 'COMPLETED' ? 'default' :     
                        order.status === 'CANCELED' ? 'destructive' :
                        'secondary'                                    
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
