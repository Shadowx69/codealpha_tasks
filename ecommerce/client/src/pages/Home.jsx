import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import '../styles/Home.css'; // Import the CSS file
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import MovingS from '../components/MovingS.jsx';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../utils/axios.js';
import heroBg from '../Resources/herobg.png';

const animatedTexts = [
  {
    h2: 'Discover a world of wonder and imagination.',
    p: 'Explore our magical collection of toys that spark joy and creativity.'
  },
  {
    h2: 'Find the perfect playmates for your little ones.',
    p: 'From cuddly plushies to action-packed figures, we have it all.'
  },
  {
    h2: 'Unleash fun with our latest toy arrivals.',
    p: 'Get ready for endless hours of entertainment and learning.'
  }
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [textIndex, setTextIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/products');
        let data = Array.isArray(response.data) ? response.data : [];
        // Shuffle and pick up to 20 random products
        data = data.sort(() => 0.5 - Math.random()).slice(0, 20);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setTextIndex((prev) => (prev + 1) % animatedTexts.length);
        setFade(true);
      }, 800); // fade out duration
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-container">
      
      <div className='hero' style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="herol">
          <div className="head">
            <h1>WonderLand</h1>
            <h1 className='h1n'>ToyStore</h1>
          </div>
          <div className="descript">
            <h2 className={`fade-text${fade ? ' visible' : ''}`}>{animatedTexts[textIndex].h2}</h2>
            <p className={`fade-text${fade ? ' visible' : ''}`}>{animatedTexts[textIndex].p}</p>
          </div>
          <div className="btn btnhome">
            <Link to="/products">Explore Toys</Link>
          </div>
        </div>
      </div>
      <MovingS />
      <section className="Section2">
        <div className="sec2l">
          <div className="sec11">
            {/* <img src="src\Resources\sec2L11.png" alt="" className="sec21li p111" /> */}
            <div className="btn sec2btn">
              <Link to="/products">Browse Collection</Link>
            </div>
            </div>
            <div className="sec12">
              {/* <img src="src\Resources\sec2L12.png" alt="" className="sec22li p111" /> */}
              <div className="btn sec2btn">
                <Link to="/products">View Catalog</Link>
              </div>
            </div>
            </div>
            <div className="sec2r">
              <div className="sec21">
                <div className="btn">
                  <Link to="/products">Shop Now</Link>
                </div>
                {/* <img src="src\Resources\sec2R21.png" alt="" className='sec21ri p222' /> */}
              </div>
              <div className="sec22">
                <div className="btn">
                  <Link to="/products">See More</Link>
                </div>
                {/* <img src="src\Resources\sec2R22.png" alt="" className='sec22ri p222' /> */}
          </div>
        </div>

      </section>
      {/* <MovingS /> */}
      <section>
        <div className='homeSec3'>
          <h1>OUR COLLECTION</h1>
        </div>
        <div className="homProducts">
          {products.slice(0, 8).map((product) => (
            <div
              key={product.ProductID}
              className="product-card"
              onClick={() => {
                navigate("/Products/Page", {
                  state: {
                    productData: {
                      ProductName: product.ProductName,
                      Description: product.Description,
                      Price: product.Price,
                      CategoryID: product.CategoryID,
                      Cover: product.Cover,
                    },
                  },
                });
              }}
              style={{ cursor: 'pointer' }}
            >
              <div className="image-wrapper">
                <img src={product.Cover} alt={product.ProductName} className="product-image" />
                <div className="card-overlay">
                  <button className="overlay-btn">Add to Cart</button>
                  <button className="overlay-btn">Buy Now</button>
                </div>
              </div>
              <div className="card-info">
                <h3>{product.ProductName}</h3>
                <p>${product.Price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="hero-bottom-section">
        <div className="hero-bottom-container">
          <img className='heroimg-bottom' src="src\Resources\hero.png" alt="heroimg" />
        </div>
      </section>

    </div>
  );
};

export default Home;
