const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config();

const Product = require("./models/Products");
const User = require("./models/Users");

const sampleProducts = [
    // --- SMARTPHONES ---
    {
        title: "iPhone 16 Pro Max",
        brand: "Apple",
        category: "smartphones",
        price: 1199,
        originalPrice: 1299,
        discount: 8,
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80",
        description: "Grade 5 titanium design with the groundbreaking A18 Pro chip, 48MP Fusion camera system, and Camera Control button.",
        features: [
            "A18 Pro chip with 6-core GPU",
            "Super Retina XDR 6.9-inch display with ProMotion",
            "48MP Main with 5x Telephoto optical zoom",
            "Up to 33 hours video playback",
            "Titanium chassis with Ceramic Shield"
        ],
        rating: 4.9,
        reviewsCount: 342,
        inStock: true,
        tag: "Best Seller",
        colors: ["Natural Titanium", "Desert Titanium", "White Titanium", "Black Titanium"]
    },
    {
        title: "Samsung Galaxy S24 Ultra",
        brand: "Samsung",
        category: "smartphones",
        price: 1099,
        originalPrice: 1299,
        discount: 15,
        image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80",
        description: "Unleash Galaxy AI with an ultra-tough titanium frame, built-in S Pen, and 200MP Quad Telephoto optical camera system.",
        features: [
            "Snapdragon 8 Gen 3 for Galaxy",
            "6.8-inch Dynamic AMOLED 2X 120Hz display",
            "200MP main sensor with AI Nightography",
            "Integrated Bluetooth S Pen",
            "5000 mAh battery with 45W fast charging"
        ],
        rating: 4.8,
        reviewsCount: 289,
        inStock: true,
        tag: "AI Powered",
        colors: ["Titanium Gray", "Titanium Black", "Titanium Violet", "Titanium Yellow"]
    },
    {
        title: "Google Pixel 9 Pro",
        brand: "Google",
        category: "smartphones",
        price: 899,
        originalPrice: 999,
        discount: 10,
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80",
        description: "Pro-level Google AI with Google Tensor G4, Super Actua display, and industry-leading computational photography.",
        features: [
            "Google Tensor G4 processor with Titan M2",
            "6.3-inch Super Actua LTPO OLED (1-120Hz)",
            "50MP triple rear camera system with 30x Super Res Zoom",
            "7 years of verified OS and security updates",
            "Gemini Live built-in assistant"
        ],
        rating: 4.7,
        reviewsCount: 164,
        inStock: true,
        tag: "Pure Android",
        colors: ["Obsidian", "Porcelain", "Hazel", "Rose Quartz"]
    },
    {
        title: "OnePlus 12",
        brand: "OnePlus",
        category: "smartphones",
        price: 799,
        originalPrice: 899,
        discount: 11,
        image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80",
        description: "Elite flagship power with 4th Gen Hasselblad camera, 100W SUPERVOOC charging, and 2K 120Hz ProXDR display.",
        features: [
            "Qualcomm Snapdragon 8 Gen 3",
            "6.82-inch 2K 120Hz ProXDR Display (4500 nits peak)",
            "5400 mAh dual-cell battery with 100W wired charge",
            "50MP Sony LYT-808 sensor + 64MP periscope",
            "Dual Cryo-velocity VC cooling system"
        ],
        rating: 4.6,
        reviewsCount: 120,
        inStock: true,
        tag: "Speed Flagship",
        colors: ["Silky Black", "Flowy Emerald"]
    },
    {
        title: "iPhone 16",
        brand: "Apple",
        category: "smartphones",
        price: 799,
        originalPrice: 829,
        discount: 4,
        image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80",
        description: "Built for Apple Intelligence. 48MP Fusion 2-in-1 camera with Action Button and all-day battery life in aerospace aluminum.",
        features: [
            "A18 chip optimized for Apple Intelligence",
            "Camera Control for rapid photo adjustments",
            "48MP Fusion camera with 2x Telephoto quality",
            "Aerospace-grade aluminum enclosure with color-infused glass"
        ],
        rating: 4.8,
        reviewsCount: 195,
        inStock: true,
        tag: "Popular",
        colors: ["Ultramarine", "Teal", "Pink", "White", "Black"]
    },

    // --- LAPTOPS & COMPUTERS ---
    {
        title: "MacBook Pro 16\" (M4 Max)",
        brand: "Apple",
        category: "laptops",
        price: 3499,
        originalPrice: 3699,
        discount: 5,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
        description: "Phenomenal power for pro workflows. 16-core CPU, 40-core GPU, Liquid Retina XDR with nano-texture glass option.",
        features: [
            "Apple M4 Max chip with 16-core CPU / 40-core GPU",
            "48GB unified memory (configurable to 128GB)",
            "16.2-inch Liquid Retina XDR display with 1600 nits peak HDR",
            "Up to 24 hours battery life — longest ever in a Mac",
            "Thunderbolt 5 ports with 120Gbps bandwidth"
        ],
        rating: 5.0,
        reviewsCount: 210,
        inStock: true,
        tag: "Pro Powerhouse",
        colors: ["Space Black", "Silver"]
    },
    {
        title: "Dell XPS 15 OLED",
        brand: "Dell",
        category: "laptops",
        price: 1899,
        originalPrice: 2199,
        discount: 14,
        image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80",
        description: "Precision-crafted aluminum chassis with 3.5K OLED InfinityEdge touch display and NVIDIA GeForce RTX 4070 graphics.",
        features: [
            "Intel Core i9-13900H (14 cores / 20 threads)",
            "NVIDIA GeForce RTX 4070 Laptop GPU 8GB",
            "15.6-inch 3.5K (3456x2160) OLED Touchscreen",
            "32GB DDR5 RAM + 1TB PCIe Gen4 NVMe SSD",
            "CNC machined aluminum and carbon fiber palm rest"
        ],
        rating: 4.7,
        reviewsCount: 144,
        inStock: true,
        tag: "Creator Pick",
        colors: ["Platinum Silver", "Graphite"]
    },
    {
        title: "ASUS ROG Zephyrus G16",
        brand: "ASUS",
        category: "laptops",
        price: 2199,
        originalPrice: 2499,
        discount: 12,
        image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80",
        description: "Ultra-slim gaming laptop with CNC aluminum chassis, ROG Nebula OLED 240Hz display, and NVIDIA RTX 4080 graphics.",
        features: [
            "Intel Core Ultra 9 185H AI processor",
            "NVIDIA GeForce RTX 4080 12GB GDDR6",
            "16-inch 2.5K 240Hz 0.2ms ROG Nebula OLED panel",
            "Slash Lighting customizable LED matrix lid",
            "Tri-Fan technology with liquid metal cooling"
        ],
        rating: 4.8,
        reviewsCount: 98,
        inStock: true,
        tag: "Gaming Beast",
        colors: ["Eclipse Gray", "Platinum White"]
    },
    {
        title: "Lenovo ThinkPad X1 Carbon Gen 12",
        brand: "Lenovo",
        category: "laptops",
        price: 1649,
        originalPrice: 1899,
        discount: 13,
        image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80",
        description: "The pinnacle of executive mobility. Ultralight carbon-fiber body with Intel Core Ultra processor and legendary keyboard.",
        features: [
            "Intel Core Ultra 7 155H with integrated NPU",
            "Ultralight carbon fiber build weighing only 1.09 kg (2.42 lbs)",
            "14-inch 2.8K 120Hz OLED Anti-Glare display",
            "MIL-SPEC 810H military durability certification",
            "Communications Bar with 8MP HDR camera and dual mics"
        ],
        rating: 4.9,
        reviewsCount: 175,
        inStock: true,
        tag: "Business Legend",
        colors: ["Deep Black Carbon"]
    },
    {
        title: "Mac mini (M4 Pro)",
        brand: "Apple",
        category: "laptops",
        price: 1399,
        originalPrice: 1499,
        discount: 7,
        image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&auto=format&fit=crop&q=80",
        description: "Incredible speed inside a micro 5-inch form factor. Front ports, Thunderbolt 5, and the colossal compute power of M4 Pro.",
        features: [
            "Apple M4 Pro chip (12-core CPU / 16-core GPU)",
            "Ultra-compact 5.0 x 5.0 inch aluminum footprint",
            "24GB unified high-speed memory",
            "3x Thunderbolt 5, 2x USB-C front, HDMI 2.1, Gigabit LAN",
            "Built for Apple Intelligence and carbon neutral"
        ],
        rating: 4.9,
        reviewsCount: 140,
        inStock: true,
        tag: "Compact Power",
        colors: ["Silver"]
    },

    // --- AUDIO & HEADPHONES ---
    {
        title: "Sony WH-1000XM5 Wireless",
        brand: "Sony",
        category: "audio",
        price: 349,
        originalPrice: 399,
        discount: 13,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
        description: "Industry-leading noise cancellation with two processors, eight microphones, and ultra-comfortable lightweight design.",
        features: [
            "Integrated Processor V1 + HD Noise Cancelling Processor QN1",
            "30-hour battery life with 3-minute quick charge (3 hours)",
            "Multipoint connection pairs to two devices simultaneously",
            "Precise Voice Pickup with AI noise reduction",
            "Speak-to-Chat auto-pauses music when you speak"
        ],
        rating: 4.9,
        reviewsCount: 680,
        inStock: true,
        tag: "Top Rated",
        colors: ["Black", "Silver", "Midnight Blue"]
    },
    {
        title: "AirPods Max (USB-C)",
        brand: "Apple",
        category: "audio",
        price: 549,
        originalPrice: 579,
        discount: 5,
        image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80",
        description: "A perfect balance of exhilarating high-fidelity audio and the effortless magic of AirPods. Now with USB-C.",
        features: [
            "Apple-designed dynamic driver with dual neodymium magnets",
            "Pro-level Active Noise Cancellation with Transparency mode",
            "Personalized Spatial Audio with dynamic head tracking",
            "Knit-mesh canopy and memory foam acoustic ear cushions",
            "Up to 20 hours listening time on a single charge"
        ],
        rating: 4.7,
        reviewsCount: 420,
        inStock: true,
        tag: "Premium Hi-Fi",
        colors: ["Midnight", "Starlight", "Blue", "Purple", "Orange"]
    },
    {
        title: "Bose QuietComfort Ultra",
        brand: "Bose",
        category: "audio",
        price: 379,
        originalPrice: 429,
        discount: 12,
        image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80",
        description: "Breakthrough spatialized audio for more immersive listening that makes your music feel realer than ever before.",
        features: [
            "Bose Immersive Audio pushes boundaries of sound staging",
            "CustomTune technology tailors sound to the shape of your ears",
            "Quiet, Aware, and Immersion modes",
            "Up to 24 hours battery life (up to 18 hours with Immersive Audio)",
            "Luxury materials with sleek cast aluminum arms"
        ],
        rating: 4.8,
        reviewsCount: 312,
        inStock: true,
        tag: "Ultimate Comfort",
        colors: ["Black", "White Smoke", "Sandstone"]
    },
    {
        title: "Sennheiser Momentum 4 Wireless",
        brand: "Sennheiser",
        category: "audio",
        price: 279,
        originalPrice: 349,
        discount: 20,
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
        description: "Audiophile-grade 42mm transducer system delivering signature Sennheiser sound with an astounding 60-hour battery life.",
        features: [
            "Sennheiser Signature Sound with built-in 5-band EQ",
            "Unrivaled 60-hour battery playback life",
            "Adaptive Hybrid Noise Cancellation with Transparency mode",
            "Smart Pause and Auto On/Off convenience",
            "aptX Adaptive and AAC codec support"
        ],
        rating: 4.8,
        reviewsCount: 215,
        inStock: true,
        tag: "60h Battery",
        colors: ["Matte Black", "White Silver", "Denim"]
    },

    // --- WEARABLES & SMARTWATCHES ---
    {
        title: "Apple Watch Ultra 2",
        brand: "Apple",
        category: "wearables",
        price: 799,
        originalPrice: 849,
        discount: 6,
        image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80",
        description: "The ultimate sports and adventure watch. 49mm rugged titanium case, precision dual-frequency GPS, and up to 36 hours battery.",
        features: [
            "S9 SiP chip with 4-core Neural Engine and Double Tap gesture",
            "3000 nits Always-On Retina display — brightest Apple display",
            "Precision dual-frequency GPS (L1 and L5)",
            "Water resistant to 100m with EN13319 dive certification",
            "Customizable Action button and 86dB emergency siren"
        ],
        rating: 4.9,
        reviewsCount: 380,
        inStock: true,
        tag: "Adventure Pro",
        colors: ["Natural Titanium", "Black Titanium"]
    },
    {
        title: "Samsung Galaxy Watch 7",
        brand: "Samsung",
        category: "wearables",
        price: 299,
        originalPrice: 349,
        discount: 14,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
        description: "Powered by 3nm processor with Galaxy AI health insights, Energy Score monitoring, and dual-frequency GPS.",
        features: [
            "Exynos W1000 3nm 5-core processor",
            "BioActive Sensor with ECG, blood pressure, and advanced sleep apnea detection",
            "Dual-frequency GPS for accurate urban tracking",
            "Sapphire Crystal glass with Armor Aluminum casing",
            "Galaxy AI Energy Score and personalized fitness coaching"
        ],
        rating: 4.7,
        reviewsCount: 190,
        inStock: true,
        tag: "AI Health",
        colors: ["Green", "Silver", "Cream"]
    },
    {
        title: "Garmin Epix Pro (Gen 2) 47mm",
        brand: "Garmin",
        category: "wearables",
        price: 899,
        originalPrice: 999,
        discount: 10,
        image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80",
        description: "High-performance GPS smartwatch with brilliant AMOLED display, built-in LED flashlight, and comprehensive endurance metrics.",
        features: [
            "1.3-inch crystal-clear AMOLED display with Sapphire lens",
            "Up to 16 days of battery life in smartwatch mode",
            "Built-in multi-LED variable intensity flashlight",
            "TopoActive worldwide mapping and SatIQ technology",
            "Hill Score, Endurance Score, and Training Readiness metrics"
        ],
        rating: 4.9,
        reviewsCount: 142,
        inStock: true,
        tag: "Endurance Elite",
        colors: ["Titanium Slate Gray", "Carbon Gray DLC"]
    },

    // --- ACCESSORIES & GAMING ---
    {
        title: "Logitech MX Master 3S",
        brand: "Logitech",
        category: "accessories",
        price: 99,
        originalPrice: 119,
        discount: 17,
        image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80",
        description: "An icon remastered. Quiet Click switches, 8K DPI any-surface tracking, and MagSpeed electromagnetic scrolling.",
        features: [
            "MagSpeed scroll wheel scrolls 1,000 lines per second",
            "8,000 DPI Darkfield sensor tracks on any surface including glass",
            "Quiet Clicks eliminate 90% of click sound",
            "Ergonomic palm silhouette with intuitive thumb controls",
            "Flow cross-computer control between 3 computers"
        ],
        rating: 4.9,
        reviewsCount: 1250,
        inStock: true,
        tag: "Productivity King",
        colors: ["Graphite", "Pale Gray", "Space Black"]
    },
    {
        title: "Keychron Q1 Pro Wireless Mechanical",
        brand: "Keychron",
        category: "accessories",
        price: 199,
        originalPrice: 229,
        discount: 13,
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
        description: "Full CNC aluminum custom mechanical keyboard with double-gasket mount, QMK/VIA support, and Bluetooth 5.1 connectivity.",
        features: [
            "Solid 6063 CNC aluminum machined body",
            "Double-gasket mount design for supreme typing acoustic feel",
            "KSA double-shot PBT keycaps with Mac & Windows layout switch",
            "Hot-swappable PCB supports 3-pin and 5-pin MX switches",
            "Programmable rotary encoder knob"
        ],
        rating: 4.8,
        reviewsCount: 310,
        inStock: true,
        tag: "Custom Grade",
        colors: ["Carbon Black", "Silver Gray", "Shell White"]
    },
    {
        title: "LG UltraFine 27\" 4K UHD Monitor",
        brand: "LG",
        category: "accessories",
        price: 499,
        originalPrice: 599,
        discount: 17,
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
        description: "Professional-grade 4K IPS display with 99% sRGB color gamut, USB-C 90W Power Delivery, and ergonomic tilt/swivel/pivot stand.",
        features: [
            "27-inch 4K UHD (3840 x 2160) IPS panel",
            "USB Type-C with 90W Power Delivery laptop charging",
            "HDR10 with 99% sRGB color spectrum accuracy",
            "Virtually borderless 3-side sleek display",
            "Ergonomic stand with height, tilt, and 90° pivot adjustment"
        ],
        rating: 4.7,
        reviewsCount: 245,
        inStock: true,
        tag: "Pro Visuals",
        colors: ["Silver/White"]
    },
    {
        title: "Anker Prime 100W GaN Wall Charger",
        brand: "Anker",
        category: "accessories",
        price: 69,
        originalPrice: 84,
        discount: 18,
        image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80",
        description: "Ultra-compact 3-port charger powered by GaN technology. Fast-charge 2 laptops and a phone simultaneously with ActiveShield 2.0.",
        features: [
            "100W total maximum output with PowerIQ 4.0",
            "2x USB-C ports + 1x USB-A port",
            "43% smaller than standard 96W Apple charger",
            "ActiveShield 2.0 monitors temperature over 3 million times per day",
            "Foldable prongs for travel mobility"
        ],
        rating: 4.9,
        reviewsCount: 890,
        inStock: true,
        tag: "Fast Charging",
        colors: ["Black", "Titanium Gray"]
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for NovaStore seeding...");

        // Clear existing data
        await Product.deleteMany({});
        await User.deleteMany({});
        console.log("Cleared existing Products and Users.");

        // Create Admin user
        const adminHashedPassword = await bcrypt.hash("admin123", 10);
        const adminUser = await User.create({
            name: "NovaStore Administrator",
            email: "admin@novastore.com",
            password: adminHashedPassword,
            role: "admin"
        });
        console.log(`Created Admin user: ${adminUser.email} (password: admin123)`);

        // Create Demo Customer user
        const customerHashedPassword = await bcrypt.hash("demo123", 10);
        const demoUser = await User.create({
            name: "Alex Mercer",
            email: "demo@novastore.com",
            password: customerHashedPassword,
            role: "user"
        });
        console.log(`Created Customer user: ${demoUser.email} (password: demo123)`);

        // Insert sample products
        const createdProducts = await Product.insertMany(sampleProducts);
        console.log(`Successfully seeded ${createdProducts.length} multi-brand products into NovaStore!`);

        process.exit(0);
    } catch (err) {
        console.error("Error seeding NovaStore database:", err);
        process.exit(1);
    }
};

seedDB();
