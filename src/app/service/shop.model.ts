export interface Shop {
  id: string;
  slug: string;
  name: string;

  openShop: boolean;
  enableOrderConfirm: boolean;
  enableOrderDeliver: boolean;
  enableOrderPayment: boolean;

  status: string;

  quotaLimit: number;

  createdAt?: string;
  updatedAt?: string;

  createdBy?: string;
  updatedBy?: string;
};

export const NewShop : Shop = {
  id: '',
  slug: '',
  name: '',
  openShop: false,
  enableOrderConfirm: false,
  enableOrderDeliver: false,
  enableOrderPayment: false,
  status: 'ACTIVE',
  quotaLimit: -1,
  createdAt: '',
  updatedAt: '',
  createdBy: '',
  updatedBy: ''
};