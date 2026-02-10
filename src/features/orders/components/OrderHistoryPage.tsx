'use client'

import React, { useState, useEffect } from 'react';
import { ChevronDown, Calendar, Package, ArrowRight, Truck, Ban, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import {  getAllOrdersForUser } from "@/features/orders/actions/order.action";
import { redirect } from 'next/navigation';
import { getLoggedInUser } from "@/features/user/actions/action.user";

type OrderStatus = "PENDING" | "CANCELED" | "COMPLETED"

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  product: {
    name: string;
    url: string;
    price: number;
  };
  orderId: string;
}

interface Order {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  status: OrderStatus;
  totalPrice: number;
  discount: number;
  tax: number;
  orderItems: OrderItem[];
}

const StatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const styles = {
    COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-100",
    PENDING: "bg-blue-50 text-blue-700 border-blue-100",
    CANCELED: "bg-red-50 text-red-700 border-red-100",
  };

  const icons = {
    COMPLETED: <CheckCircle className="w-3.5 h-3.5 mr-1.5" />,
    PENDING: <Clock className="w-3.5 h-3.5 mr-1.5" />,
    CANCELED: <Ban className="w-3.5 h-3.5 mr-1.5" />,
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
        styles[status] || styles.PENDING
      }`}
    >
      {icons[status]}
      {status}
    </span>
  );
};


const Orders = ({ orders }: { orders: OrderWithItems[] }) => {
  
  const [filter, setFilter] = useState<OrderStatus | 'All'>('All');
  // const [loading, setLoading] = useState(true);
  
  

  

  const filteredOrders = filter === 'All' ? orders : orders.filter(o => o.status === filter);

  // if (loading) return <p className="text-center py-20">Loading orders...</p>;

  return (
    <div className="min-h-screen bg-slate-50 py-12 mt-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header + Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="mt-2 text-gray-500">Manage your orders and view their status</p>
          </div>

          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
            {(['All', "PENDING", "CANCELED", "COMPLETED"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === tab ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length > 0 ? (
            filteredOrders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden mb-6">
                {/* Header */}
                <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <Package className="w-6 h-6 text-gray-700" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{order.id}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar className="w-3.5 h-3.5 mr-1.5" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-6 flex-1">
                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                      <p className="text-lg font-bold text-gray-900">${order.totalPrice.toFixed(2)}</p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                </div>

                {/* Expanded Items */}
                <div className="border-t border-gray-50 bg-gray-50/50 p-6 animate-in slide-in-from-top-2 duration-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Order Items</h4>
                  <div className="space-y-4">
                    {order.orderItems.map(item => (
                      <div key={item.id} className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <img src={item.product.url} alt={item.product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-semibold text-gray-900">{item.product.name}</h5>
                            </div>
                            <p className="font-medium text-gray-900">${item.product.price.toFixed(2)}</p>
                          </div>
                          <div className="mt-2 text-sm text-gray-600">Qty: {item.quantity}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 border-dashed">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
              <p className="text-gray-500 mt-1 mb-6">You haven't placed any orders yet.</p>
              {/* <Link to="/" className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                Start Shopping <ArrowRight className="w-4 h-4 ml-2" />
              </Link> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
