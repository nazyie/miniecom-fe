export interface ResponseCatalogue {
    id: string;
    slug: string;
    name: string;
    catalogueType: string;
    itemDescription: string;
    publish: boolean;
}

export interface Catalogue {
    id: string;

    slug: string;
    name: string;
    catalogueType: string;
    itemDescription: string;
    publish: boolean;
    facility: CatalogueFacility | null;
}

export interface CatalogueAttachment {
  id: string;
  catalogueId: string;
  primaryImage: boolean;
  path: string;
  originalFileName: string;
}

export interface CatalogueFacilityPackage {
  id: string;
  catalogueId: string;
  packageName: string;
  ruleType: string;
  threshold: string;
  pricePerSlot: string;
  totalPrice: string;
}

export interface CatalogueVariant {
    id: string;

    variantName: string;
    variantCode: string;
    stockCount: number;
}

export interface CatalogueFacility {
    price: string;
    bookingFrequency: string;
    openingTime: string;
    closingTime: string;

    sundaySlot: boolean;
    mondaySlot: boolean;
    tuesdaySlot: boolean;
    wednesdaySlot: boolean;
    thursdaySlot: boolean;
    fridaySlot: boolean;
    saturdaySlot: boolean;
}
