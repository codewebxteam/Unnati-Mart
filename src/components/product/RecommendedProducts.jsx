import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { realtimeDb as db } from '../../firebase';
import { ref, onValue } from 'firebase/database';
import { dummyProducts } from '../../data/dummyProducts';
import ProductCard from './ProductCard';

const RecommendedProducts = ({ currentProductId, category }) => {
    const navigate = useNavigate();
    const { user, openAuthModal } = useAuth();

    const [firebaseProducts, setFirebaseProducts] = useState([]);

    useEffect(() => {
        const productsRef = ref(db, 'products');
        const unsubscribe = onValue(productsRef, (snapshot) => {
            const data = snapshot.val() || {};
            const list = Object.keys(data).map(key => ({
                ...data[key],
                id: key,
                img: data[key].img || data[key].image || 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=500',
                unit: data[key].unit || 'Kg'
            }));
            setFirebaseProducts(list);
        });
        return () => unsubscribe();
    }, []);

    const isMushroom = String(category || '').toLowerCase().includes('mushroom');
    const isDairy = String(category || '').toLowerCase().includes('dairy');

    const allProducts = [
        ...firebaseProducts,
        ...Object.values(dummyProducts).flat()
    ];

    const recommended = allProducts
        .filter(p => {
            if (p.id === currentProductId) return false;
            return String(p.category || '').toLowerCase() === String(category || '').toLowerCase();
        })
        .slice(0, 4);

    if (recommended.length === 0) return null;

    return (
        <section className="py-20 border-t border-slate-100 mt-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center text-center gap-2 mb-12">
                    <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-tight">
                        You Might <span className="text-amber-600">Also Like.</span>
                    </h3>
                    <p className="text-sm text-slate-500 font-semibold">
                        Handpicked recommendations from the {category} category
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {recommended.map((item) => (
                        <ProductCard key={item.id} product={item} />
                    ))}
                </div>


                <div className="flex justify-center mt-12">
                    <button
                        onClick={() => navigate('/categories')}
                        className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all group"
                    >
                        Explore More Categories
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default RecommendedProducts;

