import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Header';
import CartModal from './components/CartModal';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CartPage from './pages/CartPage';
import PaymentPage from './pages/PaymentPage';
import OrderSuccessPage from './pages/OrderSuccessPage';

function App() {
  const [showCart, setShowCart] = useState(false);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={
                <>
                  <Header onCartClick={() => setShowCart(true)} />
                  <HomePage />
                  <Footer />
                </>
              } />
              <Route path="/about" element={
                <>
                  <Header />
                  <AboutPage />
                  <Footer />
                </>
              } />
              <Route path="/contact" element={
                <>
                  <Header />
                  <ContactPage />
                  <Footer />
                </>
              } />
              <Route path="/cart" element={
                <>
                  <Header />
                  <CartPage />
                  <Footer />
                </>
              } />
              <Route path="/payment" element={
                <>
                  <Header />
                  <PaymentPage />
                  <Footer />
                </>
              } />
              <Route path="/order-success" element={
                <>
                  <Header />
                  <OrderSuccessPage />
                  <Footer />
                </>
              } />
            </Routes>

            {/* Cart Modal for home page */}
            {showCart && (
              <CartModal onClose={() => setShowCart(false)} />
            )}
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

const Footer: React.FC = () => (
  <footer className="bg-gray-900 text-white py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">QuickEats</h3>
          <p className="text-gray-400">
            The smartest food delivery platform with optimized routing technology.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li><a href="/" className="hover:text-white transition-colors">Restaurants</a></li>
            <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#help" className="hover:text-white transition-colors">Help Center</a></li>
            <li><a href="#terms" className="hover:text-white transition-colors">Terms of Service</a></li>
            <li><a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
          <div className="space-y-2 text-gray-400">
            <p>📞 +1 (555) 123-4567</p>
            <p>📧 support@quickeats.com</p>
            <p>📍 123 Food Street, NYC</p>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
        <p>&copy; 2025 QuickEats. All rights reserved. Powered by Dijkstra's Algorithm.</p>
      </div>
    </div>
  </footer>
);

export default App;