import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set } from "firebase/database";
import dotenv from "dotenv";

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
  databaseURL: process.env.VITE_FIREBASE_DATABASE_URL,
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const products = [
    { name: 'Aashirvaad Superior Mp Atta', price: 245, stock: 100, category: 'Essential', unit: '5kg', image: 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=800&q=80' },
    { name: 'Shimla Apple - Royal Gala', price: 180, stock: 85, category: 'Farm Fresh', unit: '1kg', image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=800&q=80' },
    { name: 'Fresh Potato (Jyoti)', price: 40, stock: 120, category: 'Farm Fresh', unit: '1kg', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&q=80' },
    { name: 'Amul Gold Full Cream Milk', price: 66, stock: 50, category: 'Fresh', unit: '1L', image: 'https://images.unsplash.com/photo-1528750955925-53f5a173752c?w=800&q=80' },
    { name: 'Kurkure Masala Munch', price: 20, stock: 200, category: 'Spicy', unit: '90g', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=800&q=80' },
    { name: 'Coca-Cola Original Less Sugar', price: 40, stock: 150, category: 'Chilled', unit: '750ml', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80' },
    { name: 'Dove Cream Beauty Bar Soap', price: 150, stock: 60, category: 'Gentle', unit: '3x100g', image: 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=800&q=80' },
    { name: 'Surf Excel Matic Top Load Detergent', price: 210, stock: 40, category: 'Power Clean', unit: '1kg', image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=800&q=80' }
];

async function seed() {
    console.log("Seeding products with absolute verified imagery...");
    const prodRef = ref(db, 'products');
    await set(prodRef, {}); // Clear products
    for (const prod of products) {
        const status = prod.stock === 0 ? 'Out of Stock' : prod.stock < 10 ? 'Low Stock' : 'Active';
        const newProdRef = push(prodRef);
        await set(newProdRef, { ...prod, status, createdAt: new Date().toISOString() });
        console.log(`Added: ${prod.name}`);
        await new Promise(r => setTimeout(r, 100));
    }
    console.log("Seeding complete!");
    process.exit(0);
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
