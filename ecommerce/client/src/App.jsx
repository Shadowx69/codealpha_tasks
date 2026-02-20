import React, {useState, useEffect} from 'react';
import { Routes, Route, useLocation } from "react-router-dom";
import Home from './pages/Home';
import ProductP from './pages/Products';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductPage from './pages/ProductP'; 
import About from './pages/About';
import Contact from './pages/Contact';
import ModelPage from './pages/ModelPage';
import Profile from './pages/Profile'; // Import Profile page
import { CartProvider } from './components/CartContext';
import gsap from 'gsap';

import './styles/App.css';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => {

  const [user, setUser] = useState(null);

    const handleLogin = (userData) => {
        setUser(userData);
    };

    const handleLogout = () => {
        setUser(null);
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Clear token cookie
    };

    useEffect(() => {
      gsap.to(".bar", { duration: 1.5, delay: 0.2, height: 0, stagger: { amount: 0.5 }, ease: "power4.inOut" });
      
    }, []);

  return (
    <CartProvider>
      <div className="app" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <ScrollToTop />
        <div className="overlay">
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
    </div>
        <Navbar user={user} handleLogout={handleLogout}/>
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} /> 
            <Route path="/Admin" element={<Admin />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/Products" element={<ProductP />} />
            <Route path="/About" element={<About />} />
            <Route path="/Contact" element={<Contact />} />
            <Route path="/model" element={<ModelPage />} />
            <Route path="/Products/Page" element={<ProductPage user={user} />} />
            <Route path="/Login" element={<Login onLogin={handleLogin} />} />
            <Route path="/profile" element={<Profile user={user} setUser={setUser} />} /> {/* Add Profile Route */}
          </Routes>
        </div>
        <Footer />
      </div>
    </CartProvider>
  );
};

export default App;
