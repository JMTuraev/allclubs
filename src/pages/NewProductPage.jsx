import { useState } from "react";
import { useProducts } from "../context/ProductContext";
import CategoriesColumn from "../components/pos/CategoriesColumn";
import ProductGrid from "../components/pos/ProductGrid";

export default function NewProductPage() {
  const {
    categories,
    products,
    addCategory,
    updateCategory,
    deleteCategory,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
  });

  const filteredProducts = selectedCategory
    ? products.filter(
        (p) =>
          p.categoryId === selectedCategory.id &&
          p.isActive
      )
    : [];

  const handleSubmit = () => {
    if (!selectedCategory) return;
    if (!form.name || !form.price) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: form.name,
        price: Number(form.price),
        image: form.image,
      });
    } else {
      addProduct({
        categoryId: selectedCategory.id,
        name: form.name,
        price: Number(form.price),
        image: form.image || "/images/1.jpeg",
      });
    }

    setForm({ name: "", price: "", image: "" });
    setEditingProduct(null);
    setModalOpen(false);
  };

  return (
    <div className="h-full w-full overflow-hidden text-white">
      <div className="flex h-full w-full dark-scroll">

        <CategoriesColumn
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
          adminMode
          onAdd={(name) => {
            const newCat = addCategory(name);
            setSelectedCategory(newCat);
          }}
          onEdit={updateCategory}
          onDelete={deleteCategory}
        />

        <ProductGrid
          products={filteredProducts}
          mode="admin"
          onAddClick={() => {
            if (!selectedCategory) return;
            setEditingProduct(null);
            setModalOpen(true);
          }}
          onEdit={(product) => {
            setEditingProduct(product);
            setForm({
              name: product.name,
              price: product.price,
              image: product.image,
            });
            setModalOpen(true);
          }}
          onDelete={(id) => deleteProduct(id)}
        />
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-[#111827] p-6 rounded-2xl w-[400px]">
            <h2 className="text-lg font-semibold mb-4">
              {editingProduct ? "Edit Product" : "Create Product"}{" "}
              ({selectedCategory?.name})
            </h2>

            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full mb-3 px-3 py-2 rounded bg-white/5"
            />

            <input
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
              className="w-full mb-3 px-3 py-2 rounded bg-white/5"
            />

            <input
              placeholder="Image URL"
              value={form.image}
              onChange={(e) =>
                setForm({ ...form, image: e.target.value })
              }
              className="w-full mb-4 px-3 py-2 rounded bg-white/5"
            />

            <div className="flex justify-end gap-3">
              <button onClick={() => setModalOpen(false)}>
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-indigo-600 px-4 py-2 rounded"
              >
                {editingProduct ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}