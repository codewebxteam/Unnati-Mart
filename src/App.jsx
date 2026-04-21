import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";

// Layout Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import FloatingCartButton from "./components/common/FloatingCartButton";
import Loader from "./components/common/Loader";
import ToastContainer from "./components/common/ToastContainer";

// Pages
import FoundationHome from "./pages/foundation/home";
import Gallery from "./pages/Gallery";
import CartPage from "./pages/cart/CartPage";
import Dashboard from "./pages/profile/dashboard";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import OrdersPage from "./pages/profile/OrdersPage";
import WishlistPage from "./pages/profile/WishlistPage";
import ProductDetail from "./components/product/ProductDetail";
import Success from "./pages/Success";
import Categories from "./pages/category/Categories";
import About from "./pages/About";
import CategoryProducts from "./pages/category/CategoryProducts";
import Maintenance from "./pages/Maintenance";
import { realtimeDb as db } from "./firebase";
import { ref, onValue } from "firebase/database";



// Context Providers
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

// Admin Pages
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminInventory from "./pages/admin/AdminInventory";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminCategories from "./pages/admin/AdminCategories";

// Protect Admin Routes
const AdminProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader />;
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" state={{ from: location, fromAdmin: true }} replace />;
  }
  return children;
};

function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const [settings, setSettings] = React.useState({});
  const [settingsLoading, setSettingsLoading] = React.useState(true);

  React.useEffect(() => {
    const settingsRef = ref(db, 'settings');
    const unsubscribe = onValue(settingsRef, (snapshot) => {
      if (snapshot.exists()) {
        setSettings(snapshot.val());
      }
      setSettingsLoading(false);
    }, (error) => {
      console.error("Settings fetch error:", error);
      setSettingsLoading(false);
    });

    // Safety timeout: If settings take too long, continue anyway
    const timeout = setTimeout(() => {
      setSettingsLoading(false);
    }, 5000);

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isMaintenanceMode = settings?.maintenanceMode === true;
  const isUserAdmin = user?.role === 'admin';

  if (authLoading || settingsLoading) return <Loader />;

  // Show maintenance page if mode is active and user is not admin
  // But always allow admin routes to be accessed by admins
  if (isMaintenanceMode && !isUserAdmin && !isAdminRoute && location.pathname !== '/login') {
    return <Maintenance />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {!isAdminRoute && <Header />}

      {/* Main Content */}
      <main className="flex-grow">
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<FoundationHome />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Dashboard />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/about" element={<About />} />

          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/category/:categoryPath" element={<CategoryProducts />} />
          <Route path="/products" element={<CategoryProducts />} />
          <Route path="/grocery" element={<CategoryProducts />} />
          <Route path="/fruits" element={<CategoryProducts />} />
          <Route path="/vegetables" element={<CategoryProducts />} />
          <Route path="/dairy" element={<CategoryProducts />} />
          <Route path="/snacks" element={<CategoryProducts />} />
          <Route path="/beverages" element={<CategoryProducts />} />
          <Route path="/personal-care" element={<CategoryProducts />} />
          <Route path="/household" element={<CategoryProducts />} />
          <Route path="/wellness" element={<CategoryProducts />} />
          <Route path="/baby" element={<CategoryProducts />} />
          <Route path="/dry-fruits" element={<CategoryProducts />} />
          <Route path="/success" element={<Success />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="reports" element={<AdminDashboard />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="*" element={<AdminDashboard />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<FoundationHome />} />
        </Routes>
      </main>

      {/* Global Footer */}
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <FloatingCartButton />}
      <ToastContainer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
export default App;