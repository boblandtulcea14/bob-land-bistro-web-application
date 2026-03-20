import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface ContactInfo {
  'phoneNumbers' : Array<string>,
  'email' : string,
}
export interface FileReference { 'hash' : string, 'path' : string }
export interface GalleryImage {
  'id' : bigint,
  'title' : string,
  'imagePath' : string,
  'createdAt' : Time,
  'description' : string,
  'category' : [] | [MenuCategory],
  'isCategoryImage' : boolean,
}
export interface LocationInfo { 'openingHours' : string, 'location' : string }
export type MenuCategory = { 'bobsMagic' : null } |
  { 'patiserie' : null } |
  { 'inghetataArtizanalaItaliana' : null } |
  { 'waffleStickBombs' : null } |
  { 'snacks' : null } |
  { 'coffeeMore' : null } |
  { 'focacciaSpecialitati' : null } |
  { 'clatiteWaffles' : null };
export interface MenuItem {
  'id' : bigint,
  'imagePath' : [] | [string],
  'name' : string,
  'createdAt' : Time,
  'description' : string,
  'category' : MenuCategory,
  'price' : bigint,
}
export interface PreOrder {
  'id' : bigint,
  'customerName' : string,
  'status' : PreOrderStatus,
  'contactInfo' : string,
  'createdAt' : Time,
  'pickupTime' : string,
  'items' : Array<bigint>,
}
export type PreOrderStatus = { 'cancelled' : null } |
  { 'pending' : null } |
  { 'completed' : null } |
  { 'confirmed' : null };
export interface Review {
  'id' : bigint,
  'status' : ReviewStatus,
  'createdAt' : Time,
  'reviewerName' : string,
  'comment' : string,
  'rating' : bigint,
}
export type ReviewStatus = { 'pending' : null } |
  { 'approved' : null } |
  { 'rejected' : null };
export interface SitePublicationStatus {
  'publicUrl' : string,
  'isLive' : boolean,
  'lastPublishedAt' : [] | [Time],
}
export type Time = bigint;
export interface UserProfile { 'name' : string }
export type UserRole = { 'admin' : null } |
  { 'user' : null } |
  { 'guest' : null };
export interface _SERVICE {
  'addDefaultCategoryGalleryImages' : ActorMethod<[], undefined>,
  'addDefaultClatiteWafflesMenuItems' : ActorMethod<[], undefined>,
  'addGalleryImage' : ActorMethod<[GalleryImage], bigint>,
  'addMenuItem' : ActorMethod<[MenuItem], bigint>,
  'assignCallerUserRole' : ActorMethod<[Principal, UserRole], undefined>,
  'dropFileReference' : ActorMethod<[string], undefined>,
  'getApprovedReviews' : ActorMethod<[], Array<Review>>,
  'getCallerUserProfile' : ActorMethod<[], [] | [UserProfile]>,
  'getCallerUserRole' : ActorMethod<[], UserRole>,
  'getCategoryGalleryImages' : ActorMethod<[], Array<GalleryImage>>,
  'getContactInfo' : ActorMethod<[], ContactInfo>,
  'getDomainValidationContent' : ActorMethod<[], string>,
  'getFileReference' : ActorMethod<[string], FileReference>,
  'getGalleryImages' : ActorMethod<[], Array<GalleryImage>>,
  'getGalleryImagesByCategory' : ActorMethod<
    [MenuCategory],
    Array<GalleryImage>
  >,
  'getLocationInfo' : ActorMethod<[], LocationInfo>,
  'getMenuItems' : ActorMethod<[], Array<MenuItem>>,
  'getMenuItemsByCategory' : ActorMethod<[MenuCategory], Array<MenuItem>>,
  'getPreOrder' : ActorMethod<[bigint], [] | [PreOrder]>,
  'getPreOrders' : ActorMethod<[], Array<PreOrder>>,
  'getReviews' : ActorMethod<[], Array<Review>>,
  'getSitePublicationStatus' : ActorMethod<[], SitePublicationStatus>,
  'getUserProfile' : ActorMethod<[Principal], [] | [UserProfile]>,
  'initializeAccessControl' : ActorMethod<[], undefined>,
  'isCallerAdmin' : ActorMethod<[], boolean>,
  'listFileReferences' : ActorMethod<[], Array<FileReference>>,
  'moderateReview' : ActorMethod<[bigint, ReviewStatus], undefined>,
  'placePreOrder' : ActorMethod<[PreOrder], bigint>,
  'publishSite' : ActorMethod<[], SitePublicationStatus>,
  'registerFileReference' : ActorMethod<[string, string], undefined>,
  'removeGalleryImage' : ActorMethod<[bigint], undefined>,
  'removeMenuItem' : ActorMethod<[bigint], undefined>,
  'saveCallerUserProfile' : ActorMethod<[UserProfile], undefined>,
  'setDomainValidationContent' : ActorMethod<[string], undefined>,
  'submitReview' : ActorMethod<[Review], bigint>,
  'updateContactInfo' : ActorMethod<[ContactInfo], undefined>,
  'updateGalleryImage' : ActorMethod<[bigint, GalleryImage], undefined>,
  'updateLocationInfo' : ActorMethod<[LocationInfo], undefined>,
  'updateMenuItem' : ActorMethod<[bigint, MenuItem], undefined>,
  'updatePreOrderStatus' : ActorMethod<[bigint, PreOrderStatus], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
