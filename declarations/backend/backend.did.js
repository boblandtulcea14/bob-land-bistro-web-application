export const idlFactory = ({ IDL }) => {
  const Time = IDL.Int;
  const MenuCategory = IDL.Variant({
    'bobsMagic' : IDL.Null,
    'patiserie' : IDL.Null,
    'inghetataArtizanalaItaliana' : IDL.Null,
    'waffleStickBombs' : IDL.Null,
    'snacks' : IDL.Null,
    'coffeeMore' : IDL.Null,
    'focacciaSpecialitati' : IDL.Null,
    'clatiteWaffles' : IDL.Null,
  });
  const GalleryImage = IDL.Record({
    'id' : IDL.Nat,
    'title' : IDL.Text,
    'imagePath' : IDL.Text,
    'createdAt' : Time,
    'description' : IDL.Text,
    'category' : IDL.Opt(MenuCategory),
    'isCategoryImage' : IDL.Bool,
  });
  const MenuItem = IDL.Record({
    'id' : IDL.Nat,
    'imagePath' : IDL.Opt(IDL.Text),
    'name' : IDL.Text,
    'createdAt' : Time,
    'description' : IDL.Text,
    'category' : MenuCategory,
    'price' : IDL.Nat,
  });
  const UserRole = IDL.Variant({
    'admin' : IDL.Null,
    'user' : IDL.Null,
    'guest' : IDL.Null,
  });
  const ReviewStatus = IDL.Variant({
    'pending' : IDL.Null,
    'approved' : IDL.Null,
    'rejected' : IDL.Null,
  });
  const Review = IDL.Record({
    'id' : IDL.Nat,
    'status' : ReviewStatus,
    'createdAt' : Time,
    'reviewerName' : IDL.Text,
    'comment' : IDL.Text,
    'rating' : IDL.Nat,
  });
  const UserProfile = IDL.Record({ 'name' : IDL.Text });
  const ContactInfo = IDL.Record({
    'phoneNumbers' : IDL.Vec(IDL.Text),
    'email' : IDL.Text,
  });
  const FileReference = IDL.Record({ 'hash' : IDL.Text, 'path' : IDL.Text });
  const LocationInfo = IDL.Record({
    'openingHours' : IDL.Text,
    'location' : IDL.Text,
  });
  const PreOrderStatus = IDL.Variant({
    'cancelled' : IDL.Null,
    'pending' : IDL.Null,
    'completed' : IDL.Null,
    'confirmed' : IDL.Null,
  });
  const PreOrder = IDL.Record({
    'id' : IDL.Nat,
    'customerName' : IDL.Text,
    'status' : PreOrderStatus,
    'contactInfo' : IDL.Text,
    'createdAt' : Time,
    'pickupTime' : IDL.Text,
    'items' : IDL.Vec(IDL.Nat),
  });
  const SitePublicationStatus = IDL.Record({
    'publicUrl' : IDL.Text,
    'isLive' : IDL.Bool,
    'lastPublishedAt' : IDL.Opt(Time),
  });
  return IDL.Service({
    'addDefaultCategoryGalleryImages' : IDL.Func([], [], []),
    'addDefaultClatiteWafflesMenuItems' : IDL.Func([], [], []),
    'addGalleryImage' : IDL.Func([GalleryImage], [IDL.Nat], []),
    'addMenuItem' : IDL.Func([MenuItem], [IDL.Nat], []),
    'assignCallerUserRole' : IDL.Func([IDL.Principal, UserRole], [], []),
    'dropFileReference' : IDL.Func([IDL.Text], [], []),
    'getApprovedReviews' : IDL.Func([], [IDL.Vec(Review)], ['query']),
    'getCallerUserProfile' : IDL.Func([], [IDL.Opt(UserProfile)], ['query']),
    'getCallerUserRole' : IDL.Func([], [UserRole], ['query']),
    'getCategoryGalleryImages' : IDL.Func(
        [],
        [IDL.Vec(GalleryImage)],
        ['query'],
      ),
    'getContactInfo' : IDL.Func([], [ContactInfo], ['query']),
    'getDomainValidationContent' : IDL.Func([], [IDL.Text], ['query']),
    'getFileReference' : IDL.Func([IDL.Text], [FileReference], ['query']),
    'getGalleryImages' : IDL.Func([], [IDL.Vec(GalleryImage)], ['query']),
    'getGalleryImagesByCategory' : IDL.Func(
        [MenuCategory],
        [IDL.Vec(GalleryImage)],
        ['query'],
      ),
    'getLocationInfo' : IDL.Func([], [LocationInfo], ['query']),
    'getMenuItems' : IDL.Func([], [IDL.Vec(MenuItem)], ['query']),
    'getMenuItemsByCategory' : IDL.Func(
        [MenuCategory],
        [IDL.Vec(MenuItem)],
        ['query'],
      ),
    'getPreOrder' : IDL.Func([IDL.Nat], [IDL.Opt(PreOrder)], ['query']),
    'getPreOrders' : IDL.Func([], [IDL.Vec(PreOrder)], ['query']),
    'getReviews' : IDL.Func([], [IDL.Vec(Review)], ['query']),
    'getSitePublicationStatus' : IDL.Func(
        [],
        [SitePublicationStatus],
        ['query'],
      ),
    'getUserProfile' : IDL.Func(
        [IDL.Principal],
        [IDL.Opt(UserProfile)],
        ['query'],
      ),
    'initializeAccessControl' : IDL.Func([], [], []),
    'isCallerAdmin' : IDL.Func([], [IDL.Bool], ['query']),
    'listFileReferences' : IDL.Func([], [IDL.Vec(FileReference)], ['query']),
    'moderateReview' : IDL.Func([IDL.Nat, ReviewStatus], [], []),
    'placePreOrder' : IDL.Func([PreOrder], [IDL.Nat], []),
    'publishSite' : IDL.Func([], [SitePublicationStatus], []),
    'registerFileReference' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'removeGalleryImage' : IDL.Func([IDL.Nat], [], []),
    'removeMenuItem' : IDL.Func([IDL.Nat], [], []),
    'saveCallerUserProfile' : IDL.Func([UserProfile], [], []),
    'setDomainValidationContent' : IDL.Func([IDL.Text], [], []),
    'submitReview' : IDL.Func([Review], [IDL.Nat], []),
    'updateContactInfo' : IDL.Func([ContactInfo], [], []),
    'updateGalleryImage' : IDL.Func([IDL.Nat, GalleryImage], [], []),
    'updateLocationInfo' : IDL.Func([LocationInfo], [], []),
    'updateMenuItem' : IDL.Func([IDL.Nat, MenuItem], [], []),
    'updatePreOrderStatus' : IDL.Func([IDL.Nat, PreOrderStatus], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
