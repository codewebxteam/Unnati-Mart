import React, {
    createContext,
    useContext,
    useReducer,
    useEffect,
} from 'react';

const WishlistContext = createContext();

const wishlistReducer = (state, action) => {
    switch (action.type) {
        case 'TOGGLE_WISHLIST': {
            const exists = state.find(
                (item) =>
                    item.id === action.payload.id &&
                    item.category === action.payload.category
            );

            if (exists) {
                return state.filter(
                    (item) =>
                        !(
                            item.id === action.payload.id &&
                            item.category === action.payload.category
                        )
                );
            }

            return [...state, action.payload];
        }

        case 'REMOVE_FROM_WISHLIST':
            return state.filter(
                (item) =>
                    !(
                        item.id === action.payload.id &&
                        item.category === action.payload.category
                    )
            );

        case 'CLEAR_WISHLIST':
            return [];

        default:
            return state;
    }
};

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, dispatch] = useReducer(wishlistReducer, [], () => {
        const saved = localStorage.getItem('unnatimart_wishlist');
        return saved ? JSON.parse(saved) : [];
    });

    // Persist wishlist
    useEffect(() => {
        localStorage.setItem('unnatimart_wishlist', JSON.stringify(wishlistItems));
    }, [wishlistItems]);

    const toggleWishlist = (product) => {
        dispatch({ type: 'TOGGLE_WISHLIST', payload: product });
    };

    const removeFromWishlist = (id, category) => {
        dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: { id, category } });
    };

    const isInWishlist = (id, category) => {
        return wishlistItems.some(
            (item) => item.id === id && item.category === category
        );
    };

    const value = {
        wishlistItems,
        toggleWishlist,
        removeFromWishlist,
        isInWishlist,
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};

export default WishlistContext;
