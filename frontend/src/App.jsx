import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// المكونات الأساسية (Components)
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import BackToHomeButton from './components/BackToHomeButton';

// الصفحات (Pages)
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AddFood from './pages/AddFood';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import Reservations from './pages/Reservations';
import Partners from './pages/Partners';
import Settings from './pages/Settings';
import FoodDetails from './pages/FoodDetails';
import SpecialRequest from './pages/SpecialRequest';
import EditFood from './pages/EditFood';
import DonorReviewsPage from './pages/DonorReviewsPage';
import AdminReviewsPage from './pages/AdminReviewsPage'; 
import DonorOrdersPage from './pages/DonorOrdersPage';
import Datenschutz from './pages/Datenschutz';
import AdminMessages from './pages/AdminMessages'; 
import AdminSpecialRequests from './pages/AdminSpecialRequests';
import CheckoutPage from './pages/CheckoutPage'; 

// مدة الصلاحية: ساعة واحدة بالملي ثانية
const ONE_HOUR_MS = 1 * 60 * 60 * 1000;

// مكون حماية المسارات (ProtectedRoute)
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const loginTime = localStorage.getItem('loginTime');

  if (!token || !loginTime) {
    return <Navigate to="/login" replace />;
  }

  if (Date.now() - parseInt(loginTime, 10) > ONE_HOUR_MS) {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('user');
    localStorage.removeItem('loginTime');
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const [user, setUser] = useState(() => localStorage.getItem('username') || null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('user');
    localStorage.removeItem('loginTime');
    setUser(null);
  };

  const handleLogin = (username) => {
    setUser(username);
  };

  useEffect(() => {
    const checkAuthTimeout = () => {
      const loginTime = localStorage.getItem('loginTime');
      const token = localStorage.getItem('token');

      if (token && loginTime) {
        if (Date.now() - parseInt(loginTime, 10) > ONE_HOUR_MS) {
          handleLogout();
        } else {
          const storedUser = localStorage.getItem('username');
          if (storedUser) setUser(storedUser);
        }
      }
    };

    checkAuthTimeout();
    const interval = setInterval(checkAuthTimeout, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100 position-relative">
        <Navbar user={user} onLogout={handleLogout} />
        
        <div className="flex-grow-1">
          <Routes>
            {/* المسارات العامة */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/food/:id" element={<FoodDetails />} />
            <Route path="/special-request" element={<SpecialRequest />} />
            <Route path="/datenschutz" element={<Datenschutz />} />
            
            {/* مسار التبرع / الدفع الوهمي */}
            <Route path="/checkout" element={<CheckoutPage />} />

            {/* المسارات المحمية مع توحيد مسارات الأدمن */}
            <Route path="/admin/special-requests" element={<ProtectedRoute><AdminSpecialRequests /></ProtectedRoute>} />
            <Route path="/admin/messages" element={<ProtectedRoute><AdminMessages /></ProtectedRoute>} />
            <Route path="/admin-messages" element={<ProtectedRoute><AdminMessages /></ProtectedRoute>} />

            <Route path="/add-food" element={<ProtectedRoute><AddFood /></ProtectedRoute>} />
            <Route path="/add-listing" element={<ProtectedRoute><AddFood /></ProtectedRoute>} />
            <Route path="/edit-food/:id" element={<ProtectedRoute><EditFood /></ProtectedRoute>} />
            <Route path="/donor-orders" element={<ProtectedRoute><DonorOrdersPage /></ProtectedRoute>} />
            <Route path="/donor-reviews" element={<ProtectedRoute><DonorReviewsPage /></ProtectedRoute>} />
            <Route path="/admin-reviews" element={<ProtectedRoute><AdminReviewsPage /></ProtectedRoute>} />
            
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/reservations" element={<ProtectedRoute><Reservations /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

            {/* تحويل أي مسار غير معروف للصفحة الرئيسية لمنع الشاشة البيضاء */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {/* زر الرجوع للرئيسية الثابت فوق الفوتر لكل الصفحات الفرعية */}
        <div className="container my-3">
          <BackToHomeButton />
        </div>

        <ChatWidget />
        <Footer />
      </div>
    </Router>
  );
}

export default App;