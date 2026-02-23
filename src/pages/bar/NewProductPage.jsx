import { useState } from "react";
import { useProducts } from "../../context/ProductContext";
import CategorySidebar from "../../components/bar/ui/CategorySidebar";
import AdminProducts from "../../modules/bar/admin/AdminProducts";

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
        p =>
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
        isActive: true,
      });
    }

    setForm({ name: "", price: "", image: "" });
    setEditingProduct(null);
    setModalOpen(false);
  };

  return (
    <>
      <div className="h-full flex gap-4 p-4 bg-[#0B1120] text-white overflow-hidden">

        {/* CATEGORY */}
        <div className="w-56 bg-[#0e1628] border border-white/10 rounded-2xl overflow-hidden">
          <CategorySidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
            adminMode
            onAdd={(name) => {
              const newCat = addCategory(name);
              setSelectedCategory(newCat);
              return newCat;
            }}
            onEdit={updateCategory}
            onDelete={deleteCategory}
          />
        </div>

        {/* PRODUCTS */}
        <div className="flex-1 bg-[#0e1628] border border-white/10 rounded-2xl overflow-hidden">
          <AdminProducts
            products={filteredProducts}
            onAddClick={() => {
              if (!selectedCategory) return;
              setEditingProduct(null);
              setForm({ name: "", price: "", image: "" });
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
            onDelete={deleteProduct}
          />
        </div>

      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#111827] p-6 rounded-2xl w-[420px] border border-white/10">

            <h2 className="text-base font-semibold mb-4">
              {editingProduct ? "Edit Product" : "Create Product"}
              {" "}
              ({selectedCategory?.name})
            </h2>

            <input
              placeholder="Product Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full mb-3 px-3 py-2 rounded-xl bg-white/5 outline-none text-sm"
            />

            <input
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
              className="w-full mb-3 px-3 py-2 rounded-xl bg-white/5 outline-none text-sm"
            />

            <input
              placeholder="Image URL"
              value={form.image}
              onChange={(e) =>
                setForm({ ...form, image: e.target.value })
              }
              className="w-full mb-4 px-3 py-2 rounded-xl bg-white/5 outline-none text-sm"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setModalOpen(false);
                  setEditingProduct(null);
                }}
                className="text-gray-400 text-sm"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl text-sm"
              >
                {editingProduct ? "Update" : "Create"}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}