export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  customerName: string;
  createdAt: string;  
  total: number;
  isConcluded: boolean;
  deadlineDate?: string;
  finishedDate?: string; 
  items: OrderItem[];
}
