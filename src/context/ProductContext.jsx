import { createContext, useContext, useState } from "react";
import { v4 as uuid } from "uuid";

const ProductContext = createContext();

export function ProductProvider({ children }) {

  /* ================= CATEGORIES ================= */

  const [categories, setCategories] = useState([
    { id: "cat_1", name: "Drinks", isActive: true },
    { id: "cat_2", name: "Snacks", isActive: true },
  ]);

  const addCategory = (name) => {
    const newCategory = {
      id: uuid(),
      name,
      isActive: true,
    };
    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  };

  const updateCategory = (id, name) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === id ? { ...cat, name } : cat
      )
    );
  };

  const deleteCategory = (id) => {
    setCategories(prev =>
      prev.filter(cat => cat.id !== id)
    );

    // optional: remove related products
    setProducts(prev =>
      prev.filter(prod => prod.categoryId !== id)
    );
  };

  /* ================= PRODUCTS ================= */

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

  const addProduct = (data) => {
    const newProduct = {
      id: uuid(),
      ...data,
      isActive: true,
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id, updates) => {
    setProducts(prev =>
      prev.map(prod =>
        prod.id === id ? { ...prod, ...updates } : prod
      )
    );
  };

  const deleteProduct = (id) => {
    setProducts(prev =>
      prev.filter(prod => prod.id !== id)
    );
  };

  return (
    <ProductContext.Provider
      value={{
        categories,
        products,
        addCategory,
        updateCategory,
        deleteCategory,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductContext);
}