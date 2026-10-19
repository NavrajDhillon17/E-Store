# 🌟 NovaStore — Premium Multi-Brand Tech & Electronics E-Commerce Platform

A production-grade, full-stack MERN e-commerce application engineered with high-performance responsive UI, JWT Role-Based Access Control (RBAC), multi-faceted catalog filtering, spotlight search, checkout simulation with coupon discount engine, and an Admin inventory management CMS dashboard.

---

## 🚀 Live Demo & Quick Credentials

- **Frontend URL**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

### 🔑 Demo Accounts (1-Click Login available on the Sign In page):
| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@novastore.com` | `admin123` | Full Inventory CMS, Stats, Create/Edit/Delete products |
| **Customer** | `demo@novastore.com` | `demo123` | Store browsing, Bag, Checkout, Order invoice receipt |

---

## ✨ Key Features & Technical Highlights

### 1. Multi-Brand Hardware Catalog & Advanced Filtering
- **5 Core Hardware Categories**:
  - 📱 **Smartphones**: iPhone 16 Pro Max, Samsung Galaxy S24 Ultra, Google Pixel 9 Pro, OnePlus 12.
  - 💻 **Laptops & Workstations**: MacBook Pro 16" M4 Max, Dell XPS 15 OLED, ASUS ROG Zephyrus G16, Lenovo ThinkPad X1 Carbon.
  - 🎧 **Audio & Sound**: Sony WH-1000XM5, AirPods Max, Bose QuietComfort Ultra, Sennheiser Momentum 4.
  - ⌚ **Smartwatches**: Apple Watch Ultra 2, Galaxy Watch 7, Garmin Epix Pro Gen 2.
  - 🎮 **Gaming & Accessories**: Logitech MX Master 3S, Keychron Q1 Pro, LG UltraFine 4K Display, Anker Prime 100W GaN.
- **Dynamic Multi-Parameter Query Engine**:
  - Filter by Category, Brand, Budget range slider, and In-Stock availability.
  - Sort by Price (Low to High / High to Low), Ratings, and Newest.

### 2. Spotlight Instant Search (⌘K / Ctrl+K)
- Global spotlight search modal with debounced query resolution, thumbnail suggestions, and 1-click add-to-bag.

### 3. Interactive Product Quick-View Overlay
- High-res asset preview, color variant pills, key technical specs highlights, customer ratings breakdown, and quantity selector.

### 4. Full Cart & Checkout Workflow
- Persistent localStorage cart state with quantity steppers and item removal.
- **Coupon Discount Engine**: Apply `NOVA15` for 15% off your entire order with automatic tax and free-shipping calculation.
- **Simulated Checkout & Payment**: Collects delivery address, offers Apple Pay / Credit Card / Cash on Delivery, and generates an itemized Order Confirmation invoice with delivery tracking dates.

### 5. Admin Inventory CMS Control Center
- **Real-time Inventory Analytics**: Total hardware count, active in-stock vs out-of-stock, and total catalog valuation ($19,800+).
- **Product CRUD**: Add new hardware with live thumbnail previews, category/brand selectors, color variants, and spec bullets.
- **Safety Delete**: Confirmation dialog modal prevents accidental catalog deletions.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Tailwind CSS v4, Lucide React icons, Vite, Axios, React Router Dom v7.
- **Backend**: Node.js, Express.js (v5), Mongoose, JSON Web Tokens (JWT), Bcrypt password hashing, CORS, Dotenv.
- **Database**: MongoDB (`novastore` database).

---

## 💻 How to Run Locally

### 1. Start Backend
```bash
cd backend
npm install
node seed.js    # Seeds 21 products and admin/customer accounts
node index.js   # Starts Express server on port 5000
```

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev     # Starts Vite dev server on http://localhost:5173
```

---

## 📄 Ready-to-Use Resume Bullet Points

```markdown
NovaStore — Full-Stack E-Commerce Platform | MERN Stack, Tailwind CSS, JWT
• Architected a responsive multi-brand electronics marketplace featuring 5 hardware categories, 
  dynamic multi-filter sorting (brand, price, stock), and an instant Spotlight search modal.
• Engineered secure RESTful APIs using Node.js/Express and MongoDB with JWT Role-Based Access 
  Control (RBAC), isolating customer checkout from administrative inventory management.
• Designed an interactive shopping bag and checkout workflow supporting coupon discount validation 
  (NOVA15), automated sales tax/shipping calculation, and generated itemized invoice receipts.
• Implemented an Admin Control Dashboard featuring real-time inventory valuation analytics, stock 
  indicators, and full CRUD operations with live image previews.
```
