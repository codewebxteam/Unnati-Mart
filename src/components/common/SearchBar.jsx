import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { realtimeDb as db } from '../../firebase';
import { ref, onValue } from 'firebase/database';
import { Link } from 'react-router-dom';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [firebaseProducts, setFirebaseProducts] = useState([]);

  // Fetch products for search
  useEffect(() => {
    const productsRef = ref(db, 'products');
    const unsubscribe = onValue(productsRef, (snap) => {
      const data = snap.val();
      if (data) {
        setFirebaseProducts(Object.entries(data).map(([id, val]) => ({
          ...val,
          id,
          img: val.img || val.image || 'https://images.unsplash.com/photo-1550583794-a2b7142647ec?w=500'
        })));
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = firebaseProducts.filter(product =>
      product.name.toLowerCase().includes(query) ||
      (product.category || '').toLowerCase().includes(query) ||
      (product.tag || '').toLowerCase().includes(query) ||
      (product.description || '').toLowerCase().includes(query)
    );

    setSearchResults(results.slice(0, 6)); // Limit to 6 results
    setShowResults(true);
  }, [searchQuery, firebaseProducts]);

  const handleClear = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  const handleProductClick = () => {
    handleClear();
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Search Input Container */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
          <Search size={20} />
        </div>

        <input
          type="text"
          placeholder="Search for mushrooms, dairy products, or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery && setShowResults(true)}
          className="w-full pl-12 pr-12 py-4 lg:py-5 rounded-2xl border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-300 text-sm lg:text-base shadow-sm hover:shadow-md"
        />

        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-lg border border-slate-200 z-50 max-h-96 overflow-y-auto">
          <div className="p-3">
            {searchResults.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                onClick={handleProductClick}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200 group"
              >
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-slate-900 group-hover:text-amber-600 transition-colors">
                    {product.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {product.category}
                    </span>
                    {product.tag && (
                      <span className="text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                        {product.tag}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">₹{product.price}</p>
                  <p className="text-[11px] text-slate-500">{product.unit}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* View All Results Link */}
          <div className="border-t border-slate-200 p-3 bg-slate-50 rounded-b-2xl">
            <button className="w-full text-center text-sm font-semibold text-amber-600 hover:text-amber-700 py-2 transition-colors">
              View all results for "{searchQuery}"
            </button>
          </div>
        </div>
      )}

      {/* No Results Message */}
      {showResults && searchResults.length === 0 && searchQuery && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-lg border border-slate-200 z-50 p-6 text-center">
          <p className="text-slate-500 text-sm">
            No results found for "<span className="font-semibold text-slate-700">{searchQuery}</span>"
          </p>
          <p className="text-[12px] text-slate-400 mt-2">
            Try searching for "mushroom", "dairy", or product names
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;

