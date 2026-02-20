import React from "react";
import { Link } from "react-router-dom";
import '../styles/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Logo and Description */}
                <div className="footer-section about">
                    <h3>WonderLand Toystore</h3>
                    <p>Your one-stop shop for the best deals and Toys. We’re committed to delivering quality, affordability, and satisfaction.</p>
                </div>

                {/* Quick Links */}
                <div className="footer-section links">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><Link to="/About">About Us</Link></li>
                        <li><Link to="/Contact">Contact</Link></li>
                        <li><Link to="/">Privacy Policy</Link></li>
                        <li><Link to="/">Terms of Service</Link></li>
                    </ul>
                </div>

                {/* Customer Service */}
                <div className="footer-section customer-service">
                    <h4>Customer Service</h4>
                    <ul>
                        <li>FAQs</li>
                        <li>Returns</li>
                        <li>Shipping Info</li>
                        <li>Support Center</li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} WonderLand  All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
