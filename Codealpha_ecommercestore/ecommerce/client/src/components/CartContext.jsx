import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.ProductID === product.ProductID && item.Size === product.Size
      );
      if (existingIndex > -1) {
        const updatedCart = [...prev];
        updatedCart[existingIndex].Quantity += (product.Quantity)/2;
        return updatedCart;
      }
      return [...prev, product];
    });
  };

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};