import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type MenuCategory = {
    #breakfast;
    #lunch;
    #dinner;
    #beverages;
    #specials;
  };

  type MenuItem = {
    name : Text;
    description : Text;
    price : Nat;
    category : MenuCategory;
    vegetarian : Bool;
  };

  module MenuItem {
    public func compareByCategory(item1 : MenuItem, item2 : MenuItem) : Order.Order {
      switch (compareMenuCategory(item1.category, item2.category)) {
        case (#equal) { Text.compare(item1.name, item2.name) };
        case (order) { order };
      };
    };
  };

  func compareMenuCategory(cat1 : MenuCategory, cat2 : MenuCategory) : Order.Order {
    switch (cat1, cat2) {
      case (#breakfast, #breakfast) { #equal };
      case (#breakfast, _) { #less };
      case (#lunch, #breakfast) { #greater };
      case (#lunch, #lunch) { #equal };
      case (#lunch, _) { #less };
      case (#dinner, #dinner) { #equal };
      case (#dinner, #breakfast) { #greater };
      case (#dinner, #lunch) { #greater };
      case (#dinner, _) { #less };
      case (#beverages, #specials) { #less };
      case (#beverages, #beverages) { #equal };
      case (#beverages, _) { #greater };
      case (#specials, #specials) { #equal };
      case (#specials, _) { #greater };
    };
  };

  type RestaurantInfo = {
    name : Text;
    address : Text;
    phone : Text;
    whatsapp : Text;
    openingHours : Text;
  };

  type GalleryImage = {
    title : Text;
    caption : Text;
  };

  type OrderItem = {
    itemName : Text;
    quantity : Nat;
    priceEach : Nat;
  };

  type CustomerOrder = {
    orderId : Nat;
    items : [OrderItem];
    totalAmount : Nat;
    timestamp : Time.Time;
  };

  let restaurantInfo : RestaurantInfo = {
    name = "Arogya Ruchulu";
    address = "123 South Avenue, Hyderabad, Telangana, India";
    phone = "+91 98765 43210";
    whatsapp = "+91 91234 56789";
    openingHours = "Mon-Sun: 7am - 10pm";
  };

  let menuItems : [MenuItem] = [
    {
      name = "Idli Sambhar";
      description = "Steamed rice cakes served with lentil soup and chutneys";
      price = 80;
      category = #breakfast;
      vegetarian = true;
    },
    {
      name = "Dosa";
      description = "Crispy rice crepe with potato filling, served with chutneys";
      price = 120;
      category = #breakfast;
      vegetarian = true;
    },
    {
      name = "Ragi Mudde";
      description = "Finger millet balls served with sambar";
      price = 100;
      category = #lunch;
      vegetarian = true;
    },
    {
      name = "Pesarattu";
      description = "Green gram pancake with onions and ginger";
      price = 90;
      category = #breakfast;
      vegetarian = true;
    },
    {
      name = "Curry Leaf Rice";
      description = "Rice flavored with fresh curry leaves and spices";
      price = 110;
      category = #lunch;
      vegetarian = true;
    },
    {
      name = "Vegetable Biryani";
      description = "Aromatic rice with mixed veggies and south Indian spices";
      price = 150;
      category = #dinner;
      vegetarian = true;
    },
    {
      name = "Buttermilk";
      description = "Refreshing spiced yogurt drink";
      price = 40;
      category = #beverages;
      vegetarian = true;
    },
    {
      name = "Ragi Dosa";
      description = "Healthy millet-based dosa";
      price = 130;
      category = #specials;
      vegetarian = true;
    },
    {
      name = "South Indian Thali";
      description = "Complete platter with rice, sambar, vegetables, and more";
      price = 180;
      category = #lunch;
      vegetarian = true;
    },
  ];

  let galleryImages : [GalleryImage] = [
    { title = "Colorful Dosa Platter"; caption = "Variety of dosas served with dips" },
    { title = "Traditional Thali"; caption = "Includes rice, sambar, veggies, and desserts" },
    { title = "Fresh Idli Counter"; caption = "Steamed idlis ready to be served" },
    { title = "Ragi Mudde Showcase"; caption = "Healthy finger millet balls" },
  ];

  // New Order Management
  let orders = Map.empty<Nat, CustomerOrder>();
  var orderCounter = 0;

  // Prefab user mgmt state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public query ({ caller }) func getRestaurantInfo() : async RestaurantInfo {
    restaurantInfo;
  };

  public query ({ caller }) func getMenuItems() : async [MenuItem] {
    menuItems;
  };

  public query ({ caller }) func getMenuItemsByCategory(category : MenuCategory) : async [MenuItem] {
    menuItems.filter(
      func(item) {
        item.category == category;
      }
    );
  };

  public query ({ caller }) func getVegMenuItems() : async [MenuItem] {
    menuItems.filter(
      func(item) {
        item.vegetarian;
      }
    );
  };

  public query ({ caller }) func getSortedMenuByCategory() : async [MenuItem] {
    menuItems.sort(MenuItem.compareByCategory);
  };

  public query ({ caller }) func getGalleryImages() : async [GalleryImage] {
    galleryImages;
  };

  public shared ({ caller }) func placeOrder(items : [OrderItem], totalAmount : Nat) : async Nat {
    let orderId = orderCounter + 1;
    orderCounter += 1;

    let newOrder : CustomerOrder = {
      orderId;
      items;
      totalAmount;
      timestamp = Time.now();
    };

    orders.add(orderId, newOrder);
    orderId;
  };

  public query ({ caller }) func getAdminOrders() : async [CustomerOrder] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view orders");
    };
    orders.values().toArray();
  };

  public query ({ caller }) func getAdminOrderCount() : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view order count");
    };
    orders.size();
  };
};
