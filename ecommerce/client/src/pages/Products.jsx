import React, { useEffect, useState } from "react";
import "../styles/Products.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axios.js";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(150);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch products from API using axios
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/products"); // Uses baseURL from axios.js
        // Ensure response.data is an array
        const data = Array.isArray(response.data) ? response.data : [];
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    // Fetch categories from API using axios
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const handleCategoryChange = (categoryId) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter((id) => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const filteredProducts = products.filter((product) => {
    return (
      (searchTerm === "" || product.ProductName.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCategories.length === 0 || selectedCategories.includes(product.CategoryID)) &&
      product.Price >= minPrice &&
      product.Price <= maxPrice
    );
  });

  const handleMinPriceChange = (e) => {
    const value = Math.min(Number(e.target.value), maxPrice - 1);
    setMinPrice(value >= 0 ? value : 0); // Ensure minimum is non-negative
  };

  const handleMaxPriceChange = (e) => {
    const value = Math.max(Number(e.target.value), minPrice + 1);
    setMaxPrice(value >= 0 ? value : 0); // Ensure maximum is non-negative
  };

  return (
    <section className="prodSection">
      <div className="prodSec">
        <h1>Choose from the Best</h1>
      </div>
      <div className="prodMain">
        <div className="prodMainLeft1">
          <div className="prodMainLeft">
            <h2>Search</h2>
            <input
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="searchBar"
            />

            <h2>Categories</h2>
            <ul>
              {categories.map((category) => (
                <li key={category.CategoryID}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.CategoryID)}
                      onChange={() => handleCategoryChange(category.CategoryID)}
                    />
                    {category.CategoryName}
                  </label>
                </li>
              ))}
            </ul>

            <h2>Price Range</h2>
            <div className="priceRange">
              <div className="priceLabels">
                <label>
                  Min Price: $
                  <input
                    type="number"
                    value={minPrice}
                    onChange={handleMinPriceChange}
                    className="priceInput"
                    min="0"
                  />
                </label>
                <label>
                  Max Price: $
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={handleMaxPriceChange}
                    className="priceInput"
                    min="0"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="productGrid">
          {filteredProducts.map((product) => (
            <div
              key={product.ProductID}
              className="productCard"
              onClick={() => {
                navigate("/Products/Page", {
                  state: {
                    productData: {
                      ProductID: product.ProductID, 
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
              <img src={product.Cover} alt={product.ProductName} className="productImg" />
              <h3>{product.ProductName}</h3>
              <p>{product.Description}</p>
              <p>${Number(product.Price).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
