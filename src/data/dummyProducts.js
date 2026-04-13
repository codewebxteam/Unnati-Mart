import attaImg from '../assets/products/atta.png';
import oilImg from '../assets/products/oil.png';
import appleImg from '../assets/products/apple.png';
import milkImg from '../assets/products/milk.png';
import snacksImg from '../assets/products/snacks.png';
import beverageImg from '../assets/products/beverage.png';
import soapImg from '../assets/products/soap.png';
import detergentImg from '../assets/products/detergent.png';
import healthImg from '../assets/products/health.png';
import diapersImg from '../assets/products/diapers.png';
import nutsImg from '../assets/products/nuts.png';

export const dummyProducts = {
    'grocery': [
        {
            id: 'g1',
            name: 'Aashirvaad Superior MP Atta',
            price: 245,
            description: 'Aashirvaad Superior MP Atta is made from the grains which are heavy on the palm, golden amber in colour and hard in bite.',
            img: attaImg,
            category: 'Grocery & Staples',
            unit: '5Kg',
            tag: 'Essential',
            highlights: ['100% Whole Wheat', 'Stone Ground', 'High Fiber Content', 'No Added Preservatives'],
            specifications: [
                { label: 'Brand', value: 'Aashirvaad' },
                { label: 'Weight', value: '5Kg' },
                { label: 'Type', value: 'Whole Wheat Atta' },
                { label: 'Shelf Life', value: '4 Months' },
                { label: 'Storage', value: 'Store in cool and dry place' }
            ],
            reviews: [
                { id: 1, user: 'Deepak S.', rating: 5, comment: 'The best atta ever. Rotis stay soft for a long time.', date: '2024-03-15' },
                { id: 2, user: 'Priya M.', rating: 4, comment: 'Very high quality, but packaging could be better.', date: '2024-03-10' }
            ]
        },
        {
            id: 'g2',
            name: 'Fortune Sunlite Refined Sunflower Oil',
            price: 155,
            description: 'Fortune Sunlite Refined Sunflower Oil is a healthy and nutritious oil. It is rich in vitamins and low in saturated fats.',
            img: oilImg,
            category: 'Grocery & Staples',
            unit: '1L',
            tag: 'Top Rated',
            highlights: ['Vitamin A & D Enriched', 'Low in Saturated Fats', 'High Smoke Point', 'Heart Healthy'],
            specifications: [
                { label: 'Brand', value: 'Fortune' },
                { label: 'Volume', value: '1Litre' },
                { label: 'Type', value: 'Sunflower Oil' },
                { label: 'Shelf Life', value: '9 Months' }
            ],
            reviews: [
                { id: 1, user: 'Amit K.', rating: 5, comment: 'Light and neutral taste. Perfect for daily cooking.', date: '2024-03-12' }
            ]
        },
        {
            id: 'g3',
            name: 'Tata Salt - Vacuum Evaporated Iodised Salt',
            price: 28,
            description: 'Tata Salt is known for its purity and consistent quality. It is vacuum evaporated iodised salt.',
            img: 'https://images.unsplash.com/photo-1626082895617-2c6de3476af7?w=800&auto=format&fit=crop',
            category: 'Grocery & Staples',
            unit: '1Kg',
            tag: 'Purity'
        },
        {
            id: 'g4',
            name: 'Daawat Rozana Super Basmati Rice',
            price: 395,
            description: 'Daawat Rozana Super is the finest Basmati rice in the mid-price segment. It is specially processed for daily consumption.',
            img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop',
            category: 'Grocery & Staples',
            unit: '5Kg',
            tag: 'Premium'
        }
    ],
    'fruits': [
        {
            id: 'f1',
            name: 'Shimla Apple - Royal Gala',
            price: 180,
            description: 'Fresh and crunchy Shimla apples. Perfect for a healthy snack.',
            img: appleImg,
            category: 'Fresh Fruits',
            unit: '1Kg',
            tag: 'Farm Fresh',
            highlights: ['Direct from Orchards', 'Wax-free Skin', 'Sweet & Juicy', 'Rich in Fiber'],
            specifications: [
                { label: 'Origin', value: 'Shimla' },
                { label: 'Variety', value: 'Royal Gala' },
                { label: 'Weight', value: '1Kg' },
                { label: 'Type', value: 'Fresh Fruit' }
            ],
            reviews: [
                { id: 1, user: 'Rahul V.', rating: 5, comment: 'Extremely fresh and crunchy. Highly recommended!', date: '2024-03-18' },
                { id: 2, user: 'Ananya G.', rating: 5, comment: 'Best apples I have had in a long time.', date: '2024-03-16' }
            ]
        },
        {
            id: 'f2',
            name: 'Banana - Robusta',
            price: 60,
            description: 'Naturally ripened Robusta bananas. Rich in potassium.',
            img: 'https://images.unsplash.com/photo-1571771894821-ad9961135b46?w=800&auto=format&fit=crop',
            category: 'Fresh Fruits',
            unit: '1 Dozen',
            tag: 'Daily'
        },
        {
            id: 'f3',
            name: 'Valencia Orange',
            price: 120,
            description: 'Sweet and juicy Valencia oranges, imported for the best quality.',
            img: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=800&auto=format&fit=crop',
            category: 'Fresh Fruits',
            unit: '1Kg',
            tag: 'Juicy'
        },
        {
            id: 'f4',
            name: 'Alphonso Mango (Hapus)',
            price: 600,
            description: 'The king of mangoes. Extremely sweet and aromatic.',
            img: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&auto=format&fit=crop',
            category: 'Fresh Fruits',
            unit: '1 Dozen',
            tag: 'Seasonal'
        }
    ],
    'vegetables': [
        {
            id: 'v1',
            name: 'Fresh Potato (Jyoti)',
            price: 40,
            description: 'Fresh and clean potatoes, sourced directly from farms.',
            img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop',
            category: 'Vegetables',
            unit: '1Kg',
            tag: 'Farm Fresh',
            highlights: ['Naturally Grown', 'Pesticide Free', 'Long Shelf Life', 'Direct from Punjab'],
            specifications: [
                { label: 'Type', value: 'Jyoti Potato' },
                { label: 'Weight', value: '1Kg' },
                { label: 'Storage', value: 'Cool & Dry Place' }
            ]
        },
        {
            id: 'v2',
            name: 'Red Tomato (Hybrid)',
            price: 50,
            description: 'Plump and red hybrid tomatoes. Perfect for salads and curries.',
            img: 'https://images.unsplash.com/photo-1546473427-e1ad6c448144?w=800&auto=format&fit=crop',
            category: 'Vegetables',
            unit: '1Kg',
            tag: 'Organic',
            highlights: ['Juicy & Firm', 'Rich in Lycopene', 'No Chemicals', 'Kitchen Essential'],
            specifications: [
                { label: 'Type', value: 'Hybrid' },
                { label: 'Weight', value: '1Kg' },
                { label: 'Usage', value: 'Cooking & Salads' }
            ]
        },
        {
            id: 'v3',
            name: 'Onion (Nasik)',
            price: 35,
            description: 'Best quality red onions from Nasik. Long shelf life.',
            img: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=800&auto=format&fit=crop',
            category: 'Vegetables',
            unit: '1Kg',
            tag: 'Pantry Must'
        },
        {
            id: 'v4',
            name: 'Cauliflower (Gobhi)',
            price: 45,
            description: 'Fresh and white cauliflower heads. Free from insects.',
            img: 'https://images.unsplash.com/photo-1510627489930-0c1b0ba0431f?w=800&auto=format&fit=crop',
            category: 'Vegetables',
            unit: '1 Piece',
            tag: 'Seasonal'
        },
        {
            id: 'v5',
            name: 'Green Chili (Hari Mirch)',
            price: 15,
            description: 'Spicy and fresh green chilies to add heat to your dishes.',
            img: 'https://images.unsplash.com/photo-1588253511790-da768652cc2a?w=800&auto=format&fit=crop',
            category: 'Vegetables',
            unit: '100g',
            tag: 'Fresh'
        },
        {
            id: 'v6',
            name: 'Ginger (Adrak)',
            price: 30,
            description: 'Premium quality fresh ginger root for cooking and tea.',
            img: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=800&auto=format&fit=crop',
            category: 'Vegetables',
            unit: '250g',
            tag: 'Nutritious'
        }
    ],
    'dairy': [
        {
            id: 'd1',
            name: 'Amul Gold Full Cream Milk',
            price: 66,
            description: 'Pasteurized full cream milk, rich and creamy.',
            img: milkImg,
            category: 'Dairy & Bakery',
            unit: '1L',
            tag: 'Fresh',
            highlights: ['Homogenized Milk', 'High Protein', 'Rich in Calcium', 'No Preservatives'],
            specifications: [
                { label: 'Brand', value: 'Amul' },
                { label: 'Volume', value: '1Litre' },
                { label: 'Type', value: 'Full Cream' },
                { label: 'Fat Content', value: '6% Minimum' }
            ],
            reviews: [
                { id: 1, user: 'Suresh B.', rating: 5, comment: 'Amul Gold is my favorite for morning tea.', date: '2024-03-14' },
                { id: 2, user: 'Indra J.', rating: 4, comment: 'Trusted quality as always.', date: '2024-03-11' }
            ]
        },
        {
            id: 'd2',
            name: 'Amul Fresh Paneer',
            price: 90,
            description: 'Soft and fresh paneer made from pure milk.',
            img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop',
            category: 'Dairy & Bakery',
            unit: '200g',
            tag: 'Premium'
        },
        {
            id: 'd3',
            name: 'Britannia Toastea Premium Bake Rusk',
            price: 45,
            description: 'Crunchy and crispy rusk. Perfect with your evening tea.',
            img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop',
            category: 'Dairy & Bakery',
            unit: '300g',
            tag: 'Tea Time'
        },
        {
            id: 'd4',
            name: 'Mother Dairy Classic Curd',
            price: 35,
            description: 'Thick and tasty classic curd. No preservatives.',
            img: 'https://images.unsplash.com/photo-1485962391945-424a33a844b5?w=800&auto=format&fit=crop',
            category: 'Dairy & Bakery',
            unit: '400g',
            tag: 'Healthy'
        }
    ],
    'snacks': [
        {
            id: 's1',
            name: 'Kurkure Masala Munch',
            price: 20,
            description: 'Crispy and spicy snack made from corn.',
            img: snacksImg,
            category: 'Packaged Food & Snacks',
            unit: '80g',
            tag: 'Spicy',
            highlights: ['Taro-style Crunch', 'Indian Spices', 'Zero Trans Fat', 'No Artificial Colors'],
            specifications: [
                { label: 'Brand', value: 'Kurkure' },
                { label: 'Weight', value: '80g' },
                { label: 'Flavor', value: 'Masala Munch' },
                { label: 'Ingredients', value: 'Corn Meal, Rice Meal' }
            ]
        },
        {
            id: 's2',
            name: 'Lays Magic Masala Chips',
            price: 20,
            description: 'Classic potato chips with a magic masala twist.',
            img: 'https://images.unsplash.com/photo-1566478431375-7ef4a88052e4?w=800&auto=format&fit=crop',
            category: 'Packaged Food & Snacks',
            unit: '50g',
            tag: 'Classic'
        },
        {
            id: 's3',
            name: 'Cadbury Dairy Milk Silk',
            price: 80,
            description: 'Irresistibly smooth and creamy chocolate.',
            img: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800&auto=format&fit=crop',
            category: 'Packaged Food & Snacks',
            unit: '60g',
            tag: 'Sweet'
        },
        {
            id: 's4',
            name: 'Oreo Vanilla Sandwich Biscuits',
            price: 40,
            description: 'Crunchy cocoa cookies with smooth vanilla cream.',
            img: 'https://images.unsplash.com/photo-1558961363-fa4fdfc51f05?w=800&auto=format&fit=crop',
            category: 'Packaged Food & Snacks',
            unit: '120g',
            tag: 'Favorite'
        }
    ],
    'beverages': [
        {
            id: 'b1',
            name: 'Coca-Cola Original Less Sugar',
            price: 40,
            description: 'The classic refreshing cola taste.',
            img: beverageImg,
            category: 'Beverages',
            unit: '750ml',
            tag: 'Chilled',
            highlights: ['Carbonated Soft Drink', 'Original Taste', 'Serve Chilled', 'Recyclable Bottle'],
            specifications: [
                { label: 'Brand', value: 'Coca-Cola' },
                { label: 'Volume', value: '750ml' },
                { label: 'Sugar Content', value: 'Reduced' },
                { label: 'Type', value: 'Beverage' }
            ]
        },
        {
            id: 'b2',
            name: 'Nescafe Classic Instant Coffee',
            price: 155,
            description: 'Pure coffee with an unmistakable taste.',
            img: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop',
            category: 'Beverages',
            unit: '50g',
            tag: 'Breakfast'
        },
        {
            id: 'b3',
            name: 'Red Bull Energy Drink',
            price: 110,
            description: 'Vitalizes body and mind.',
            img: 'https://images.unsplash.com/photo-1596448408588-bb161049f4c1?w=800&auto=format&fit=crop',
            category: 'Beverages',
            unit: '250ml',
            tag: 'Energy'
        },
        {
            id: 'b4',
            name: 'Real Fruit Power Mixed Fruit Juice',
            price: 105,
            description: 'Goodness of 9 fruits in every sip.',
            img: 'https://images.unsplash.com/photo-1600271886342-dc04d7049dc4?w=800&auto=format&fit=crop',
            category: 'Beverages',
            unit: '1L',
            tag: 'Healthy'
        }
    ],
    'personal-care': [
        {
            id: 'p1',
            name: 'Dove Cream Beauty Bar Soap',
            price: 150,
            description: 'Milder than any ordinary soap.',
            img: soapImg,
            category: 'Personal Care & Hygiene',
            unit: '3x100g',
            tag: 'Gentle',
            highlights: ['1/4 Moisturising Cream', 'Dermatologically Tested', 'Ph Neutral', 'Soft Skin Feel'],
            specifications: [
                { label: 'Brand', value: 'Dove' },
                { label: 'Weight', value: '300g (3x100g)' },
                { label: 'Skin Type', value: 'Sensitive' },
                { label: 'Type', value: 'Beauty Bar' }
            ]
        },
        {
            id: 'p2',
            name: 'Head & Shoulders Anti-Dandruff Shampoo',
            price: 180,
            description: 'Cool Menthol for a refreshing feel.',
            img: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop',
            category: 'Personal Care & Hygiene',
            unit: '180ml',
            tag: 'Care'
        },
        {
            id: 'p3',
            name: 'Colgate MaxFresh Toothpaste',
            price: 95,
            description: 'Power of spicy fresh peppermint strips.',
            img: 'https://images.unsplash.com/photo-1559594482-7c2490ec6ef0?w=800&auto=format&fit=crop',
            category: 'Personal Care & Hygiene',
            unit: '150g',
            tag: 'Fresh'
        },
        {
            id: 'p4',
            name: 'Nivea Soft Light Moisturiser',
            price: 160,
            description: 'Non-greasy moisturisation for face, hands and body.',
            img: 'https://images.unsplash.com/photo-1552046122-03184de85e08?w=800&auto=format&fit=crop',
            category: 'Personal Care & Hygiene',
            unit: '200ml',
            tag: 'Skin Care'
        },
        {
            id: 'p5',
            name: 'Dettol Original Handwash',
            price: 99,
            description: 'Protects against 100 illness-causing germs.',
            img: 'https://images.unsplash.com/photo-1584622781564-1d9876a1efd1?w=800&auto=format&fit=crop',
            category: 'Personal Care & Hygiene',
            unit: '200ml',
            tag: 'Protection'
        },
        {
            id: 'p6',
            name: 'Pears Pure and Gentle Soap',
            price: 145,
            description: 'Enriched with 98% pure glycerin and natural oils.',
            img: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=800&auto=format&fit=crop',
            category: 'Personal Care & Hygiene',
            unit: '3x125g',
            tag: 'Pure'
        }
    ],
    'household': [
        {
            id: 'h1',
            name: 'Surf Excel Matic Top Load Detergent',
            price: 210,
            description: 'Removes tough stains in machines.',
            img: detergentImg,
            category: 'Household & Cleaning Products',
            unit: '1Kg',
            tag: 'Power Clean',
            highlights: ['Stain Removal Technology', 'Machine Safe', 'Whiteness Booster', 'Pleasant Fragrance'],
            specifications: [
                { label: 'Brand', value: 'Surf Excel' },
                { label: 'Weight', value: '1Kg' },
                { label: 'Usage', value: 'Top Load Machines' },
                { label: 'Type', value: 'Powder Detergent' }
            ]
        },
        {
            id: 'h2',
            name: 'Harpic Disinfectant Toilet Cleaner',
            price: 175,
            description: 'Kills 99.9% germs and removes stains.',
            img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop',
            category: 'Household & Cleaning Products',
            unit: '1L',
            tag: 'Hygienic'
        },
        {
            id: 'h3',
            name: 'Lizol Disinfectant Floor Cleaner',
            price: 199,
            description: 'Floral fragrance with germ protection.',
            img: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&auto=format&fit=crop',
            category: 'Household & Cleaning Products',
            unit: '975ml',
            tag: 'Fragrant'
        },
        {
            id: 'h4',
            name: 'Vim Dishwash Liquid Gel',
            price: 155,
            description: 'Power of 100 lemons for grease-free dishes.',
            img: 'https://images.unsplash.com/photo-1585832770481-4d5212dd2744?w=800&auto=format&fit=crop',
            category: 'Household & Cleaning Products',
            unit: '750ml',
            tag: 'Shiny'
        }
    ],
    'wellness': [
        {
            id: 'w1',
            name: 'Dabur Chyawanprash',
            price: 360,
            description: 'Immunity booster with the goodness of Amla.',
            img: healthImg,
            category: 'Health & Wellness',
            unit: '1Kg',
            tag: 'Immunity'
        },
        {
            id: 'w2',
            name: 'Revital H Multivitamin Capsules',
            price: 280,
            description: 'Daily health supplement with Ginseng.',
            img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop',
            category: 'Health & Wellness',
            unit: '30 Caps',
            tag: 'Energy'
        },
        {
            id: 'w3',
            name: 'Patanjali Pure Honey',
            price: 135,
            description: '100% pure honey from natural hives.',
            img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop',
            category: 'Health & Wellness',
            unit: '500g',
            tag: 'Pure'
        },
        {
            id: 'w4',
            name: 'Tetley Green Tea - Ginger, Mint \u0026 Lemon',
            price: 160,
            description: 'Detox tea rich in antioxidants.',
            img: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop',
            category: 'Health & Wellness',
            unit: '25 Bags',
            tag: 'Detox'
        }
    ],
    'baby': [
        {
            id: 'ba1',
            name: 'Pampers Active Baby Diapers',
            price: 650,
            description: 'Soft like silk with wetness indicator.',
            img: diapersImg,
            category: 'Baby Care Products',
            unit: 'L - 44 Pcs',
            tag: 'Comfort'
        },
        {
            id: 'ba2',
            name: 'Johnson\'s Baby Lotion',
            price: 165,
            description: 'Gentle moisturiser for baby\'s soft skin.',
            img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop',
            category: 'Baby Care Products',
            unit: '200ml',
            tag: 'Gentle'
        },
        {
            id: 'ba3',
            name: 'Himalaya Baby Wipes',
            price: 120,
            description: 'Extra soft wipes with Aloe Vera \u0026 Indian Lotus.',
            img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop',
            category: 'Baby Care Products',
            unit: '72 Pcs',
            tag: 'Safe'
        },
        {
            id: 'ba4',
            name: 'Cerelac Wheat Apple Cherry',
            price: 195,
            description: 'Iron fortified baby cereal for 8 months+.',
            img: 'https://images.unsplash.com/photo-1594498653385-d5172c532c00?w=800&auto=format&fit=crop',
            category: 'Baby Care Products',
            unit: '300g',
            tag: 'Nutrition'
        }
    ],
    'dry-fruits': [
        {
            id: 'df1',
            name: 'California Almonds (Badam)',
            price: 450,
            description: 'Premium quality California almonds, crunchy and nutritious.',
            img: nutsImg,
            category: 'Dry Fruits & nuts',
            unit: '500g',
            tag: 'Premium',
            highlights: ['Handpicked Quality', 'Omega-3 Rich', 'Vacuum Packed', 'Natural & Unroasted'],
            specifications: [
                { label: 'Grade', value: 'Premium' },
                { label: 'Origin', value: 'California' },
                { label: 'Weight', value: '500g' },
                { label: 'Packaging', value: 'Pouch' }
            ]
        },
        {
            id: 'df2',
            name: 'Whole Cashews (Kaju)',
            price: 420,
            description: 'W240 grade cashews, rich and buttery.',
            img: 'https://images.unsplash.com/photo-1590005024862-6b67679a29fb?w=800&auto=format&fit=crop',
            category: 'Dry Fruits & nuts',
            unit: '500g',
            tag: 'Sweet'
        },
        {
            id: 'df3',
            name: 'Black Raisins (Kishmish)',
            price: 180,
            description: 'Seedless black raisins, high in iron.',
            img: 'https://images.unsplash.com/photo-1599589334812-70b777a83d0d?w=800&auto=format&fit=crop',
            category: 'Dry Fruits & nuts',
            unit: '250g',
            tag: 'Iron Rich'
        },
        {
            id: 'df4',
            name: 'Walnut Kernels (Akhrot)',
            price: 550,
            description: 'Light colour snow white walnut kernels.',
            img: 'https://images.unsplash.com/photo-1623930154466-267958693898?w=800&auto=format&fit=crop',
            category: 'Dry Fruits & nuts',
            unit: '250g',
            tag: 'Brain Food'
        },
        {
            id: 'df5',
            name: 'Premium Pistachios (Pista)',
            price: 360,
            description: 'Salted and roasted premium pistachios.',
            img: 'https://images.unsplash.com/photo-1597463945417-74070a93fcfd?w=800&auto=format&fit=crop',
            category: 'Dry Fruits & nuts',
            unit: '250g',
            tag: 'Roasted'
        },
        {
            id: 'df6',
            name: 'Dried Figs (Anjeer)',
            price: 299,
            description: 'Sweet and nutritious dried figs from Afghanistan.',
            img: 'https://images.unsplash.com/photo-1621344449830-9b3de342f534?w=800&auto=format&fit=crop',
            category: 'Dry Fruits & nuts',
            unit: '250g',
            tag: 'Healthy'
        }
    ]
};
