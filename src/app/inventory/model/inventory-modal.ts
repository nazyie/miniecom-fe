export interface Inventory {
    id: string;
    name: string;
    showInventory: boolean;
    itemDescription: string;
}

export interface InventoryStock {
    id: string;
    variantName: string;
    variantCode: string;
    stockCount: number;
} 