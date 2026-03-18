# Arogya Ruchulu

## Current State
- Multi-page React app with routes: Home, Menu (with category sub-pages), Gallery, About, Contact
- Menu data is stored locally in App.tsx (not from backend)
- Backend has basic restaurant info and a placeholder menu -- not used by frontend
- No cart functionality, no order system, no admin panel
- Sticky navbar with solid white background, hero with food imagery

## Requested Changes (Diff)

### Add
- **Tiffens category** with one item: Pulka (price as per menu card: ₹30)
- **Cart state** (React context): track items, quantities, total
- **Add / quantity controls** on each menu item card: "Add" button that becomes "- N +" once added
- **Cart icon** with item count badge -- floating bottom-right on mobile, fixed top-right in navbar on desktop
- **Cart drawer/sheet** that opens on clicking the cart icon -- shows items, quantities, subtotal, "Place Order" button
- **WhatsApp redirect** on Place Order: opens `wa.me/918341277227` with a pre-filled message listing all ordered items, quantities, and total price
- **Order storage** in backend: save each order (items, quantities, total, timestamp, customer name optional) before WhatsApp redirect
- **Admin page** at `/admin` route: password-protected view showing all saved orders sorted by newest first, with order details (items, total, timestamp)

### Modify
- `MENU_CATEGORIES` in frontend: add `{ label: "Tiffens", value: "tiffens" }`
- `MENU_ITEMS` in frontend: add `{ name: "Pulka", price: 30, vegetarian: true, category: "tiffens" }`
- Backend `main.mo`: replace placeholder with order storage system -- `placeOrder`, `getOrders` (admin only), `getOrderCount` functions
- Navbar: add cart icon button (top-right area) visible on desktop

### Remove
- Nothing removed

## Implementation Plan
1. Select `authorization` component for admin login
2. Generate Motoko backend with:
   - `Order` type: id, items (name, qty, price), total, timestamp, whatsappSent flag
   - `placeOrder(items)` -- public, saves order, returns order ID
   - `getOrders()` -- admin only (authorized), returns all orders
   - `getOrderCount()` -- admin only, returns count
3. Frontend changes:
   - Add Tiffens/Pulka to menu data
   - Create `CartContext` with add/remove/update quantity/clear
   - Add Add/quantity controls to each MenuItem card
   - Add CartIcon component: floating on mobile, in navbar on desktop, with badge
   - Add CartSheet component: slide-over panel with order summary and Place Order button
   - On Place Order: call `placeOrder()` backend, then open WhatsApp deep link
   - Add `/admin` route: uses authorization login, lists orders from backend
