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
  shopQuota: number;
  transactionQuota: number;
  catalogueQuota: number;
  isAdsEnabled: boolean;
  isPaymentGatewayEnabled: boolean;
  updatedAt: string;
}

