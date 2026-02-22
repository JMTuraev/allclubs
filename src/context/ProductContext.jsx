import { createContext, useContext, useState } from "react";
import { v4 as uuid } from "uuid";

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([
    {
      id: uuid(),
      categoryId: "cat_1",
      name: "Protein Shake",
      price: 15000,
      image: "/images/1.jpeg",
      isActive: true,
    },
  ]);

  return (
    <ProductContext.Provider value={{ products, setProducts }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductContext);
}