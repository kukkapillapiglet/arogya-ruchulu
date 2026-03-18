import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CustomerOrder {
    orderId: bigint;
    totalAmount: bigint;
    timestamp: Time;
    items: Array<OrderItem>;
}
export interface MenuItem {
    name: string;
    description: string;
    category: MenuCategory;
    price: bigint;
    vegetarian: boolean;
}
export type Time = bigint;
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
export interface OrderItem {
    itemName: string;
    quantity: bigint;
    priceEach: bigint;
}
export enum MenuCategory {
    breakfast = "breakfast",
    lunch = "lunch",
    specials = "specials",
    dinner = "dinner",
    beverages = "beverages"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAdminOrderCount(): Promise<bigint>;
    getAdminOrders(): Promise<Array<CustomerOrder>>;
    getCallerUserRole(): Promise<UserRole>;
    getGalleryImages(): Promise<Array<GalleryImage>>;
    getMenuItems(): Promise<Array<MenuItem>>;
    getMenuItemsByCategory(category: MenuCategory): Promise<Array<MenuItem>>;
    getRestaurantInfo(): Promise<RestaurantInfo>;
    getSortedMenuByCategory(): Promise<Array<MenuItem>>;
    getVegMenuItems(): Promise<Array<MenuItem>>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(items: Array<OrderItem>, totalAmount: bigint): Promise<bigint>;
}
