import { createContext, useContext, useState } from "react";
import { useProducts } from "../ProductContext";
import { useBarInvoice } from "../../modules/bar/domain/useBarInvoice";

const BarContext = createContext();
export const useBar = () => useContext(BarContext);

export function BarProvider({ children }) {

  // 🔥 DATA endi ProductContext’dan keladi
  const { categories, products } = useProducts();

  const [selectedCategory, setSelectedCategory] =
    useState(null);

  const filteredProducts = selectedCategory
    ? products.filter(
        p => p.categoryId === selectedCategory.id
      )
    : [];

  const invoice = useBarInvoice();

  return (
    <BarContext.Provider
      value={{
        categories,
        products,
        selectedCategory,
        setSelectedCategory,
        filteredProducts,
        ...invoice
      }}
    >
      {children}
    </BarContext.Provider>
  );
}