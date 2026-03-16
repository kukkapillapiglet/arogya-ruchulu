import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Clock, MapPin, Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { SiWhatsapp } from "react-icons/si";
import { useRestaurantInfo } from "./hooks/useQueries";

const queryClient = new QueryClient();

function useFadeInOnScroll() {
  useEffect(() => {
    const els = document.querySelectorAll(".section-fade-in");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        }
      },
      { threshold: 0.1 },
    );
    for (const el of els) {
      observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);
}

interface LocalMenuItem {
  name: string;
  price?: number;
  vegetarian: boolean;
  category: string;
  comingSoon?: boolean;
  seasonal?: boolean;
  priceNote?: string;
}

const CATEGORIES = [
  { label: "All", value: "all" },
  { label: "Biryani", value: "biryani" },
  { label: "Fried Rice", value: "fried-rice" },
  { label: "Curries", value: "curries" },
  { label: "Starters", value: "starters" },
  { label: "Veg Starters", value: "veg-starters" },
  { label: "Rolls", value: "rolls" },
  { label: "Noodles", value: "noodles" },
  { label: "Soups", value: "soups" },
  { label: "Tiffins", value: "tiffins" },
  { label: "Special", value: "special" },
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
  // SOUPS
  { name: "Chicken Soup", price: 50, vegetarian: false, category: "soups" },
  { name: "Egg Soup", price: 30, vegetarian: false, category: "soups" },
  { name: "Hot & Sour Soup", price: 50, vegetarian: true, category: "soups" },
  { name: "Sweet Corn Soup", price: 50, vegetarian: true, category: "soups" },
  { name: "Veg Soup", price: 30, vegetarian: true, category: "soups" },
  {
    name: "Mutton Soup",
    vegetarian: false,
    category: "soups",
    comingSoon: true,
  },
  // TIFFINS
  { name: "Pulka", price: 10, vegetarian: true, category: "tiffins" },
  // SPECIAL
  { name: "Egg Kulfi", vegetarian: false, category: "special", seasonal: true },
  {
    name: "Double Egg Kulfi",
    vegetarian: false,
    category: "special",
    seasonal: true,
  },
  {
    name: "Chicken Egg Kulfi",
    vegetarian: false,
    category: "special",
    comingSoon: true,
  },
  {
    name: "Chicken Grill Stick",
    vegetarian: false,
    category: "special",
    comingSoon: true,
  },
  {
    name: "Paneer Grill",
    vegetarian: true,
    category: "special",
    comingSoon: true,
  },
  {
    name: "Mushroom Grill",
    vegetarian: true,
    category: "special",
    comingSoon: true,
  },
];

const GALLERY_IMAGES = [
  {
    src: "/assets/generated/dish-dosa.dim_800x600.jpg",
    title: "Masala Dosa",
    caption: "Crispy, golden perfection",
  },
  {
    src: "/assets/generated/dish-idli.dim_800x600.jpg",
    title: "Idli Sambar",
    caption: "Light, fluffy, nourishing",
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
];

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

function NavBar({ whatsapp }: { whatsapp: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "#home", ocid: "nav.home.link" },
    { label: "Menu", href: "#menu", ocid: "nav.menu.link" },
    { label: "Gallery", href: "#gallery", ocid: "nav.gallery.link" },
    { label: "About", href: "#about", ocid: "nav.about.link" },
    { label: "Contact", href: "#contact", ocid: "nav.contact.link" },
  ];

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "nav-scrolled" : "nav-top"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <button
          type="button"
          onClick={() => scrollTo("#home")}
          className="font-display text-xl font-bold tracking-tight"
          style={{ color: scrolled ? "oklch(0.35 0.09 42)" : "white" }}
        >
          Arogya Ruchulu
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              data-ocid={link.ocid}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(link.href);
              }}
              className="font-body text-sm font-medium transition-colors duration-200 hover:text-primary"
              style={{
                color: scrolled
                  ? "oklch(0.35 0.05 45)"
                  : "oklch(0.97 0.01 75 / 0.92)",
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href={`https://wa.me/${whatsapp}?text=Hi%2C%20I%20would%20like%20to%20order%20from%20Arogya%20Ruchulu`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200"
            style={{
              background: "oklch(0.48 0.2 145)",
              color: "white",
            }}
          >
            Order Now
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2"
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ color: scrolled ? "oklch(0.35 0.09 42)" : "white" }}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu — use inline style to guarantee opaque background */}
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
            <a
              key={link.href}
              href={link.href}
              data-ocid={link.ocid}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(link.href);
              }}
              className="font-body text-sm font-medium transition-colors"
              style={{ color: "oklch(0.28 0.05 45)" }}
            >
              {link.label}
            </a>
          ))}
          <a
            href={`https://wa.me/${whatsapp}?text=Hi%2C%20I%20would%20like%20to%20order%20from%20Arogya%20Ruchulu`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-sm font-semibold px-4 py-2.5 rounded-full text-center transition-all duration-200 mt-1"
            style={{
              background: "oklch(0.48 0.2 145)",
              color: "white",
            }}
          >
            Order on WhatsApp
          </a>
        </div>
      )}
    </nav>
  );
}

function HeroSection({ whatsapp }: { whatsapp: string }) {
  const scrollToMenu = () => {
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-food.dim_1600x900.jpg')",
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "oklch(0.15 0.04 42 / 0.72)" }}
      />

      {/* Decorative bottom fade */}
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
          Hyderabad's finest
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
            onClick={scrollToMenu}
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
  );
}

function MenuSection() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filtered =
    activeCategory === "all"
      ? MENU_ITEMS
      : MENU_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <section id="menu" className="py-24 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14 section-fade-in">
          <p className="font-body text-sm uppercase tracking-[0.25em] text-primary mb-3">
            What we serve
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Our Menu
          </h2>
          <div
            className="w-16 h-0.5 mx-auto"
            style={{ background: "oklch(0.56 0.14 42)" }}
          />
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 section-fade-in">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              data-ocid="menu.tab"
              onClick={() => setActiveCategory(cat.value)}
              className="font-body text-sm px-5 py-2 rounded-full font-medium transition-all duration-200"
              style={{
                background:
                  activeCategory === cat.value
                    ? "oklch(0.56 0.14 42)"
                    : "oklch(0.93 0.015 70)",
                color:
                  activeCategory === cat.value
                    ? "white"
                    : "oklch(0.42 0.05 45)",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Menu grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item, idx) => (
            <MenuCard
              key={`${item.name}-${item.category}-${idx}`}
              item={item}
              index={idx + 1}
            />
          ))}
          {filtered.length === 0 && (
            <div
              className="col-span-3 text-center py-16"
              data-ocid="menu.empty_state"
            >
              <p className="font-body text-muted-foreground">
                No items in this category yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

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
  const ocid = `menu.item.${index}`;
  const isUnavailable = item.comingSoon || item.seasonal;

  return (
    <div
      data-ocid={ocid}
      className="menu-card bg-card rounded-xl border border-border p-5 flex flex-col gap-2"
      style={{ opacity: item.comingSoon ? 0.6 : item.seasonal ? 0.75 : 1 }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <VegDot vegetarian={item.vegetarian} />
          <h3 className="font-display text-lg font-semibold text-card-foreground leading-snug">
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
      <div className="mt-auto pt-2">
        {!isUnavailable && (
          <span
            className="font-display text-xl font-semibold"
            style={{ color: "oklch(0.56 0.14 42)" }}
          >
            {item.priceNote
              ? item.priceNote
              : item.price !== undefined
                ? `₹${item.price}`
                : ""}
          </span>
        )}
      </div>
    </div>
  );
}

function GallerySection() {
  return (
    <section
      id="gallery"
      className="py-24 px-4"
      style={{ background: "oklch(0.13 0.03 42)" }}
    >
      <div className="max-w-6xl mx-auto">
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
          {/* Large items */}
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
                data-ocid={`gallery.item.${i + 2}`}
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
              src={GALLERY_IMAGES[7].src}
              alt={GALLERY_IMAGES[7].title}
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
                {GALLERY_IMAGES[7].title}
              </p>
              <p
                className="font-body text-sm"
                style={{ color: "oklch(0.78 0.06 65)" }}
              >
                {GALLERY_IMAGES[7].caption}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  const stats = [
    { value: "15+", label: "Years of Experience" },
    { value: "100%", label: "Natural Ingredients" },
    { value: "50+", label: "Signature Dishes" },
  ];

  return (
    <section id="about" className="py-24 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Text */}
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
              <em className="font-display italic">"healthy flavours"</em> in
              Telugu — and that's our daily promise.
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
              From the first fermented idli batter at dawn to the last filter
              coffee at night, everything is made fresh in our kitchen — the
              same way it's always been done.
            </p>

            {/* Stats */}
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

          {/* Image */}
          <div className="section-fade-in relative">
            <div
              className="absolute -top-4 -left-4 w-full h-full rounded-2xl"
              style={{ background: "oklch(0.93 0.04 42)" }}
            />
            <img
              src="/assets/generated/dish-thali.dim_800x600.jpg"
              alt="Traditional South Indian Thali"
              className="relative z-10 w-full rounded-2xl object-cover shadow-xl"
              style={{ aspectRatio: "4/3" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const { data: info } = useRestaurantInfo();

  const address =
    info?.address ?? "123 Jubilee Hills, Hyderabad, Telangana 500033";
  const phone = info?.phone ?? "+91 99999 99999";
  const hours = info?.openingHours ?? "Mon–Sun: 7:00 AM – 10:00 PM";

  return (
    <section
      id="contact"
      className="py-24 px-4"
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
          {/* Info panel */}
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
          </div>

          {/* Map */}
          <div className="lg:col-span-3 section-fade-in">
            <div
              className="rounded-2xl overflow-hidden border border-border shadow-xs"
              data-ocid="contact.map_marker"
              style={{ height: "400px" }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.6!2d78.4867!3d17.3850!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDIzJzA2LjAiTiA3OMKwMjknMTIuMiJF!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Arogya Ruchulu Location"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhatsAppButton({ whatsapp }: { whatsapp: string }) {
  const url = `https://wa.me/${whatsapp}?text=Hi%2C%20I%20would%20like%20to%20order%20from%20Arogya%20Ruchulu`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      data-ocid="whatsapp.button"
      className="whatsapp-btn fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
      style={{ background: "oklch(0.48 0.2 145)" }}
      aria-label="Order on WhatsApp"
    >
      <SiWhatsapp size={26} color="white" />
    </a>
  );
}

function Footer() {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };
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

          <div className="flex items-center gap-6">
            {["#home", "#menu", "#gallery", "#about", "#contact"].map(
              (href) => (
                <a
                  key={href}
                  href={href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(href);
                  }}
                  className="font-body text-xs capitalize hover:text-white transition-colors"
                >
                  {href.replace("#", "")}
                </a>
              ),
            )}
          </div>
        </div>

        <div
          className="mt-8 pt-6 text-center font-body text-xs"
          style={{ borderTop: "1px solid oklch(1 0 0 / 0.08)" }}
        >
          © {year}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-white transition-colors"
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}

function RestaurantApp() {
  useFadeInOnScroll();
  const { data: info } = useRestaurantInfo();
  const whatsapp = info?.whatsapp ?? "919999999999";

  return (
    <div className="min-h-screen">
      <NavBar whatsapp={whatsapp} />
      <CateringBanner />
      <main>
        <HeroSection whatsapp={whatsapp} />
        <MenuSection />
        <GallerySection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppButton whatsapp={whatsapp} />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RestaurantApp />
    </QueryClientProvider>
  );
}
