import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Link,
  Outlet,
  RouterProvider,
  createBrowserHistory,
  createRootRoute,
  createRoute,
  createRouter,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import {
  Clock,
  ExternalLink,
  Loader2,
  MapPin,
  Menu,
  Minus,
  Phone,
  Plus,
  ShoppingCart,
  Trash2,
  X,
} from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { SiWhatsapp } from "react-icons/si";
import type { CustomerOrder, OrderItem } from "./backend.d";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import {
  useAdminOrders,
  useIsAdmin,
  useRestaurantInfo,
} from "./hooks/useQueries";

const queryClient = new QueryClient();

// ─── Types ────────────────────────────────────────────────────────────────────
interface LocalMenuItem {
  name: string;
  price?: number;
  vegetarian: boolean;
  category: string;
  comingSoon?: boolean;
  seasonal?: boolean;
  priceNote?: string;
}

interface CartItem {
  name: string;
  price: number;
  priceNote?: string;
  quantity: number;
}

// ─── Cart Context ─────────────────────────────────────────────────────────────
interface CartContextType {
  cartItems: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (name: string) => void;
  updateQty: (name: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  addItem: () => {},
  removeItem: () => {},
  updateQty: () => {},
  clearCart: () => {},
  totalItems: 0,
  totalPrice: 0,
  cartOpen: false,
  setCartOpen: () => {},
});

function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const addItem = useCallback((item: Omit<CartItem, "quantity">) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.name === item.name);
      if (existing) {
        return prev.map((i) =>
          i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((name: string) => {
    setCartItems((prev) => prev.filter((i) => i.name !== name));
  }, []);

  const updateQty = useCallback((name: string, qty: number) => {
    if (qty <= 0) {
      setCartItems((prev) => prev.filter((i) => i.name !== name));
    } else {
      setCartItems((prev) =>
        prev.map((i) => (i.name === name ? { ...i, quantity: qty } : i)),
      );
    }
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const totalItems = useMemo(
    () => cartItems.reduce((sum, i) => sum + i.quantity, 0),
    [cartItems],
  );
  const totalPrice = useMemo(
    () => cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [cartItems],
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        totalItems,
        totalPrice,
        cartOpen,
        setCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

function useCart() {
  return useContext(CartContext);
}

// ─── App Context ──────────────────────────────────────────────────────────────
const AppContext = createContext({ whatsapp: "918341277227" });
function useApp() {
  return useContext(AppContext);
}

// ─── Menu Data ────────────────────────────────────────────────────────────────
const MENU_CATEGORIES = [
  { label: "Biryani", value: "biryani" },
  { label: "Fried Rice", value: "fried-rice" },
  { label: "Noodles", value: "noodles" },
  { label: "Curries", value: "curries" },
  { label: "Starters (Non-Veg)", value: "starters" },
  { label: "Starters (Veg)", value: "veg-starters" },
  { label: "Rolls", value: "rolls" },
  { label: "Soups", value: "soups" },
  { label: "Tiffens", value: "tiffens" },
];

const MENU_ITEMS: LocalMenuItem[] = [
  // BIRYANI - Non-Veg
  { name: "Dum Biryani", price: 150, vegetarian: false, category: "biryani" },
  { name: "Fry Biryani", price: 180, vegetarian: false, category: "biryani" },
  {
    name: "Haryana Biryani",
    price: 250,
    vegetarian: false,
    category: "biryani",
  },
  {
    name: "Mughlai Biryani",
    vegetarian: false,
    category: "biryani",
    priceNote: "₹250 / ₹300",
  },
  {
    name: "Lollipop Biryani",
    price: 250,
    vegetarian: false,
    category: "biryani",
  },
  { name: "Wings Biryani", price: 250, vegetarian: false, category: "biryani" },
  { name: "Joint Biryani", price: 250, vegetarian: false, category: "biryani" },
  {
    name: "Chicken 65 Biryani",
    price: 250,
    vegetarian: false,
    category: "biryani",
  },
  { name: "Mixed Biryani", price: 250, vegetarian: false, category: "biryani" },
  { name: "Fish Biryani", price: 250, vegetarian: false, category: "biryani" },
  {
    name: "Kheema Biryani",
    price: 250,
    vegetarian: false,
    category: "biryani",
  },
  { name: "Prawn Biryani", price: 250, vegetarian: false, category: "biryani" },
  { name: "SP Biryani", price: 250, vegetarian: false, category: "biryani" },
  {
    name: "Boneless Biryani",
    price: 200,
    vegetarian: false,
    category: "biryani",
  },
  {
    name: "Dilkush Biryani",
    price: 250,
    vegetarian: false,
    category: "biryani",
  },
  // BIRYANI - Veg
  { name: "Veg Biryani", price: 100, vegetarian: true, category: "biryani" },
  {
    name: "Mushroom Biryani",
    price: 180,
    vegetarian: true,
    category: "biryani",
  },
  { name: "Paneer Biryani", price: 180, vegetarian: true, category: "biryani" },
  {
    name: "Baby Corn Biryani",
    price: 200,
    vegetarian: true,
    category: "biryani",
  },
  {
    name: "Mixed Veg Biryani",
    price: 180,
    vegetarian: true,
    category: "biryani",
  },
  { name: "Kaju Biryani", price: 250, vegetarian: true, category: "biryani" },
  {
    name: "Kaju Paneer Biryani",
    price: 250,
    vegetarian: true,
    category: "biryani",
  },
  {
    name: "Kaju Mushroom Biryani",
    price: 250,
    vegetarian: true,
    category: "biryani",
  },
  // FRIED RICE - Non-Veg
  {
    name: "Chicken Fried Rice",
    price: 100,
    vegetarian: false,
    category: "fried-rice",
  },
  {
    name: "Prawn Fried Rice",
    price: 200,
    vegetarian: false,
    category: "fried-rice",
  },
  {
    name: "Kaju Chicken Fried Rice",
    price: 200,
    vegetarian: false,
    category: "fried-rice",
  },
  {
    name: "Chicken Manchurian Fried Rice",
    price: 180,
    vegetarian: false,
    category: "fried-rice",
  },
  {
    name: "Special Chicken Fried Rice",
    price: 250,
    vegetarian: false,
    category: "fried-rice",
  },
  {
    name: "Egg Fried Rice",
    price: 80,
    vegetarian: false,
    category: "fried-rice",
  },
  {
    name: "Special Fried Rice With Bone",
    price: 200,
    vegetarian: false,
    category: "fried-rice",
  },
  {
    name: "Mixed Non-Veg Fried Rice",
    price: 200,
    vegetarian: false,
    category: "fried-rice",
  },
  {
    name: "Fish Fried Rice",
    price: 200,
    vegetarian: false,
    category: "fried-rice",
  },
  // FRIED RICE - Veg
  {
    name: "Veg Fried Rice",
    price: 100,
    vegetarian: true,
    category: "fried-rice",
  },
  {
    name: "Paneer Fried Rice",
    price: 150,
    vegetarian: true,
    category: "fried-rice",
  },
  {
    name: "Mushroom Fried Rice",
    price: 150,
    vegetarian: true,
    category: "fried-rice",
  },
  {
    name: "Kaju Mushroom Fried Rice",
    price: 200,
    vegetarian: true,
    category: "fried-rice",
  },
  {
    name: "Paneer Kaju Fried Rice",
    price: 200,
    vegetarian: true,
    category: "fried-rice",
  },
  {
    name: "Manchurian Fried Rice",
    price: 200,
    vegetarian: true,
    category: "fried-rice",
  },
  {
    name: "Sweet Corn Fried Rice",
    price: 200,
    vegetarian: true,
    category: "fried-rice",
  },
  {
    name: "SP Paneer Fried Rice",
    price: 250,
    vegetarian: true,
    category: "fried-rice",
  },
  {
    name: "SP Mushroom Fried Rice",
    price: 250,
    vegetarian: true,
    category: "fried-rice",
  },
  {
    name: "SP Kaju Tomato Fried Rice",
    price: 250,
    vegetarian: true,
    category: "fried-rice",
  },
  // NOODLES
  { name: "Egg Noodles", price: 50, vegetarian: false, category: "noodles" },
  {
    name: "Double Egg Noodles",
    price: 60,
    vegetarian: false,
    category: "noodles",
  },
  {
    name: "Chicken Noodles",
    price: 80,
    vegetarian: false,
    category: "noodles",
  },
  {
    name: "Mixed Non-Veg Noodles",
    price: 150,
    vegetarian: false,
    category: "noodles",
  },
  { name: "Veg Noodles", price: 60, vegetarian: true, category: "noodles" },
  {
    name: "Veg Manchurian Noodles",
    price: 150,
    vegetarian: true,
    category: "noodles",
  },
  {
    name: "Paneer Manchurian Noodles",
    price: 150,
    vegetarian: true,
    category: "noodles",
  },
  {
    name: "Mushroom Manchurian Noodles",
    price: 160,
    vegetarian: true,
    category: "noodles",
  },
  // CURRIES
  { name: "Chicken Curry", price: 150, vegetarian: false, category: "curries" },
  {
    name: "Chicken Fry Curry",
    price: 200,
    vegetarian: false,
    category: "curries",
  },
  { name: "Prawns Curry", price: 250, vegetarian: false, category: "curries" },
  { name: "Apollo Fish", price: 250, vegetarian: false, category: "curries" },
  { name: "Mushroom Curry", price: 150, vegetarian: true, category: "curries" },
  {
    name: "Kaju Tomato Curry",
    price: 200,
    vegetarian: true,
    category: "curries",
  },
  {
    name: "Mushroom Kaju Curry",
    price: 200,
    vegetarian: true,
    category: "curries",
  },
  {
    name: "Kaju Paneer Curry",
    price: 200,
    vegetarian: true,
    category: "curries",
  },
  {
    name: "Kadai Paneer Curry",
    price: 200,
    vegetarian: true,
    category: "curries",
  },
  { name: "Paneer Curry", price: 150, vegetarian: true, category: "curries" },
  // STARTERS (Non-Veg)
  { name: "Chicken 555", price: 250, vegetarian: false, category: "starters" },
  {
    name: "Chicken Manchurian",
    price: 150,
    vegetarian: false,
    category: "starters",
  },
  {
    name: "Chicken Joints",
    price: 120,
    vegetarian: false,
    category: "starters",
  },
  {
    name: "Chilli Chicken",
    price: 150,
    vegetarian: false,
    category: "starters",
  },
  {
    name: "Chicken Pakodi",
    vegetarian: false,
    category: "starters",
    priceNote: "Half ₹100 / Full ₹150",
  },
  {
    name: "Kaju Chicken Pakodi",
    price: 200,
    vegetarian: false,
    category: "starters",
  },
  { name: "Chicken 65", price: 150, vegetarian: false, category: "starters" },
  {
    name: "Chicken Majestic",
    price: 250,
    vegetarian: false,
    category: "starters",
  },
  {
    name: "Chicken Lollipop",
    price: 200,
    vegetarian: false,
    category: "starters",
  },
  {
    name: "Chicken Wings",
    price: 200,
    vegetarian: false,
    category: "starters",
  },
  {
    name: "Crispy Chicken",
    price: 200,
    vegetarian: false,
    category: "starters",
  },
  {
    name: "Thailand Chicken",
    price: 300,
    vegetarian: false,
    category: "starters",
  },
  {
    name: "Singapore Chicken",
    price: 300,
    vegetarian: false,
    category: "starters",
  },
  {
    name: "Chicken Grill Stick",
    vegetarian: false,
    category: "starters",
    comingSoon: true,
  },
  {
    name: "Chicken Egg Kulfi",
    vegetarian: false,
    category: "starters",
    comingSoon: true,
  },
  {
    name: "Egg Kulfi",
    vegetarian: false,
    category: "starters",
    seasonal: true,
  },
  {
    name: "Double Egg Kulfi",
    vegetarian: false,
    category: "starters",
    seasonal: true,
  },
  // VEG STARTERS
  {
    name: "Veg Manchurian",
    price: 70,
    vegetarian: true,
    category: "veg-starters",
  },
  {
    name: "Paneer Balls",
    price: 200,
    vegetarian: true,
    category: "veg-starters",
  },
  {
    name: "Paneer Majestic",
    price: 250,
    vegetarian: true,
    category: "veg-starters",
  },
  {
    name: "Mushroom Manchurian",
    price: 250,
    vegetarian: true,
    category: "veg-starters",
  },
  {
    name: "Chilli Paneer",
    price: 200,
    vegetarian: true,
    category: "veg-starters",
  },
  {
    name: "Chilli Mushroom",
    price: 200,
    vegetarian: true,
    category: "veg-starters",
  },
  {
    name: "Mushroom 65",
    price: 250,
    vegetarian: true,
    category: "veg-starters",
  },
  { name: "Paneer 65", price: 250, vegetarian: true, category: "veg-starters" },
  {
    name: "Crispy Corn",
    price: 120,
    vegetarian: true,
    category: "veg-starters",
  },
  {
    name: "Paneer Manchurian",
    price: 150,
    vegetarian: true,
    category: "veg-starters",
  },
  {
    name: "Paneer Grill",
    vegetarian: true,
    category: "veg-starters",
    comingSoon: true,
  },
  {
    name: "Mushroom Grill",
    vegetarian: true,
    category: "veg-starters",
    comingSoon: true,
  },
  // ROLLS
  { name: "Egg Roll", price: 30, vegetarian: false, category: "rolls" },
  { name: "Veg Roll", price: 30, vegetarian: true, category: "rolls" },
  {
    name: "Special Chicken Roll",
    price: 80,
    vegetarian: false,
    category: "rolls",
  },
  // SOUPS
  { name: "Chicken Soup", price: 50, vegetarian: false, category: "soups" },
  { name: "Egg Soup", price: 30, vegetarian: false, category: "soups" },
  { name: "Hot & Sour Soup", price: 40, vegetarian: false, category: "soups" },
  { name: "Veg Soup", price: 30, vegetarian: true, category: "soups" },
  { name: "Sweet Corn Soup", price: 40, vegetarian: true, category: "soups" },
  // TIFFENS
  { name: "Pulka", price: 30, vegetarian: true, category: "tiffens" },
];

const GALLERY_IMAGES = [
  {
    src: "/assets/uploads/hero-1.jpg",
    title: "Biryani Feast",
    caption: "Rich, aromatic & unforgettable",
  },
  {
    src: "/assets/generated/dish-thali.dim_800x600.jpg",
    title: "Full Thali",
    caption: "A complete traditional meal",
  },
  {
    src: "/assets/generated/dish-upma.dim_800x600.jpg",
    title: "Upma",
    caption: "Comfort in every bite",
  },
  {
    src: "/assets/generated/dish-pongal.dim_800x600.jpg",
    title: "Ven Pongal",
    caption: "Creamy, peppery indulgence",
  },
  {
    src: "/assets/generated/gallery-interior.dim_800x600.jpg",
    title: "Our Space",
    caption: "Warm & welcoming",
  },
  {
    src: "/assets/generated/gallery-spices.dim_800x600.jpg",
    title: "Our Spices",
    caption: "Pure, natural, aromatic",
  },
  {
    src: "/assets/generated/hero-food.dim_1600x900.jpg",
    title: "The Spread",
    caption: "Tradition on every table",
  },
  {
    src: "/assets/generated/dish-thali.dim_800x600.jpg",
    title: "Chef's Special",
    caption: "Made with love daily",
  },
];

// ─── Shared Components ────────────────────────────────────────────────────────
function VegDot({ vegetarian }: { vegetarian: boolean }) {
  return (
    <span
      title={vegetarian ? "Vegetarian" : "Non-Vegetarian"}
      style={{
        display: "inline-block",
        width: 10,
        height: 10,
        borderRadius: "50%",
        flexShrink: 0,
        background: vegetarian ? "oklch(0.52 0.18 145)" : "oklch(0.55 0.22 25)",
        border: `1.5px solid ${vegetarian ? "oklch(0.38 0.14 145)" : "oklch(0.42 0.18 25)"}`,
      }}
      aria-label={vegetarian ? "Veg" : "Non-Veg"}
    />
  );
}

function MenuCard({ item, index }: { item: LocalMenuItem; index: number }) {
  const { cartItems, addItem, updateQty } = useCart();
  const isUnavailable = item.comingSoon || item.seasonal;
  const cartItem = cartItems.find((i) => i.name === item.name);
  const inCart = !!cartItem;

  function handleAdd() {
    addItem({
      name: item.name,
      price: item.price ?? 0,
      priceNote: item.priceNote,
    });
  }

  return (
    <div
      data-ocid={`menu.item.${index as 1}`}
      className="menu-card bg-card rounded-xl border border-border p-5 flex flex-col gap-2"
      style={{ opacity: item.comingSoon ? 0.6 : item.seasonal ? 0.75 : 1 }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <VegDot vegetarian={item.vegetarian} />
          <h3 className="font-display text-base font-semibold text-card-foreground leading-snug">
            {item.name}
          </h3>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          {item.comingSoon && (
            <Badge
              className="text-xs px-2 py-0.5"
              style={{
                background: "oklch(0.88 0.02 55)",
                color: "oklch(0.42 0.05 45)",
              }}
            >
              Coming Soon
            </Badge>
          )}
          {item.seasonal && (
            <Badge
              className="text-xs px-2 py-0.5"
              style={{
                background: "oklch(0.88 0.12 72)",
                color: "oklch(0.38 0.1 55)",
              }}
            >
              Seasonal
            </Badge>
          )}
        </div>
      </div>
      <div className="mt-auto pt-2 flex items-center justify-between gap-2">
        {!isUnavailable && (
          <span
            className="font-display text-lg font-semibold"
            style={{ color: "oklch(0.56 0.14 42)" }}
          >
            {item.priceNote
              ? item.priceNote
              : item.price !== undefined
                ? `₹${item.price}`
                : ""}
          </span>
        )}
        {isUnavailable ? null : inCart ? (
          <div
            className="flex items-center gap-1 rounded-full overflow-hidden border"
            style={{ borderColor: "oklch(0.56 0.14 42)" }}
          >
            <button
              type="button"
              data-ocid={`menu.item.${index as 1}`}
              onClick={() =>
                updateQty(item.name, (cartItem?.quantity ?? 1) - 1)
              }
              className="w-7 h-7 flex items-center justify-center hover:opacity-70 transition-opacity"
              style={{ color: "oklch(0.56 0.14 42)" }}
              aria-label="Decrease quantity"
            >
              <Minus size={12} />
            </button>
            <span
              className="font-body text-sm font-semibold min-w-[20px] text-center"
              style={{ color: "oklch(0.35 0.08 42)" }}
            >
              {cartItem?.quantity ?? 0}
            </span>
            <button
              type="button"
              onClick={() =>
                updateQty(item.name, (cartItem?.quantity ?? 0) + 1)
              }
              className="w-7 h-7 flex items-center justify-center hover:opacity-70 transition-opacity"
              style={{ color: "oklch(0.56 0.14 42)" }}
              aria-label="Increase quantity"
            >
              <Plus size={12} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            data-ocid={`menu.item.${index as 1}`}
            onClick={handleAdd}
            className="font-body text-xs font-semibold px-3 py-1.5 rounded-full transition-all hover:scale-105"
            style={{ background: "oklch(0.56 0.14 42)", color: "white" }}
          >
            Add
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Cart Sheet ───────────────────────────────────────────────────────────────
function CartSheet() {
  const {
    cartItems,
    updateQty,
    removeItem,
    clearCart,
    totalPrice,
    cartOpen,
    setCartOpen,
  } = useCart();
  const { actor } = useActor();
  const [placing, setPlacing] = useState(false);

  async function handlePlaceOrder() {
    setPlacing(true);
    try {
      const orderItems: OrderItem[] = cartItems.map((i) => ({
        itemName: i.name,
        quantity: BigInt(i.quantity),
        priceEach: BigInt(Math.round(i.price)),
      }));
      const total = BigInt(Math.round(totalPrice));
      if (actor) {
        await actor.placeOrder(orderItems, total);
      }
      const itemLines = cartItems
        .map((i) => `• ${i.name} x${i.quantity} = ₹${i.price * i.quantity}`)
        .join("\n");
      const msg = `Hello! I'd like to order from Arogya Ruchulu:\n\n${itemLines}\n\nTotal: ₹${totalPrice}`;
      window.open(
        `https://wa.me/918341277227?text=${encodeURIComponent(msg)}`,
        "_blank",
      );
      clearCart();
      setCartOpen(false);
    } finally {
      setPlacing(false);
    }
  }

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent
        side="right"
        className="flex flex-col w-full sm:max-w-md p-0"
        data-ocid="cart.sheet"
      >
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="font-display text-xl font-bold flex items-center gap-2">
            <ShoppingCart size={20} />
            Your Order
            {cartItems.length > 0 && (
              <Badge
                className="ml-auto font-body text-xs"
                style={{ background: "oklch(0.56 0.14 42)", color: "white" }}
              >
                {cartItems.reduce((s, i) => s + i.quantity, 0)} items
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div
            data-ocid="cart.empty_state"
            className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-6"
          >
            <ShoppingCart size={48} style={{ color: "oklch(0.7 0.04 55)" }} />
            <p className="font-display text-lg font-semibold text-foreground">
              Your cart is empty
            </p>
            <p
              className="font-body text-sm"
              style={{ color: "oklch(0.52 0.04 55)" }}
            >
              Browse the menu and add items to get started.
            </p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6 py-4">
              <div className="flex flex-col gap-4">
                {cartItems.map((item, idx) => (
                  <div
                    key={item.name}
                    data-ocid={`cart.item.${(idx + 1) as 1}`}
                    className="flex items-center gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm font-semibold text-foreground truncate">
                        {item.name}
                      </p>
                      <p
                        className="font-body text-xs mt-0.5"
                        style={{ color: "oklch(0.52 0.04 55)" }}
                      >
                        ₹{item.price} each
                      </p>
                    </div>
                    <div
                      className="flex items-center gap-1 rounded-full border"
                      style={{ borderColor: "oklch(0.85 0.02 55)" }}
                    >
                      <button
                        type="button"
                        onClick={() => updateQty(item.name, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center hover:opacity-70 transition-opacity"
                        aria-label="Decrease"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="font-body text-sm font-semibold min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQty(item.name, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center hover:opacity-70 transition-opacity"
                        aria-label="Increase"
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                    <p
                      className="font-body text-sm font-semibold w-14 text-right"
                      style={{ color: "oklch(0.56 0.14 42)" }}
                    >
                      ₹{item.price * item.quantity}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeItem(item.name)}
                      data-ocid={`cart.delete_button.${(idx + 1) as 1}`}
                      className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-destructive/10 transition-colors"
                      style={{ color: "oklch(0.55 0.2 25)" }}
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="px-6 py-4 border-t">
              <Separator className="mb-4" />
              <div className="flex items-center justify-between mb-4">
                <span className="font-body text-sm font-medium text-foreground">
                  Total
                </span>
                <span
                  className="font-display text-xl font-bold"
                  style={{ color: "oklch(0.56 0.14 42)" }}
                >
                  ₹{totalPrice}
                </span>
              </div>
              <Button
                data-ocid="cart.submit_button"
                onClick={handlePlaceOrder}
                disabled={placing}
                className="w-full font-body font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
                style={{ background: "oklch(0.48 0.2 145)", color: "white" }}
              >
                {placing ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <SiWhatsapp size={16} />
                )}
                {placing ? "Placing Order..." : "Place Order on WhatsApp"}
              </Button>
              <button
                type="button"
                data-ocid="cart.delete_button"
                onClick={clearCart}
                className="w-full mt-3 font-body text-xs text-center hover:underline transition-colors"
                style={{ color: "oklch(0.55 0.04 55)" }}
              >
                Clear Cart
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

// ─── Cart Icon Button ─────────────────────────────────────────────────────────
function CartIconButton({ className = "" }: { className?: string }) {
  const { totalItems, setCartOpen } = useCart();
  return (
    <button
      type="button"
      data-ocid="cart.open_modal_button"
      onClick={() => setCartOpen(true)}
      className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all hover:scale-105 ${className}`}
      style={{ background: "oklch(0.93 0.04 42)" }}
      aria-label={`Open cart (${totalItems} items)`}
    >
      <ShoppingCart size={20} style={{ color: "oklch(0.46 0.12 42)" }} />
      {totalItems > 0 && (
        <span
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center font-body text-xs font-bold"
          style={{ background: "oklch(0.56 0.22 25)", color: "white" }}
        >
          {totalItems > 9 ? "9+" : totalItems}
        </span>
      )}
    </button>
  );
}

function FloatingCartButton() {
  const { totalItems } = useCart();
  if (totalItems === 0) return null;
  return (
    <div className="md:hidden">
      <CartIconButton className="fixed bottom-24 right-5 z-50 w-14 h-14 shadow-xl !rounded-full" />
    </div>
  );
}

function CateringBanner() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div
      className="fixed top-16 left-0 right-0 z-40 flex items-center justify-center gap-2 px-4 py-2"
      style={{
        background: "oklch(0.78 0.14 72)",
        boxShadow: "0 2px 8px oklch(0.56 0.14 42 / 0.18)",
      }}
    >
      <span
        className="font-body text-sm font-medium"
        style={{ color: "oklch(0.22 0.05 40)" }}
      >
        🍽️ <strong>Arogya Ruchulu is now catering!</strong> Contact us for bulk
        orders &amp; events.
      </span>
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="ml-2 flex-shrink-0 rounded-full p-0.5 hover:bg-black/10 transition-colors"
        aria-label="Dismiss catering banner"
        style={{ color: "oklch(0.22 0.05 40)" }}
      >
        <X size={14} />
      </button>
    </div>
  );
}

function NavBar() {
  const { whatsapp } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const navLinks = [
    { label: "Home", to: "/", ocid: "nav.home.link" },
    { label: "Menu", to: "/menu", ocid: "nav.menu.link" },
    { label: "Gallery", to: "/gallery", ocid: "nav.gallery.link" },
    { label: "About", to: "/about", ocid: "nav.about.link" },
    { label: "Contact", to: "/contact", ocid: "nav.contact.link" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: "oklch(0.98 0.01 75)",
        boxShadow:
          "0 2px 16px oklch(0.22 0.03 45 / 0.12), 0 1px 0 oklch(0.85 0.02 70)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid oklch(0.88 0.025 70)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="font-display text-xl font-bold tracking-tight"
          style={{ color: "oklch(0.35 0.09 42)" }}
        >
          Arogya Ruchulu
        </Link>
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              data-ocid={link.ocid}
              className="font-body text-sm font-medium transition-colors duration-200 hover:text-primary"
              style={{
                color:
                  currentPath === link.to
                    ? "oklch(0.56 0.14 42)"
                    : "oklch(0.35 0.05 45)",
                fontWeight: currentPath === link.to ? 600 : 500,
              }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <CartIconButton />
          <a
            href={`https://wa.me/${whatsapp}?text=Hi%2C%20I%20would%20like%20to%20order%20from%20Arogya%20Ruchulu`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200"
            style={{ background: "oklch(0.48 0.2 145)", color: "white" }}
          >
            Order Now
          </a>
        </div>
        <div className="md:hidden flex items-center gap-2">
          <CartIconButton />
          <button
            className="p-2"
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ color: "oklch(0.35 0.09 42)" }}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div
          className="md:hidden border-b px-4 py-4 flex flex-col gap-4"
          style={{
            backgroundColor: "oklch(0.98 0.01 75)",
            borderColor: "oklch(0.88 0.025 70)",
            boxShadow: "0 8px 24px oklch(0.22 0.03 45 / 0.15)",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              data-ocid={link.ocid}
              className="font-body text-sm font-medium transition-colors"
              style={{
                color:
                  currentPath === link.to
                    ? "oklch(0.56 0.14 42)"
                    : "oklch(0.28 0.05 45)",
              }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={`https://wa.me/${whatsapp}?text=Hi%2C%20I%20would%20like%20to%20order%20from%20Arogya%20Ruchulu`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-sm font-semibold px-4 py-2.5 rounded-full text-center transition-all duration-200 mt-1"
            style={{ background: "oklch(0.48 0.2 145)", color: "white" }}
          >
            Order on WhatsApp
          </a>
        </div>
      )}
    </nav>
  );
}

function WhatsAppButton() {
  const { whatsapp } = useApp();
  const { totalItems } = useCart();
  const url = `https://wa.me/${whatsapp}?text=Hi%2C%20I%20would%20like%20to%20order%20from%20Arogya%20Ruchulu`;
  // Hide WhatsApp floating button on mobile when cart has items (cart button takes its place)
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      data-ocid="whatsapp.button"
      className={`whatsapp-btn fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 ${
        totalItems > 0 ? "hidden md:flex" : "flex"
      }`}
      style={{ background: "oklch(0.48 0.2 145)" }}
      aria-label="Order on WhatsApp"
    >
      <SiWhatsapp size={26} color="white" />
    </a>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  return (
    <footer
      className="py-12 px-4"
      style={{
        background: "oklch(0.13 0.03 42)",
        color: "oklch(0.72 0.03 60)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p
              className="font-display text-xl font-bold mb-1"
              style={{ color: "white" }}
            >
              Arogya Ruchulu
            </p>
            <p className="font-body text-xs">
              The fast food - Where Every Bite tells a Story!
            </p>
          </div>
          <div className="flex items-center gap-5 flex-wrap justify-center">
            {(
              [
                ["/", "Home"],
                ["/menu", "Menu"],
                ["/gallery", "Gallery"],
                ["/about", "About"],
                ["/contact", "Contact"],
              ] as [string, string][]
            ).map(([to, label]) => (
              <Link
                key={to}
                to={to}
                className="font-body text-xs hover:text-white transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
        <div
          className="mt-8 pt-6 text-center font-body text-xs flex flex-col items-center gap-2"
          style={{ borderTop: "1px solid oklch(1 0 0 / 0.08)" }}
        >
          <span>
            © {year}. Built By ❤️{" "}
            <a
              href="https://sites.google.com/view/bhsnagendrakumar/home"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-white transition-colors"
            >
              BHS.NAGENDRA KUMAR
            </a>
            {" | "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-white transition-colors"
            >
              caffeine.ai
            </a>
          </span>
          <Link
            to="/admin"
            className="font-body text-xs opacity-40 hover:opacity-70 transition-opacity"
            data-ocid="admin.link"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}

// ─── Scroll Restoration ─────────────────────────────────────────────────────
function ScrollToTop() {
  const routerState = useRouterState();
  const path = routerState.location.pathname;
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional scroll on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [path]);
  return null;
}

function useFadeInOnScroll() {
  useEffect(() => {
    const els = document.querySelectorAll(".section-fade-in");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        }
      },
      { threshold: 0.1 },
    );
    for (const el of els) observer.observe(el);
    return () => observer.disconnect();
  }, []);
}

// ─── Pages ───────────────────────────────────────────────────────────────────
function HomePage() {
  const { whatsapp } = useApp();
  useFadeInOnScroll();
  const navigate = useNavigate();

  const previewCategories = [
    {
      label: "Biryani",
      emoji: "🍛",
      desc: "15+ varieties, non-veg & veg",
      idx: 1,
    },
    {
      label: "Starters",
      emoji: "🍗",
      desc: "Crispy, spicy, mouth-watering",
      idx: 2,
    },
    { label: "Fried Rice", emoji: "🍚", desc: "Wok-tossed perfection", idx: 3 },
    {
      label: "Curries",
      emoji: "🥘",
      desc: "Rich gravies, bold flavours",
      idx: 4,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/assets/uploads/hero-1.jpg')" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "oklch(0.15 0.04 42 / 0.72)" }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-32"
          style={{
            background:
              "linear-gradient(to bottom, transparent, oklch(0.97 0.01 75))",
          }}
        />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <p
            className="font-body text-sm uppercase tracking-[0.3em] mb-4"
            style={{ color: "oklch(0.82 0.1 75)" }}
          >
            Hyderabad's finest to Gurla
          </p>
          <h1
            className="font-display text-5xl sm:text-6xl md:text-7xl font-bold leading-tight mb-4"
            style={{ color: "white" }}
          >
            Arogya Ruchulu
          </h1>
          <p
            className="font-display text-xl sm:text-2xl italic mb-3"
            style={{ color: "oklch(0.92 0.06 75)" }}
          >
            The fast food - Where Every Bite tells a Story!
          </p>
          <p
            className="font-body text-base mb-10"
            style={{ color: "oklch(0.82 0.03 70)" }}
          >
            Nourishing your body, delighting your soul
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              data-ocid="hero.primary_button"
              type="button"
              onClick={() => navigate({ to: "/menu" })}
              className="font-body font-semibold px-8 py-3.5 rounded-full text-sm uppercase tracking-widest transition-all duration-300 hover:scale-105"
              style={{
                background: "oklch(0.56 0.14 42)",
                color: "white",
                boxShadow: "0 6px 24px oklch(0.56 0.14 42 / 0.45)",
              }}
            >
              View Our Menu
            </button>
            <a
              href={`https://wa.me/${whatsapp}?text=Hi%2C%20I%20would%20like%20to%20order%20from%20Arogya%20Ruchulu`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body font-medium px-8 py-3.5 rounded-full text-sm uppercase tracking-widest transition-all duration-300 hover:scale-105"
              style={{
                border: "1.5px solid oklch(1 0 0 / 0.5)",
                color: "white",
              }}
            >
              Order on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* What We Serve */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 section-fade-in">
            <p className="font-body text-sm uppercase tracking-[0.25em] text-primary mb-3">
              Our specialities
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
              What We Serve
            </h2>
            <div
              className="w-16 h-0.5 mx-auto"
              style={{ background: "oklch(0.56 0.14 42)" }}
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {previewCategories.map((cat) => (
              <button
                key={cat.label}
                type="button"
                data-ocid={`home.category.card.${cat.idx as 1}`}
                onClick={() => navigate({ to: "/menu" })}
                className="section-fade-in group rounded-2xl p-6 text-center border border-border hover:border-primary transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer bg-card"
              >
                <div className="text-4xl mb-3">{cat.emoji}</div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                  {cat.label}
                </h3>
                <p
                  className="font-body text-xs"
                  style={{ color: "oklch(0.52 0.04 55)" }}
                >
                  {cat.desc}
                </p>
              </button>
            ))}
          </div>
          <div className="text-center mt-10 section-fade-in">
            <Link
              to="/menu"
              data-ocid="home.menu.link"
              className="font-body font-semibold px-8 py-3.5 rounded-full text-sm uppercase tracking-widest transition-all duration-300 hover:scale-105 inline-block"
              style={{ background: "oklch(0.56 0.14 42)", color: "white" }}
            >
              View Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* About snippet */}
      <section
        className="py-16 px-4"
        style={{ background: "oklch(0.95 0.015 70)" }}
      >
        <div className="max-w-4xl mx-auto text-center section-fade-in">
          <p className="font-body text-sm uppercase tracking-[0.25em] text-primary mb-3">
            Who we are
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-6">
            Healthy Flavours, Straight from the Heart
          </h2>
          <p
            className="font-body text-base leading-relaxed mb-8"
            style={{ color: "oklch(0.42 0.04 45)" }}
          >
            Arogya Ruchulu was born from a simple conviction: that traditional
            South Indian food is one of the world's most balanced and nourishing
            cuisines. Our name means{" "}
            <em className="font-display italic">
              &quot;healthy flavours&quot;
            </em>{" "}
            in Telugu — and that's our daily promise.
          </p>
          <Link
            to="/about"
            data-ocid="home.about.link"
            className="font-body text-sm font-semibold uppercase tracking-widest transition-colors hover:opacity-80"
            style={{ color: "oklch(0.56 0.14 42)" }}
          >
            Our Story →
          </Link>
        </div>
      </section>
    </div>
  );
}

function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("biryani");
  const filtered = MENU_ITEMS.filter(
    (item) => item.category === activeCategory,
  );

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(0.97 0.01 75)" }}
    >
      {/* Category tabs - sticky below navbar */}
      <div
        className="sticky top-16 z-30 border-b overflow-x-auto"
        style={{
          backgroundColor: "oklch(0.98 0.01 75)",
          borderColor: "oklch(0.88 0.025 70)",
          boxShadow: "0 2px 8px oklch(0.22 0.03 45 / 0.06)",
        }}
      >
        <div className="flex items-center gap-1 px-4 py-2 min-w-max mx-auto max-w-7xl">
          {MENU_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              data-ocid="menu.tab"
              onClick={() => setActiveCategory(cat.value)}
              className="font-body text-sm px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200"
              style={{
                background:
                  activeCategory === cat.value
                    ? "oklch(0.56 0.14 42)"
                    : "transparent",
                color:
                  activeCategory === cat.value
                    ? "white"
                    : "oklch(0.42 0.04 45)",
                fontWeight: activeCategory === cat.value ? 600 : 400,
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Items */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 pb-24">
        <div className="mb-6">
          <h2 className="font-display text-2xl font-bold text-foreground">
            {MENU_CATEGORIES.find((c) => c.value === activeCategory)?.label}
          </h2>
          <p
            className="font-body text-sm mt-1"
            style={{ color: "oklch(0.52 0.04 55)" }}
          >
            {filtered.length} items
          </p>
        </div>
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((item, i) => (
              <MenuCard key={item.name} item={item} index={i + 1} />
            ))}
          </div>
        ) : (
          <div data-ocid="menu.empty_state" className="py-20 text-center">
            <p
              className="font-body text-base"
              style={{ color: "oklch(0.52 0.04 55)" }}
            >
              No items in this category yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function GalleryPage() {
  useFadeInOnScroll();
  return (
    <div className="min-h-screen" style={{ background: "oklch(0.13 0.03 42)" }}>
      <div className="max-w-6xl mx-auto px-4 py-24">
        <div className="text-center mb-14 section-fade-in">
          <p
            className="font-body text-sm uppercase tracking-[0.25em] mb-3"
            style={{ color: "oklch(0.7 0.1 65)" }}
          >
            Visual stories
          </p>
          <h2
            className="font-display text-4xl sm:text-5xl font-bold mb-4"
            style={{ color: "white" }}
          >
            Gallery
          </h2>
          <div
            className="w-16 h-0.5 mx-auto"
            style={{ background: "oklch(0.56 0.14 42)" }}
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div
            data-ocid="gallery.item.1"
            className="gallery-item col-span-2 row-span-2 rounded-2xl overflow-hidden cursor-pointer section-fade-in"
            style={{ aspectRatio: "1/1" }}
          >
            <img
              src={GALLERY_IMAGES[2].src}
              alt={GALLERY_IMAGES[2].title}
              className="w-full h-full object-cover"
            />
          </div>
          {GALLERY_IMAGES.slice(0, 6)
            .filter((_, i) => i !== 2)
            .map((img, i) => (
              <div
                key={img.title}
                data-ocid={`gallery.item.${(i + 2) as 2}`}
                className="gallery-item rounded-xl overflow-hidden cursor-pointer section-fade-in relative group"
                style={{ aspectRatio: "4/3" }}
              >
                <img
                  src={img.src}
                  alt={img.title}
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(to top, oklch(0.13 0.03 42 / 0.85), transparent)",
                  }}
                >
                  <p className="font-display text-sm font-semibold text-white">
                    {img.title}
                  </p>
                  <p
                    className="font-body text-xs"
                    style={{ color: "oklch(0.78 0.06 65)" }}
                  >
                    {img.caption}
                  </p>
                </div>
              </div>
            ))}
          <div
            data-ocid="gallery.item.7"
            className="gallery-item col-span-2 rounded-xl overflow-hidden cursor-pointer section-fade-in relative group"
            style={{ aspectRatio: "16/7" }}
          >
            <img
              src={GALLERY_IMAGES[6].src}
              alt={GALLERY_IMAGES[6].title}
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background:
                  "linear-gradient(to top, oklch(0.13 0.03 42 / 0.85), transparent)",
              }}
            >
              <p className="font-display text-base font-semibold text-white">
                {GALLERY_IMAGES[6].title}
              </p>
              <p
                className="font-body text-sm"
                style={{ color: "oklch(0.78 0.06 65)" }}
              >
                {GALLERY_IMAGES[6].caption}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AboutPage() {
  useFadeInOnScroll();
  const stats = [
    { value: "15+", label: "Years of Experience" },
    { value: "100%", label: "Natural Ingredients" },
    { value: "50+", label: "Signature Dishes" },
  ];
  return (
    <div className="min-h-screen py-24 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div className="section-fade-in">
            <p className="font-body text-sm uppercase tracking-[0.25em] text-primary mb-3">
              Who we are
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-6 leading-tight">
              Our Story
            </h2>
            <div
              className="w-12 h-0.5 mb-8"
              style={{ background: "oklch(0.56 0.14 42)" }}
            />
            <p
              className="font-body text-base leading-relaxed mb-5"
              style={{ color: "oklch(0.42 0.04 45)" }}
            >
              Arogya Ruchulu was born from a simple conviction: that traditional
              South Indian food is one of the world's most balanced and
              nourishing cuisines. Our name means{" "}
              <em className="font-display italic">
                &quot;healthy flavours&quot;
              </em>{" "}
              in Telugu — and that's our daily promise.
            </p>
            <p
              className="font-body text-base leading-relaxed mb-5"
              style={{ color: "oklch(0.42 0.04 45)" }}
            >
              Every dish is crafted from our grandmothers' heirloom recipes,
              using ingredients sourced from local farmers who share our
              commitment to chemical-free, seasonal produce. We use no
              artificial additives, no MSG, no shortcuts.
            </p>
            <p
              className="font-body text-base leading-relaxed mb-10"
              style={{ color: "oklch(0.42 0.04 45)" }}
            >
              From the first marination at dawn to the last plate served at
              night, everything is made fresh in our kitchen — the same way it's
              always been done.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="text-center p-4 rounded-xl"
                  style={{ background: "oklch(0.93 0.04 42)" }}
                >
                  <p
                    className="font-display text-2xl font-bold mb-1"
                    style={{ color: "oklch(0.46 0.12 42)" }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className="font-body text-xs"
                    style={{ color: "oklch(0.48 0.05 45)" }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="section-fade-in relative">
            <div
              className="absolute -top-4 -left-4 w-full h-full rounded-2xl"
              style={{ background: "oklch(0.93 0.04 42)" }}
            />
            <img
              src="/assets/uploads/hero-1.jpg"
              alt="Arogya Ruchulu food spread"
              className="relative z-10 w-full rounded-2xl object-cover shadow-xl"
              style={{ aspectRatio: "4/3" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactPage() {
  useFadeInOnScroll();
  const address =
    "Sarika, near SBI Bank, street, Gurla, Vizianagaram, Andhra Pradesh 535217";
  const phone = "8341277227";
  const hours = "Mon–Sun: 10:00 AM – 10:00 PM";

  return (
    <div
      className="min-h-screen py-24 px-4"
      style={{ background: "oklch(0.95 0.015 70)" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14 section-fade-in">
          <p className="font-body text-sm uppercase tracking-[0.25em] text-primary mb-3">
            Find us
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Contact & Location
          </h2>
          <div
            className="w-16 h-0.5 mx-auto"
            style={{ background: "oklch(0.56 0.14 42)" }}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
          <div className="lg:col-span-2 flex flex-col gap-6 section-fade-in">
            <div className="bg-card rounded-2xl p-7 border border-border shadow-xs">
              <h3 className="font-display text-xl font-semibold text-foreground mb-6">
                Visit Us
              </h3>
              <div className="flex gap-4 mb-5">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: "oklch(0.93 0.04 42)" }}
                >
                  <MapPin size={16} style={{ color: "oklch(0.56 0.14 42)" }} />
                </div>
                <div>
                  <p
                    className="font-body text-xs uppercase tracking-wider mb-1"
                    style={{ color: "oklch(0.6 0.04 55)" }}
                  >
                    Address
                  </p>
                  <p className="font-body text-sm text-foreground leading-relaxed">
                    {address}
                  </p>
                </div>
              </div>
              <div className="flex gap-4 mb-5">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "oklch(0.93 0.04 42)" }}
                >
                  <Phone size={16} style={{ color: "oklch(0.56 0.14 42)" }} />
                </div>
                <div>
                  <p
                    className="font-body text-xs uppercase tracking-wider mb-1"
                    style={{ color: "oklch(0.6 0.04 55)" }}
                  >
                    Phone
                  </p>
                  <a
                    href={`tel:${phone}`}
                    className="font-body text-sm text-foreground hover:text-primary transition-colors"
                  >
                    {phone}
                  </a>
                </div>
              </div>
              <div className="flex gap-4 mb-5">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "oklch(0.93 0.04 42)" }}
                >
                  <SiWhatsapp
                    size={16}
                    style={{ color: "oklch(0.48 0.2 145)" }}
                  />
                </div>
                <div>
                  <p
                    className="font-body text-xs uppercase tracking-wider mb-1"
                    style={{ color: "oklch(0.6 0.04 55)" }}
                  >
                    WhatsApp Order
                  </p>
                  <a
                    href={`https://wa.me/91${phone}?text=Hi%2C%20I%20would%20like%20to%20order%20from%20Arogya%20Ruchulu`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-sm text-foreground hover:text-primary transition-colors"
                  >
                    {phone}
                  </a>
                </div>
              </div>
              <div className="flex gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "oklch(0.93 0.04 42)" }}
                >
                  <Clock size={16} style={{ color: "oklch(0.56 0.14 42)" }} />
                </div>
                <div>
                  <p
                    className="font-body text-xs uppercase tracking-wider mb-1"
                    style={{ color: "oklch(0.6 0.04 55)" }}
                  >
                    Opening Hours
                  </p>
                  <p className="font-body text-sm text-foreground">{hours}</p>
                </div>
              </div>
            </div>
            <a
              href="https://maps.app.goo.gl/XXX9x9UUPGhwEY2Q6"
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="contact.map_marker"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-body font-semibold text-sm transition-all hover:scale-[1.02]"
              style={{ background: "oklch(0.56 0.14 42)", color: "white" }}
            >
              <ExternalLink size={16} />
              View on Google Maps
            </a>
            <a
              href={`https://wa.me/91${phone}?text=Hi%2C%20I%20would%20like%20to%20order%20from%20Arogya%20Ruchulu`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-body font-semibold text-sm transition-all hover:scale-[1.02]"
              style={{ background: "oklch(0.48 0.2 145)", color: "white" }}
            >
              <SiWhatsapp size={18} />
              Order on WhatsApp
            </a>
          </div>
          <div className="lg:col-span-3 section-fade-in">
            <div
              className="rounded-2xl overflow-hidden border border-border shadow-xs"
              style={{ height: "420px" }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15272.5!2d83.5637!3d18.5962!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a395e0000000001%3A0x0!2zR3VybGEsIFZpemluYWdhcmFtLCBBbmRocmEgUHJhZGVzaA!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="420"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Gurla, Vizianagaram Location"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Admin Page ───────────────────────────────────────────────────────────────
function AdminPage() {
  const { login, clear, loginStatus, identity, isInitializing } =
    useInternetIdentity();
  const isLoggedIn = loginStatus === "success" && !!identity;
  const { data: isAdmin, isLoading: checkingAdmin } = useIsAdmin(isLoggedIn);
  const { data: orders, isLoading: loadingOrders } = useAdminOrders(
    isAdmin === true,
  );

  function formatTimestamp(ns: bigint) {
    const ms = Number(ns / BigInt(1_000_000));
    return new Date(ms).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2
          className="animate-spin"
          size={32}
          style={{ color: "oklch(0.56 0.14 42)" }}
        />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-24 px-4"
      style={{ background: "oklch(0.97 0.01 75)" }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-body text-sm uppercase tracking-[0.25em] text-primary mb-3">
            Restaurant Management
          </p>
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">
            Admin Panel
          </h1>
          <div
            className="w-16 h-0.5 mx-auto"
            style={{ background: "oklch(0.56 0.14 42)" }}
          />
        </div>

        {!isLoggedIn ? (
          <div
            data-ocid="admin.panel"
            className="max-w-sm mx-auto bg-card rounded-2xl border border-border p-10 text-center shadow-sm"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: "oklch(0.93 0.04 42)" }}
            >
              <ShoppingCart
                size={28}
                style={{ color: "oklch(0.46 0.12 42)" }}
              />
            </div>
            <h2 className="font-display text-xl font-bold text-foreground mb-2">
              Admin Login
            </h2>
            <p
              className="font-body text-sm mb-8"
              style={{ color: "oklch(0.52 0.04 55)" }}
            >
              Sign in with Internet Identity to access the admin dashboard.
            </p>
            <Button
              data-ocid="admin.primary_button"
              onClick={() => login()}
              disabled={loginStatus === "logging-in"}
              className="w-full font-body font-semibold rounded-xl py-3"
              style={{ background: "oklch(0.56 0.14 42)", color: "white" }}
            >
              {loginStatus === "logging-in" ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={16} />
                  Signing in...
                </>
              ) : (
                "Sign in with Internet Identity"
              )}
            </Button>
          </div>
        ) : checkingAdmin ? (
          <div
            data-ocid="admin.loading_state"
            className="flex items-center justify-center py-20"
          >
            <Loader2
              className="animate-spin"
              size={28}
              style={{ color: "oklch(0.56 0.14 42)" }}
            />
          </div>
        ) : isAdmin !== true ? (
          <div
            data-ocid="admin.error_state"
            className="max-w-sm mx-auto text-center py-16"
          >
            <p
              className="font-display text-xl font-bold mb-3"
              style={{ color: "oklch(0.55 0.22 25)" }}
            >
              Access Denied
            </p>
            <p
              className="font-body text-sm mb-6"
              style={{ color: "oklch(0.52 0.04 55)" }}
            >
              Your account does not have admin privileges.
            </p>
            <Button
              variant="outline"
              data-ocid="admin.secondary_button"
              onClick={() => clear()}
              className="font-body"
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <div data-ocid="admin.table">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground">
                  Orders
                </h2>
                <p
                  className="font-body text-sm mt-1"
                  style={{ color: "oklch(0.52 0.04 55)" }}
                >
                  {orders?.length ?? 0} total orders
                </p>
              </div>
              <Button
                variant="outline"
                data-ocid="admin.secondary_button"
                onClick={() => clear()}
                className="font-body text-sm"
              >
                Sign Out
              </Button>
            </div>

            {loadingOrders ? (
              <div
                data-ocid="admin.loading_state"
                className="flex items-center justify-center py-20"
              >
                <Loader2
                  className="animate-spin"
                  size={28}
                  style={{ color: "oklch(0.56 0.14 42)" }}
                />
              </div>
            ) : !orders || orders.length === 0 ? (
              <div
                data-ocid="admin.empty_state"
                className="text-center py-20 bg-card rounded-2xl border border-border"
              >
                <ShoppingCart
                  size={40}
                  className="mx-auto mb-4"
                  style={{ color: "oklch(0.7 0.04 55)" }}
                />
                <p className="font-display text-lg font-semibold text-foreground">
                  No orders yet
                </p>
                <p
                  className="font-body text-sm mt-1"
                  style={{ color: "oklch(0.52 0.04 55)" }}
                >
                  Orders placed through WhatsApp will appear here.
                </p>
              </div>
            ) : (
              <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-body font-semibold">
                        Order ID
                      </TableHead>
                      <TableHead className="font-body font-semibold">
                        Date & Time
                      </TableHead>
                      <TableHead className="font-body font-semibold">
                        Items
                      </TableHead>
                      <TableHead className="font-body font-semibold text-right">
                        Total
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...orders]
                      .sort((a, b) => (b.timestamp > a.timestamp ? 1 : -1))
                      .map((order: CustomerOrder, idx: number) => (
                        <TableRow
                          key={String(order.orderId)}
                          data-ocid={`admin.row.${(idx + 1) as 1}`}
                        >
                          <TableCell className="font-body text-sm font-medium">
                            #{String(order.orderId)}
                          </TableCell>
                          <TableCell className="font-body text-sm">
                            {formatTimestamp(order.timestamp)}
                          </TableCell>
                          <TableCell className="font-body text-sm">
                            <ul className="space-y-0.5">
                              {order.items.map((item) => (
                                <li key={item.itemName}>
                                  {item.itemName} ×{String(item.quantity)} — ₹
                                  {String(item.priceEach)}
                                </li>
                              ))}
                            </ul>
                          </TableCell>
                          <TableCell className="font-body text-sm font-bold text-right">
                            ₹{String(order.totalAmount)}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Root Layout ──────────────────────────────────────────────────────────────
function RootLayoutComponent() {
  const routerState = useRouterState();
  const isMenuPage = routerState.location.pathname === "/menu";
  const isAdminPage = routerState.location.pathname === "/admin";

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <NavBar />
      {!isMenuPage && !isAdminPage && <CateringBanner />}
      <main className="pt-16 flex-1">
        <Outlet />
      </main>
      {!isMenuPage && !isAdminPage && <Footer />}
      <WhatsAppButton />
      <FloatingCartButton />
      <CartSheet />
    </div>
  );
}

// ─── Router setup (module level, stable) ─────────────────────────────────────
const rootRoute = createRootRoute({ component: RootLayoutComponent });
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
const menuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/menu",
  component: MenuPage,
});
const galleryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/gallery",
  component: GalleryPage,
});
const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutPage,
});
const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
});
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  menuRoute,
  galleryRoute,
  aboutRoute,
  contactRoute,
  adminRoute,
]);

const router = createRouter({ routeTree, history: createBrowserHistory() });

// ─── App Root ─────────────────────────────────────────────────────────────────
function AppWrapper() {
  const { data: info } = useRestaurantInfo();
  const whatsapp = info?.whatsapp ?? "918341277227";

  return (
    <AppContext.Provider value={{ whatsapp }}>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AppContext.Provider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppWrapper />
    </QueryClientProvider>
  );
}
