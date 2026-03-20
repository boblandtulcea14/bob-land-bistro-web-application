import AccessControl "authorization/access-control";
import BlobStorage "blob-storage/Mixin";
import Registry "blob-storage/registry";
import OrderedMap "mo:base/OrderedMap";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Debug "mo:base/Debug";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";

actor BOBLand {
  let accessControlState = AccessControl.initState();
  let registry = Registry.new();

  transient let natMap = OrderedMap.Make<Nat>(Nat.compare);
  transient let principalMap = OrderedMap.Make<Principal>(Principal.compare);

  var menuItems = natMap.empty<MenuItem>();
  var preOrders = natMap.empty<PreOrder>();
  var reviews = natMap.empty<Review>();
  var userProfiles = principalMap.empty<UserProfile>();
  var galleryImages = natMap.empty<GalleryImage>();

  var nextMenuItemId : Nat = 1;
  var nextPreOrderId : Nat = 1;
  var nextReviewId : Nat = 1;
  var nextGalleryImageId : Nat = 1;

  var contactInfo : ContactInfo = {
    email = "boblandtulcea@gmail.com";
    phoneNumbers = ["0740492169", "0743687940"];
  };

  var locationInfo : LocationInfo = {
    location = "BOB Land - Tulcea - sub Coloane";
    openingHours = "Luni-Duminică 07.30 - 21.00";
  };

  var sitePublicationStatus : SitePublicationStatus = {
    isLive = true;
    publicUrl = "https://bob-land.icp0.io";
    lastPublishedAt = ?Time.now();
  };

  var domainValidationContent : Text = "";

  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  public shared ({ caller }) func registerFileReference(path : Text, hash : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Neautorizat: Doar administratorii pot înregistra referințe de fișiere");
    };
    Registry.add(registry, path, hash);
  };

  public query ({ caller }) func getFileReference(path : Text) : async Registry.FileReference {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Neautorizat: Doar administratorii pot obține referințe de fișiere");
    };
    Registry.get(registry, path);
  };

  public query ({ caller }) func listFileReferences() : async [Registry.FileReference] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Neautorizat: Doar administratorii pot lista referințe de fișiere");
    };
    Registry.list(registry);
  };

  public shared ({ caller }) func dropFileReference(path : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Neautorizat: Doar administratorii pot șterge referințe de fișiere");
    };
    Registry.remove(registry, path);
  };

  public type MenuCategory = {
    #inghetataArtizanalaItaliana;
    #clatiteWaffles;
    #waffleStickBombs;
    #bobsMagic;
    #snacks;
    #focacciaSpecialitati;
    #patiserie;
    #coffeeMore;
  };

  public type MenuItem = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat;
    imagePath : ?Text;
    category : MenuCategory;
    createdAt : Time.Time;
  };

  public type DeliveryAddress = {
    street : Text;
    city : Text;
    zipCode : Text;
    instructions : ?Text;
  };

  public type DeliveryTimeSlot = {
    start : Text;
    end : Text;
  };

  public type PaymentMethod = {
    #cashOnDelivery;
    #cardOnDelivery;
  };

  public type PreOrderStatus = {
    #pending;
    #confirmed;
    #cancelled;
    #completed;
  };

  public type PreOrder = {
    id : Nat;
    customerName : Text;
    contactInfo : Text;
    items : [Nat];
    status : PreOrderStatus;
    createdAt : Time.Time;
    orderType : {
      #pickup : { pickupTime : ?Text };
      #delivery : {
        address : DeliveryAddress;
        timeSlot : DeliveryTimeSlot;
        paymentMethod : PaymentMethod;
        specialInstructions : ?Text;
      };
    };
  };

  public type ReviewStatus = {
    #pending;
    #approved;
    #rejected;
  };

  public type Review = {
    id : Nat;
    reviewerName : Text;
    rating : Nat;
    comment : Text;
    status : ReviewStatus;
    createdAt : Time.Time;
  };

  public type UserProfile = {
    name : Text;
  };

  public type ContactInfo = {
    email : Text;
    phoneNumbers : [Text];
  };

  public type LocationInfo = {
    location : Text;
    openingHours : Text;
  };

  public type GalleryImage = {
    id : Nat;
    title : Text;
    description : Text;
    imagePath : Text;
    createdAt : Time.Time;
    isCategoryImage : Bool;
    category : ?MenuCategory;
  };

  public type SitePublicationStatus = {
    isLive : Bool;
    publicUrl : Text;
    lastPublishedAt : ?Time.Time;
  };

  public shared ({ caller }) func setDomainValidationContent(content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Neautorizat: Doar administratorii pot seta conținutul de validare a domeniului");
    };
    domainValidationContent := content;
  };

  public query func getDomainValidationContent() : async Text {
    domainValidationContent;
  };

  public shared ({ caller }) func publishSite() : async SitePublicationStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Neautorizat: Doar administratorii pot publica site-ul");
    };

    sitePublicationStatus := {
      isLive = true;
      publicUrl = "https://bob-land.icp0.io";
      lastPublishedAt = ?Time.now();
    };

    sitePublicationStatus;
  };

  public query func getSitePublicationStatus() : async SitePublicationStatus {
    sitePublicationStatus;
  };

  public shared ({ caller }) func addMenuItem(menuItem : MenuItem) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Neautorizat: Doar administratorii pot adăuga produse în meniu");
    };

    let newMenuItem : MenuItem = {
      id = nextMenuItemId;
      name = menuItem.name;
      description = menuItem.description;
      price = menuItem.price;
      imagePath = menuItem.imagePath;
      category = menuItem.category;
      createdAt = Time.now();
    };

    menuItems := natMap.put(menuItems, nextMenuItemId, newMenuItem);
    nextMenuItemId += 1;
    newMenuItem.id;
  };

  public shared ({ caller }) func updateMenuItem(id : Nat, menuItem : MenuItem) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Neautorizat: Doar administratorii pot actualiza produsele din meniu");
    };

    switch (natMap.get(menuItems, id)) {
      case (null) { Debug.trap("Produsul din meniu nu a fost găsit") };
      case (?existingMenuItem) {
        let updatedMenuItem : MenuItem = {
          id = existingMenuItem.id;
          name = menuItem.name;
          description = menuItem.description;
          price = menuItem.price;
          imagePath = menuItem.imagePath;
          category = menuItem.category;
          createdAt = existingMenuItem.createdAt;
        };
        menuItems := natMap.put(menuItems, id, updatedMenuItem);
      };
    };
  };

  public shared ({ caller }) func removeMenuItem(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Neautorizat: Doar administratorii pot elimina produsele din meniu");
    };

    menuItems := natMap.delete(menuItems, id);
  };

  public query func getMenuItems() : async [MenuItem] {
    Iter.toArray(natMap.vals(menuItems));
  };

  public query func getMenuItemsByCategory(category : MenuCategory) : async [MenuItem] {
    Iter.toArray(
      Iter.filter(
        natMap.vals(menuItems),
        func(menuItem : MenuItem) : Bool {
          menuItem.category == category;
        },
      )
    );
  };

  public shared func placePickupOrder(preOrder : PreOrder) : async Nat {
    let pickupOrder : PreOrder = {
      id = nextPreOrderId;
      customerName = preOrder.customerName;
      contactInfo = preOrder.contactInfo;
      items = preOrder.items;
      status = #pending;
      createdAt = Time.now();
      orderType = #pickup { pickupTime = ?"" };
    };

    preOrders := natMap.put(preOrders, nextPreOrderId, pickupOrder);
    nextPreOrderId += 1;
    pickupOrder.id;
  };

  public shared func placeDeliveryOrder(deliveryOrder : PreOrder) : async Nat {
    let newOrder : PreOrder = {
      id = nextPreOrderId;
      customerName = deliveryOrder.customerName;
      contactInfo = deliveryOrder.contactInfo;
      items = deliveryOrder.items;
      status = #pending;
      createdAt = Time.now();
      orderType = deliveryOrder.orderType;
    };

    preOrders := natMap.put(preOrders, nextPreOrderId, newOrder);
    nextPreOrderId += 1;
    newOrder.id;
  };

  public query ({ caller }) func getPreOrder(id : Nat) : async ?PreOrder {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Neautorizat: Doar administratorii pot vizualiza precomenzile");
    };
    natMap.get(preOrders, id);
  };

  public query ({ caller }) func getPreOrders() : async [PreOrder] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Neautorizat: Doar administratorii pot vizualiza lista de precomenzi");
    };
    Iter.toArray(natMap.vals(preOrders));
  };

  public shared ({ caller }) func updatePreOrderStatus(id : Nat, status : PreOrderStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Neautorizat: Doar administratorii pot actualiza statusul precomenzilor");
    };

    switch (natMap.get(preOrders, id)) {
      case (null) { Debug.trap("Precomanda nu a fost găsită") };
      case (?preOrder) {
        let updatedPreOrder : PreOrder = {
          id = preOrder.id;
          customerName = preOrder.customerName;
          contactInfo = preOrder.contactInfo;
          items = preOrder.items;
          status;
          createdAt = preOrder.createdAt;
          orderType = preOrder.orderType;
        };
        preOrders := natMap.put(preOrders, id, updatedPreOrder);
      };
    };
  };

  public shared func submitReview(review : Review) : async Nat {
    let newReview : Review = {
      id = nextReviewId;
      reviewerName = review.reviewerName;
      rating = review.rating;
      comment = review.comment;
      status = #pending;
      createdAt = Time.now();
    };

    reviews := natMap.put(reviews, nextReviewId, newReview);
    nextReviewId += 1;
    newReview.id;
  };

  public query ({ caller }) func getReviews() : async [Review] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Neautorizat: Doar administratorii pot vizualiza toate recenziile");
    };
    Iter.toArray(natMap.vals(reviews));
  };

  public query func getApprovedReviews() : async [Review] {
    Iter.toArray(
      Iter.filter(
        natMap.vals(reviews),
        func(review : Review) : Bool {
          review.status == #approved;
        },
      )
    );
  };

  public shared ({ caller }) func moderateReview(id : Nat, status : ReviewStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Neautorizat: Doar administratorii pot modera recenziile");
    };

    switch (natMap.get(reviews, id)) {
      case (null) { Debug.trap("Recenzia nu a fost găsită") };
      case (?review) {
        let updatedReview : Review = {
          id = review.id;
          reviewerName = review.reviewerName;
          rating = review.rating;
          comment = review.comment;
          status;
          createdAt = review.createdAt;
        };
        reviews := natMap.put(reviews, id, updatedReview);
      };
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Neautorizat: Doar utilizatorii pot accesa profiluri");
    };
    principalMap.get(userProfiles, caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Neautorizat: Doar utilizatorii pot salva profiluri");
    };
    userProfiles := principalMap.put(userProfiles, caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Neautorizat: Poți vizualiza doar propriul profil");
    };
    principalMap.get(userProfiles, user);
  };

  public shared ({ caller }) func addDefaultClatiteWafflesMenuItems() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Neautorizat: Doar administratorii pot adăuga produse implicite în meniu");
    };

    let defaultItems : [MenuItem] = [
      {
        id = nextMenuItemId;
        name = "Clătită simplă";
        description = "Clătită tradițională, pufoasă și delicioasă";
        price = 7;
        imagePath = ?"generated/clatite-traditional.dim_400x300.jpg";
        category = #clatiteWaffles;
        createdAt = Time.now();
      },
      {
        id = nextMenuItemId + 1;
        name = "Clătită 1 sos cald irezistibil/dulceață delicioasă + 1 sos cremos catifelat";
        description = "Clătită cu sos cald sau dulceață + sos cremos catifelat";
        price = 15;
        imagePath = ?"generated/clatite-sosuri.dim_400x300.jpg";
        category = #clatiteWaffles;
        createdAt = Time.now();
      },
      {
        id = nextMenuItemId + 2;
        name = "Clătită ➡ 1 sos cald irezistibil/dulceață delicioasă + 1 sos cremos catifelat + 1 topping extra";
        description = "Clătită cu sos cald sau dulceață + sos cremos catifelat + topping extra";
        price = 18;
        imagePath = ?"generated/clatite-topping.dim_400x300.jpg";
        category = #clatiteWaffles;
        createdAt = Time.now();
      },
      {
        id = nextMenuItemId + 3;
        name = "Clătită ➡ 1 sos cald sau dulceață + 1 sos cremos catifelat + 2 toppinguri extra";
        description = "Clătită cu sos cald sau dulceață + sos cremos catifelat + 2 toppinguri extra";
        price = 21;
        imagePath = ?"generated/clatite-toppinguri.dim_400x300.jpg";
        category = #clatiteWaffles;
        createdAt = Time.now();
      },
      {
        id = nextMenuItemId + 4;
        name = "MAKE YOUR OWN - ADAUGĂ ORICÂTE TOPPINGURI DOREȘTI";
        description = "Personalizează-ți clătita cu toppinguri la alegere (+9 lei per topping)";
        price = 9;
        imagePath = ?"generated/clatite-custom.dim_400x300.jpg";
        category = #clatiteWaffles;
        createdAt = Time.now();
      },
    ];

    var currentId = nextMenuItemId;
    for (item in defaultItems.vals()) {
      menuItems := natMap.put(menuItems, currentId, item);
      currentId += 1;
    };
    nextMenuItemId += defaultItems.size();
  };

  public query func getContactInfo() : async ContactInfo {
    contactInfo;
  };

  public shared ({ caller }) func updateContactInfo(newContactInfo : ContactInfo) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Neautorizat: Doar administratorii pot actualiza informațiile de contact");
    };
    contactInfo := newContactInfo;
  };

  public query func getLocationInfo() : async LocationInfo {
    locationInfo;
  };

  public shared ({ caller }) func updateLocationInfo(newLocationInfo : LocationInfo) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Neautorizat: Doar administratorii pot actualiza informațiile despre locație");
    };
    locationInfo := newLocationInfo;
  };

  public shared ({ caller }) func addGalleryImage(galleryImage : GalleryImage) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Neautorizat: Doar administratorii pot adăuga imagini în galerie");
    };

    let newGalleryImage : GalleryImage = {
      id = nextGalleryImageId;
      title = galleryImage.title;
      description = galleryImage.description;
      imagePath = galleryImage.imagePath;
      createdAt = Time.now();
      isCategoryImage = galleryImage.isCategoryImage;
      category = galleryImage.category;
    };

    galleryImages := natMap.put(galleryImages, nextGalleryImageId, newGalleryImage);
    nextGalleryImageId += 1;
    newGalleryImage.id;
  };

  public shared ({ caller }) func updateGalleryImage(id : Nat, galleryImage : GalleryImage) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Neautorizat: Doar administratorii pot actualiza imaginile din galerie");
    };

    switch (natMap.get(galleryImages, id)) {
      case (null) { Debug.trap("Imaginea din galerie nu a fost găsită") };
      case (?existingGalleryImage) {
        let updatedGalleryImage : GalleryImage = {
          id = existingGalleryImage.id;
          title = galleryImage.title;
          description = galleryImage.description;
          imagePath = galleryImage.imagePath;
          createdAt = existingGalleryImage.createdAt;
          isCategoryImage = galleryImage.isCategoryImage;
          category = galleryImage.category;
        };
        galleryImages := natMap.put(galleryImages, id, updatedGalleryImage);
      };
    };
  };

  public shared ({ caller }) func removeGalleryImage(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Neautorizat: Doar administratorii pot elimina imaginile din galerie");
    };

    galleryImages := natMap.delete(galleryImages, id);
  };

  public query func getGalleryImages() : async [GalleryImage] {
    Iter.toArray(natMap.vals(galleryImages));
  };

  public query func getCategoryGalleryImages() : async [GalleryImage] {
    Iter.toArray(
      Iter.filter(
        natMap.vals(galleryImages),
        func(galleryImage : GalleryImage) : Bool {
          galleryImage.isCategoryImage;
        },
      )
    );
  };

  public query func getGalleryImagesByCategory(category : MenuCategory) : async [GalleryImage] {
    Iter.toArray(
      Iter.filter(
        natMap.vals(galleryImages),
        func(galleryImage : GalleryImage) : Bool {
          switch (galleryImage.category) {
            case (null) { false };
            case (?cat) { cat == category };
          };
        },
      )
    );
  };

  public shared ({ caller }) func addDefaultCategoryGalleryImages() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Neautorizat: Doar administratorii pot adăuga imagini implicite de categorie");
    };

    let defaultCategoryImages : [GalleryImage] = [
      {
        id = nextGalleryImageId;
        title = "Înghețată artizanală italiană";
        description = "Imagine vintage STL pentru Înghețată artizanală italiană";
        imagePath = "generated/inghetata-vintage.stl.jpg";
        createdAt = Time.now();
        isCategoryImage = true;
        category = ?#inghetataArtizanalaItaliana;
      },
      {
        id = nextGalleryImageId + 1;
        title = "Clătite & Waffles";
        description = "Imagine vintage STL pentru Clătite & Waffles";
        imagePath = "generated/clatite-vintage.stl.jpg";
        createdAt = Time.now();
        isCategoryImage = true;
        category = ?#clatiteWaffles;
      },
      {
        id = nextGalleryImageId + 2;
        title = "Waffle Stick & Waffle Bombs";
        description = "Imagine vintage STL pentru Waffle Stick & Waffle Bombs";
        imagePath = "generated/waffle-vintage.stl.jpg";
        createdAt = Time.now();
        isCategoryImage = true;
        category = ?#waffleStickBombs;
      },
      {
        id = nextGalleryImageId + 3;
        title = "BOB´s Magic";
        description = "Imagine vintage STL pentru BOB´s Magic";
        imagePath = "generated/bobs-magic-vintage.stl.jpg";
        createdAt = Time.now();
        isCategoryImage = true;
        category = ?#bobsMagic;
      },
      {
        id = nextGalleryImageId + 4;
        title = "Snacks";
        description = "Imagine vintage STL pentru Snacks";
        imagePath = "generated/snacks-vintage.stl.jpg";
        createdAt = Time.now();
        isCategoryImage = true;
        category = ?#snacks;
      },
      {
        id = nextGalleryImageId + 5;
        title = "Focaccia & Specialități";
        description = "Imagine vintage STL pentru Focaccia & Specialități";
        imagePath = "generated/focaccia-vintage.stl.jpg";
        createdAt = Time.now();
        isCategoryImage = true;
        category = ?#focacciaSpecialitati;
      },
      {
        id = nextGalleryImageId + 6;
        title = "Patiserie";
        description = "Imagine vintage STL pentru Patiserie";
        imagePath = "generated/patiserie-vintage.stl.jpg";
        createdAt = Time.now();
        isCategoryImage = true;
        category = ?#patiserie;
      },
      {
        id = nextGalleryImageId + 7;
        title = "Coffee & More";
        description = "Imagine vintage STL pentru Coffee & More";
        imagePath = "generated/coffee-vintage.stl.jpg";
        createdAt = Time.now();
        isCategoryImage = true;
        category = ?#coffeeMore;
      },
    ];

    var currentId = nextGalleryImageId;
    for (image in defaultCategoryImages.vals()) {
      galleryImages := natMap.put(galleryImages, currentId, image);
      currentId += 1;
    };
    nextGalleryImageId += defaultCategoryImages.size();
  };

  public query func getICPDomainAndValidationToken() : async {
    icpDomain : Text;
    validationToken : Text;
  } {
    let icpDomain = "https://bob-land.icp0.io";
    let validationToken = "bkyz2-fmaaa-aaaaa-qaaaq-cai";
    {
      icpDomain;
      validationToken;
    };
  };

  include BlobStorage(registry);
};
