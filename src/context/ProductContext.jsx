import { createContext, useContext, useEffect, useState } from "react";

import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy
} from "firebase/firestore";

import { db } from "../firebase";

import {
  createBarCategoryFn,
  updateBarCategoryFn,
  deleteBarCategoryFn,
  createBarProductFn,
  updateBarProductFn,
  deleteBarProductFn
} from "../firebase";

const ProductContext = createContext();

const gymId = "sportzal_demo";

export function ProductProvider({ children }) {

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  /* ================= CATEGORY LISTENER ================= */

  useEffect(() => {

    const ref = collection(db, "gyms", gymId, "barCategories");

    const q = query(
      ref,
      where("isActive", "==", true),
      orderBy("name")
    );

    const unsub = onSnapshot(q, (snap) => {

      const list = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setCategories(list);

    });

    return () => unsub();

  }, []);

  /* ================= PRODUCT LISTENER ================= */

  useEffect(() => {

    const ref = collection(db, "gyms", gymId, "barProducts");

    const q = query(
      ref,
      where("isActive", "==", true),
      orderBy("name")
    );

    const unsub = onSnapshot(q, (snap) => {

      const list = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setProducts(list);

    });

    return () => unsub();

  }, []);

  /* ================= CATEGORY CRUD ================= */

  const addCategory = async (name) => {

    const res = await createBarCategoryFn({
      gymId,
      name
    });

    return {
      id: res.data.id,
      name
    };

  };

  const updateCategory = async (id, name) => {

    await updateBarCategoryFn({
      gymId,
      categoryId: id,
      name
    });

  };

  const deleteCategory = async (id) => {

    await deleteBarCategoryFn({
      gymId,
      categoryId: id
    });

  };

  /* ================= PRODUCT CRUD ================= */

  const addProduct = async (data) => {

    await createBarProductFn({
      gymId,
      data
    });

  };

  const updateProduct = async (id, updates) => {

    await updateBarProductFn({
      gymId,
      productId: id,
      updates
    });

  };

  const deleteProduct = async (id) => {

    await deleteBarProductFn({
      gymId,
      productId: id
    });

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
        deleteProduct
      }}
    >
      {children}
    </ProductContext.Provider>
  );

}

export function useProducts() {
  return useContext(ProductContext);
}