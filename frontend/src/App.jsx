import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AddFood from './pages/AddFood';
import Footer from './components/Footer';
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

// مكون حماية المسارات (ProtectedRoute)
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [user, setUser] = useState(null);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // --- ميزة تسجيل الخروج التلقائي بعد ساعة عند عدم النشاط (Auto Logout) ---
  useEffect(() => {
    if (!user) return; // تشغيل المراقبة فقط إذا كان المستخدم مسجلاً دخوله

    // تحديد مدة عدم النشاط: 60 دقيقة = 3,600,000 مللي ثانية
    const INACTIVITY_LIMIT = 60 * 60 * 1000;
    let timer;

    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        alert('Sie wurden aufgrund von Inaktivität automatisch abgemeldet. (تم تسجيل خروجك بسبب عدم النشاط)');
        handleLogout();
        window.location.href = '/login';
      }, INACTIVITY_LIMIT);
    };

    // الأحداث التي تعبر عن نشاط المستخدم
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

    // إضافة مستمعات الأحداث
    events.forEach((event) => window.addEventListener(event, resetTimer));

    // تشغيل المؤقت أول مرة
    resetTimer();

    // التنظيف عند إغلاق أو إعادة تحميل المكون
    return () => {
      if (timer) clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [user, handleLogout]);

  const handleLogin = (username) => {
    setUser(username);
  };

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
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
            <Route path="/edit-food/:id" element={<EditFood />} />

            {/* المسارات المحمية مع دعم اسمي المسار للإضافة */}
            <Route 
              path="/add-food" 
              element={
                <ProtectedRoute>
                  <AddFood />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/add-listing" 
              element={
                <ProtectedRoute>
                  <AddFood />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reservations" 
              element={
                <ProtectedRoute>
                  <Reservations />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;