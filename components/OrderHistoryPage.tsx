import React from 'react';
import { format } from 'date-fns';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Package, Clock, DollarSign } from 'lucide-react';

const StatusStyles = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CANCELED: 'bg-red-100 text-red-800',
  COMPLETED: 'bg-green-100 text-green-800'
};

export const OrderHistoryPage = ({ orders }: { orders: OrderWithItems[] }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="container mx-auto py-8 mt-14">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      
      {orders.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-gray-500">
            <Package className="mx-auto mb-4 h-12 w-12" />
            <p>You haven't placed any orders yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    Order #{order.id.slice(-6)}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {format(new Date(order.createdAt), 'MMM d, yyyy')}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {formatCurrency(order.totalPrice)}
                    </div>
                  </div>
                </div>
                <Badge 
                  className={`${StatusStyles[order.status]} px-3 py-1`}
                >
                  {order.status}
                </Badge>
              </CardHeader>
              
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value="items">
                    <AccordionTrigger>
                      Order Details
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div className="divide-y">
                          {order.orderItems.map((item) => (
                            <div 
                              key={item.id} 
                              className="py-4 flex items-center justify-between"
                            >
                              <div className="flex items-center gap-4">
                                <img
                                  src={item.product.url || '/api/placeholder/80/80'}
                                  alt={item.product.name}
                                  className="h-16 w-16 object-cover rounded"
                                />
                                <div>
                                  <h3 className="font-medium">
                                    {item.product.name}
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    Quantity: {item.quantity}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Price per item: {formatCurrency(item.product.price)}
                                  </p>
                                </div>
                              </div>
                              <p className="font-medium">
                                {formatCurrency(item.product.price * item.quantity)}
                              </p>
                            </div>
                          ))}
                        </div>
                        
                        <div className="border-t pt-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Subtotal</span>
                              <span>{formatCurrency(order.totalPrice - order.tax - 10)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Shipping</span>
                              <span>{formatCurrency(10)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Tax</span>
                              <span>{formatCurrency(order.tax)}</span>
                            </div>
                            {order.discount > 0 && (
                              <div className="flex justify-between text-green-600">
                                <span>Discount</span>
                                <span>-{formatCurrency(order.discount)}</span>
                              </div>
                            )}
                            <div className="flex justify-between font-bold pt-2 border-t">
                              <span>Total</span>
                              <span>{formatCurrency(order.totalPrice)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};








