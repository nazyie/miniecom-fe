export interface Catalogue {
    id: string;

    slug: string;
    name: string;
    catalogueType: string;
    itemDescription: string;
    publish: boolean;
    facility: CatalogueFacility | null;
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