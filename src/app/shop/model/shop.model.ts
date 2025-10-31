export interface Shop {
  id: string;
  slug: string;
  name: string;
  shopType: string;

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

export const initialShop: Shop = {
  id: '',
  slug: '',
  name: '',
  shopType: '',

  openShop: false,
  enableOrderConfirm: false,
  enableOrderDeliver: false,
  enableOrderPayment: false,

  status: '',
  quotaLimit: 0,

  createdAt: '',
  updatedAt: '',
  createdBy: '',
  updatedBy: '',
};


export interface ResponseShopDropdown {
  id: string;
  name: string;
  openShop: boolean;
  shopType: string;

}