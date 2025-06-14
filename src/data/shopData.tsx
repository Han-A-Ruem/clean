// This file is kept for backward compatibility
// Shop items are now fetched from the database

import { ShopItemType } from "@/services/shopItemService";

// This is just a placeholder for components that might still import from here
// All shop items are now loaded from the database via shopItemService
export const shopItems: ShopItemType[] = [];

// Categories are now dynamically loaded from the database
export const shopCategories: string[] = ["전체"];
export type { ShopItemType };

