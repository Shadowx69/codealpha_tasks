import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import axios from "../utils/axios";
import "../styles/Navbar.css";

const Navbar = ({ user = null, handleLogout }) => {
  const { cart, setCart } = useCart();
  const [showCart, setShowCart] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get(`/cart/${user?.UserID}`);
        setCart(res.data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    if (user?.UserID) {
      fetchCart();
    }
  }, [user, setCart]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const total = cart.reduce((sum, item) => sum + item.Price * item.Quantity, 0);

  const handleLogoutAndClearCart = () => {
    setCart([]);
    handleClearCart();
    handleLogout();
  };

  const handleClearCart = async () => {
    try {
      await axios.delete("/cart/clearCart");
      setCart([]);
      console.log("Cart cleared."); 
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };
  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`}>
      <div className="nav-left">
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/Products">Products</Link>
          </li>
          <li>
            <Link to="/model">3D Model</Link>
          </li>
          <li>
            <Link to="/About">About Us</Link>
          </li>
        </ul>
      </div>
      <div className="logo">
        <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '10px' }}>
          <defs>
            <linearGradient id="sparkle-gradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF8C8C" />
              <stop offset="0.5" stopColor="#FFC85C" />
              <stop offset="1" stopColor="#FF8C8C" />
            </linearGradient>
          </defs>
          <path d="M50 15 C50 15 60 40 85 50 C60 60 50 85 50 85 C50 85 40 60 15 50 C40 40 50 15 50 15 Z" fill="url(#sparkle-gradient)"/>
          <circle cx="20" cy="30" r="6" fill="#FFC85C"/>
          <circle cx="80" cy="25" r="8" fill="#FF8C8C"/>
          <circle cx="70" cy="75" r="5" fill="#FFC85C"/>
        </svg>
        WonderLand
      </div>
      <div style={{ position: "relative" }}>
        <ul className="nav-links">
          {user ? (
            <>
              <li style={{ position: "relative" }}>
                <span
                  onClick={() => setShowCart((v) => !v)}
                  style={{ cursor: "pointer" }}
                >
                  Cart{" "}
                  {cart.length > 0 && (
                    <span className="cart-count">{cart.length}</span>
                  )}
                </span>
                {showCart && (
                  <div className="cart-dropdown">
                    <h3>Cart</h3>
                    {cart.length === 0 ? (
                      <div>No items in cart.</div>
                    ) : (
                      cart.map((item, idx) => (
                        <div key={idx} className="cart-item">
                          <img src={item.Cover} alt={item.ProductName} />
                          <div>
                            <span>{item.ProductName}</span>
                            <span>Qty: {item.Quantity}</span>
                            <span>Size: {item.Size}</span>
                          </div>
                          <span>${(item.Price * item.Quantity).toFixed(2)}</span>
                        </div>
                      ))
                    )}
                    <div>Total: ${total.toFixed(2)}</div>
                    <button onClick={handleClearCart}>Clear Cart</button>
                  </div>
                )}
              </li>
              <li>
                <span 
                  onClick={() => navigate('/profile')} 
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}
                >
                  {user.UserName}
                </span>
              </li>
              <li onClick={handleLogoutAndClearCart}>Logout</li>
            </>
          ) : (
            <>
              <li>
                <Link to="/Login">Login</Link>
              </li>
              <li>
                <Link to="/Register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;