type OrderWithItems = {
    id: string;
    createdAt: Date;
    status: 'PENDING' | 'CANCELED' | 'COMPLETED';
    totalPrice: number;
    discount: number;
    tax: number;
    orderItems: {
      id: string;
      quantity: number;
      product: {
        name: string;
        price: number;
        url: string;
      };
    }[];
  };