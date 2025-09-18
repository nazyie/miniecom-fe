export interface RequestUser {
  firstName: string;
  secondName: string;
  phoneNo: string;
  email: string;
}

export interface RequestPassword {
  password: string;
}

export interface ResponseEntitlementCard {
  name: string;
  id: string;
  tier: string;
  validUntil: string;
  maxShop: number;
  maxTransaction: number;
  maxCatalogue: number;
  shopUsage: number;
  transactionUsage: number;
  catalogueUsage: number;
  isAdsEnabled: boolean;
  isPaymentGatewayEnabled: boolean;
  updatedAt: string;
}

