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

export interface ResponseShopDropdown {
  id: string,
  name: string,
  openShop: boolean
}