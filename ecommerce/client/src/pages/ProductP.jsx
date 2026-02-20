import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import "../styles/ProductP.css";
import { useCart } from "../components/CartContext";

const ProductPage = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.productData;
  const { addToCart } = useCart();
  const [recommended, setRecommended] = useState([]);
  const [selectedSize] = useState("Standard");
  const [quantity, setQuantity] = useState(1);
  const [isBuying, setIsBuying] = useState(false);

  useEffect(() => {
    if (product?.CategoryID) {
      axios.get("/products").then((res) => {
        const data = res.data.filter(
          (p) => p.CategoryID === product.CategoryID && p.ProductID !== product.ProductID
        );
        setRecommended(data.slice(0, 4));
      });
    }
  }, [product]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/Login');
      return;
    }
    const cartItem = {
      UserID: user.UserID,
      ProductID: product.ProductID,
      ProductName: product.ProductName,
      Price: product.Price,
      Size: selectedSize,
      Quantity: quantity,
      Cover: product.Cover,
    };

    try {
      await axios.post("/cart/add", cartItem);
      addToCart(cartItem);
      console.log("Product added to cart.");
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      navigate('/Login');
      return;
    }

    setIsBuying(true);

    try {
      await axios.post("/orders/buy", {
        ProductID: product.ProductID,
        Quantity: quantity,
        UserID: user.UserID // Pass UserID
      });

      // Success Animation
      const button = document.querySelector('.buy-btn');
      if (button) {
        button.textContent = "Purchased!";
        button.style.backgroundColor = "#16a34a";
      }

      // Simple confetti-like animation using DOM elements
      createConfetti();

      setTimeout(() => {
        alert(`Successfully bought ${quantity} item(s)!`);
        setIsBuying(false);
        if (button) {
            button.textContent = "Buy Now";
            button.style.backgroundColor = ""; 
        }
      }, 1000);

    } catch (error) {
      console.error("Purchase failed:", error);
      
      if (error.response?.data?.code === 'NO_ADDRESS') {
        // Redirect to profile instead of prompt
        if (window.confirm("Shipping Address is required. Go to Profile to add it?")) {
            navigate('/profile');
        }
      } else {
          alert(error.response?.data?.message || "Purchase failed");
      }
      
      setIsBuying(false);
    }
  };

  const createConfetti = () => {
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.top = '-10px';
      confetti.style.width = '10px';
      confetti.style.height = '10px';
      confetti.style.backgroundColor = ['#ff0', '#f00', '#0f0', '#00f'][Math.floor(Math.random() * 4)];
      confetti.style.zIndex = '9999';
      confetti.style.transition = 'top 1s ease-in, opacity 1s ease-in';
      document.body.appendChild(confetti);

      setTimeout(() => {
        confetti.style.top = '100vh';
        confetti.style.opacity = '0';
      }, 10);

      setTimeout(() => {
        confetti.remove();
      }, 1000);
    }
  };

    return (
      <div className="container">
        <div className='container-top'>
          {/* Left Column / Product Image */}
          <div className="left-column">
            {product?.Cover ? (
              <img className="active" src={product.Cover} alt={product.ProductName} />
            ) : (
              <img className="active" src="images/red.png" alt="Product" />
            )}
          </div>

          {/* Right Column */}
          <div className="right-column">
            {/* Product Description */}
            <div className="product-description">
              <h1>{product?.ProductName || 'Product Name'}</h1>
              <p>{product?.Description || 'Product description not available.'}</p>
              <p>Product ID: {product?.ProductID ?? 'nn'}</p>
            </div>

            {/* Product Configuration */}
            <div style={{ marginTop: '10px' }}>
              <span>Quantity</span>
              <input type="number" min={1} value={quantity} onChange={e => setQuantity(Number(e.target.value))} style={{ width: '60px', marginLeft: '10px' }} />
            </div>

            {/* Product Pricing */}
            <div className="product-price">
              <span>{product ? `$${Number(product.Price).toFixed(2)}` : 'Price not available'}</span>
              <div className="btn-group">
                <a href="#" className="cart-btn" onClick={(e) => {
                  e.preventDefault();
                  handleAddToCart();
                }}>Add to cart</a>
                
                <button 
                  className="buy-btn" 
                  onClick={handleBuyNow}
                  disabled={isBuying}
                >
                  {isBuying ? 'Processing...' : 'Buy Now'}
                </button>
              </div>

            </div>
          </div>
        </div>
        <div className='container-bottom'>

          {/* Recommended Products */}
          {recommended.length > 0 && (
            <div style={{ width: '100%' }}>
              <h2 className="recommended-title">Recommended Products</h2>
              <div className="recommended-grid">
                {recommended.map(rp => (
                  <div key={rp.ProductID} className="recommended-card"
                    onClick={() => {
                      window.scrollTo(0, 0);
                      navigate('/Products/Page', {
                        state: {
                          productData: {
                            ProductID: rp.ProductID,
                            ProductName: rp.ProductName,
                            Description: rp.Description,
                            Price: rp.Price,
                            CategoryID: rp.CategoryID,
                            Cover: rp.Cover,
                          },
                        },
                      });
                    }}
                  >
                    <img src={rp.Cover} alt={rp.ProductName} />
                    <h3>{rp.ProductName}</h3>
                    <p>{rp.Description}</p>
                    <p className="recommended-price">${Number(rp.Price).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  export default ProductPage;
