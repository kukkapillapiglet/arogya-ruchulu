import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MenuItem {
    name: string;
    description: string;
    category: MenuCategory;
    price: bigint;
    vegetarian: boolean;
}
export interface RestaurantInfo {
    name: string;
    whatsapp: string;
    address: string;
    openingHours: string;
    phone: string;
}
export interface GalleryImage {
    title: string;
    caption: string;
}
export enum MenuCategory {
    breakfast = "breakfast",
    lunch = "lunch",
    specials = "specials",
    dinner = "dinner",
    beverages = "beverages"
}
export interface backendInterface {
    getGalleryImages(): Promise<Array<GalleryImage>>;
    getMenuItems(): Promise<Array<MenuItem>>;
    getMenuItemsByCategory(category: MenuCategory): Promise<Array<MenuItem>>;
    getRestaurantInfo(): Promise<RestaurantInfo>;
    getSortedMenuByCategory(): Promise<Array<MenuItem>>;
    getVegMenuItems(): Promise<Array<MenuItem>>;
}
