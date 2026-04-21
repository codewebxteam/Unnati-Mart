import { realtimeDb as db } from './src/firebase';
import { ref, get } from 'firebase/database';

async function listProducts() {
    try {
        const snapshot = await get(ref(db, 'products'));
        if (snapshot.exists()) {
            const data = snapshot.val();
            console.log("--- PRODUCT LIST ---");
            Object.entries(data).forEach(([id, p]) => {
                console.log(`ID: ${id}`);
                console.log(`Name: ${p.name}`);
                console.log(`Image: ${p.img || p.image || 'NONE'}`);
                console.log("-------------------");
            });
        } else {
            console.log("No products found.");
        }
    } catch (err) {
        console.error(err);
    }
}

// Note: This script won't run directly here because it needs the firebase config and node environment.
// I'll just use it as a reference or try to find a way to see the data.
