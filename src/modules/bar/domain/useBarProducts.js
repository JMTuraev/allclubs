import { useMemo } from "react";

export function useBarProducts(products, selectedCategory) {

  const filteredProducts = useMemo(() => {

    if (!selectedCategory) return [];

    return products.filter(
      p => p.categoryId === selectedCategory.id
    );

  }, [products, selectedCategory]);

  return { filteredProducts };

}