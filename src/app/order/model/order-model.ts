export interface Order {
  id: string;
  email: string;
  name: string;
  address: string;
  paymentMethod: string;
  totalAmount: number;
  status: string;
  orderType: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
}

export interface ResponseOrderBooking {

}

export interface ResponseOrderInventory {
    
}