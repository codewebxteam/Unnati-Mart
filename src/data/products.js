// Using a mix of local assets and high-quality Unsplash images for maximum variety and professional look
import prodBroccoli from '../assets/prod_broccoli.png';
import prodApples from '../assets/prod_apples.png';
import prodMilk from '../assets/prod_milk.png';
import prodRice from '../assets/prod_rice.png';

// Local Category Backdrops (Professionally Generated)
import catVeg from '../assets/cat_veg_alt.png';
import catFruits from '../assets/cat_fruits_alt.png';
import catPulses from '../assets/category_pulses.png';
import catOils from '../assets/category_oils.png';
import catDairy from '../assets/category_dairy.png';
import catCereals from '../assets/category_cereals.png';
import catGrains from '../assets/category_grains.png';
import catHygiene from '../assets/category_hygiene.png';
import catSnacks from '../assets/category_snacks.png';
import catMeat from '../assets/cat_meat_alt.png';
import catNuts from '../assets/cat_nuts_alt.png';

export const products = [
  // Vegetables
  { id: 1, name: 'Premium Organic Broccoli', price: '₹45', rating: 5, discount: '20% Off', img: prodBroccoli, category: 'Vegetables' },
  { id: 2, name: 'Fresh Green Spinach', price: '₹30', rating: 5, discount: '15% Off', img: catVeg, category: 'Vegetables', isDeal: true },
  { id: 3, name: 'Local Sweet Carrots', price: '₹55', rating: 4, discount: null, img: catVeg, category: 'Vegetables' },
  { id: 4, name: 'Organic Red Tomatoes', price: '₹40', rating: 5, discount: '10% Off', img: catVeg, category: 'Vegetables' },

  // Fruits
  { id: 9, name: 'Farm Fresh Red Apples', price: '₹120', rating: 4, discount: null, img: prodApples, category: 'Fruits' },
  { id: 10, name: 'Sweet Valencia Oranges', price: '₹90', rating: 4, discount: null, img: catFruits, category: 'Fruits', isDeal: true },
  { id: 11, name: 'Golden Bananas', price: '₹60', rating: 5, discount: '10% Off', img: catFruits, category: 'Fruits' },
  { id: 12, name: 'Fresh Pomegranate', price: '₹140', rating: 4, discount: null, img: catFruits, category: 'Fruits' },

  // Pulses & Dal
  { id: 50, name: 'Premium Toor Dal', price: '₹145', rating: 5, discount: null, img: catPulses, category: 'Pulses & Dal', isDeal: true },
  { id: 51, name: 'Organic Moong Dal', price: '₹130', rating: 4, discount: '5% Off', img: catPulses, category: 'Pulses & Dal' },

  // Cooking Oils
  { id: 53, name: 'Pure Mustard Oil (1L)', price: '₹185', rating: 5, discount: null, img: catOils, category: 'Cooking Oils', isDeal: true },
  { id: 54, name: 'Organic Sunflower Oil', price: '₹165', rating: 4, discount: '10% Off', img: catOils, category: 'Cooking Oils' },
  { id: 55, name: 'Pure Desi Ghee (500g)', price: '₹340', rating: 5, discount: null, img: catOils, category: 'Cooking Oils' },

  // Dairy & Eggs
  { id: 17, name: 'Pure Cow Milk (1L)', price: '₹65', rating: 5, discount: '10% Off', img: prodMilk, category: 'Dairy & Eggs' },
  { id: 18, name: 'Fresh Farm Brown Eggs', price: '₹75', rating: 5, discount: null, img: catDairy, category: 'Dairy & Eggs', isDeal: true },
  
  // Cereals
  { id: 40, name: 'Premium Corn Flakes', price: '₹180', rating: 5, discount: '10% Off', img: catCereals, category: 'Cereals' },
  { id: 41, name: 'Organic Fruit Muesli', price: '₹350', rating: 4, discount: null, img: catCereals, category: 'Cereals', isDeal: true },

  // Grains & Flour
  { id: 19, name: 'Long Grain Basmati Rice', price: '₹180', rating: 5, discount: null, img: prodRice, category: 'Grains & Flour' },
  { id: 56, name: 'Sona Masoori Rice (5kg)', price: '₹320', rating: 4, discount: '15% Off', img: catGrains, category: 'Grains & Flour' },

  // Spices
  { id: 30, name: 'Organic Turmeric Powder', price: '₹80', rating: 5, discount: null, img: catGrains, category: 'Spices' },
  { id: 57, name: 'Dhaniya Powder (Coriander)', price: '₹45', rating: 5, discount: null, img: catGrains, category: 'Spices', isDeal: true },
  { id: 58, name: 'Kashmiri Garam Masala', price: '₹60', rating: 5, discount: '10% Off', img: catGrains, category: 'Spices' },
  
  // Home & Hygiene
  { id: 59, name: 'Premium Herbal Soap (3pk)', price: '₹120', rating: 5, discount: null, img: catHygiene, category: 'Home & Hygiene', isDeal: true },
  { id: 60, name: 'Antiseptic Hand Wash (250ml)', price: '₹85', rating: 4, discount: '15% Off', img: catHygiene, category: 'Home & Hygiene' },

  // Organic Snacks
  { id: 45, name: 'Roasted Foxnuts (Makhana)', price: '₹180', rating: 5, discount: null, img: catSnacks, category: 'Organic Snacks' },
];

