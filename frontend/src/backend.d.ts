import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface PreOrder {
    id: bigint;
    customerName: string;
    status: PreOrderStatus;
    contactInfo: string;
    createdAt: Time;
    orderType: {
        __kind__: "pickup";
        pickup: {
            pickupTime?: string;
        };
    } | {
        __kind__: "delivery";
        delivery: {
            paymentMethod: PaymentMethod;
            specialInstructions?: string;
            address: DeliveryAddress;
            timeSlot: DeliveryTimeSlot;
        };
    };
    items: Array<bigint>;
}
export interface LocationInfo {
    openingHours: string;
    location: string;
}
export interface DeliveryTimeSlot {
    end: string;
    start: string;
}
export interface MenuItem {
    id: bigint;
    imagePath?: string;
    name: string;
    createdAt: Time;
    description: string;
    category: MenuCategory;
    price: bigint;
}
export interface GalleryImage {
    id: bigint;
    title: string;
    imagePath: string;
    createdAt: Time;
    description: string;
    category?: MenuCategory;
    isCategoryImage: boolean;
}
export interface SitePublicationStatus {
    publicUrl: string;
    isLive: boolean;
    lastPublishedAt?: Time;
}
export interface FileReference {
    hash: string;
    path: string;
}
export interface DeliveryAddress {
    street: string;
    city: string;
    instructions?: string;
    zipCode: string;
}
export interface ContactInfo {
    phoneNumbers: Array<string>;
    email: string;
}
export interface Review {
    id: bigint;
    status: ReviewStatus;
    createdAt: Time;
    reviewerName: string;
    comment: string;
    rating: bigint;
}
export interface UserProfile {
    name: string;
}
export enum MenuCategory {
    bobsMagic = "bobsMagic",
    patiserie = "patiserie",
    inghetataArtizanalaItaliana = "inghetataArtizanalaItaliana",
    waffleStickBombs = "waffleStickBombs",
    snacks = "snacks",
    coffeeMore = "coffeeMore",
    focacciaSpecialitati = "focacciaSpecialitati",
    clatiteWaffles = "clatiteWaffles"
}
export enum PaymentMethod {
    cashOnDelivery = "cashOnDelivery",
    cardOnDelivery = "cardOnDelivery"
}
export enum PreOrderStatus {
    cancelled = "cancelled",
    pending = "pending",
    completed = "completed",
    confirmed = "confirmed"
}
export enum ReviewStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addDefaultCategoryGalleryImages(): Promise<void>;
    addDefaultClatiteWafflesMenuItems(): Promise<void>;
    addGalleryImage(galleryImage: GalleryImage): Promise<bigint>;
    addMenuItem(menuItem: MenuItem): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    dropFileReference(path: string): Promise<void>;
    getApprovedReviews(): Promise<Array<Review>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCategoryGalleryImages(): Promise<Array<GalleryImage>>;
    getContactInfo(): Promise<ContactInfo>;
    getDomainValidationContent(): Promise<string>;
    getFileReference(path: string): Promise<FileReference>;
    getGalleryImages(): Promise<Array<GalleryImage>>;
    getGalleryImagesByCategory(category: MenuCategory): Promise<Array<GalleryImage>>;
    getICPDomainAndValidationToken(): Promise<{
        icpDomain: string;
        validationToken: string;
    }>;
    getLocationInfo(): Promise<LocationInfo>;
    getMenuItems(): Promise<Array<MenuItem>>;
    getMenuItemsByCategory(category: MenuCategory): Promise<Array<MenuItem>>;
    getPreOrder(id: bigint): Promise<PreOrder | null>;
    getPreOrders(): Promise<Array<PreOrder>>;
    getReviews(): Promise<Array<Review>>;
    getSitePublicationStatus(): Promise<SitePublicationStatus>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeAccessControl(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    listFileReferences(): Promise<Array<FileReference>>;
    moderateReview(id: bigint, status: ReviewStatus): Promise<void>;
    placeDeliveryOrder(deliveryOrder: PreOrder): Promise<bigint>;
    placePickupOrder(preOrder: PreOrder): Promise<bigint>;
    publishSite(): Promise<SitePublicationStatus>;
    registerFileReference(path: string, hash: string): Promise<void>;
    removeGalleryImage(id: bigint): Promise<void>;
    removeMenuItem(id: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setDomainValidationContent(content: string): Promise<void>;
    submitReview(review: Review): Promise<bigint>;
    updateContactInfo(newContactInfo: ContactInfo): Promise<void>;
    updateGalleryImage(id: bigint, galleryImage: GalleryImage): Promise<void>;
    updateLocationInfo(newLocationInfo: LocationInfo): Promise<void>;
    updateMenuItem(id: bigint, menuItem: MenuItem): Promise<void>;
    updatePreOrderStatus(id: bigint, status: PreOrderStatus): Promise<void>;
}
