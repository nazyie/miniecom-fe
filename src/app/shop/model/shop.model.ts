export interface Shop {
  id: string;
  slug: string;
  name: string;
  shopLogoPath: string;
  shopType: string;

  openShop: boolean;
  enableOrderConfirm: boolean;
  enableOrderDeliver: boolean;

  enableFpx: boolean;

  enableCashOnArrival: boolean;

  enableReceiptUpload: boolean;
  bankDetailAttachmentPath: string;
  bankAccountNumber: string;
  bankAccountName: string;
  bankName: string;

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
  shopLogoPath: '',

  openShop: false,
  enableOrderConfirm: false,
  enableOrderDeliver: false,

  enableFpx: false,

  enableCashOnArrival: false,

  enableReceiptUpload: false,
  bankDetailAttachmentPath: '',
  bankAccountNumber: '',
  bankAccountName: '',
  bankName: '',

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