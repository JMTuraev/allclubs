import { useState } from "react";
import { useProducts } from "../../context/ProductContext";
import CategorySidebar from "../../components/bar/ui/CategorySidebar";
import AdminProducts from "../../modules/bar/admin/AdminProducts";

import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function NewProductPage() {
  const {
    categories,
    products,
    addCategory,
    updateCategory,
    deleteCategory,
    addProduct,
    updateProduct,
    deleteProduct
  } = useProducts();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
    file: null
  });

  /* ================= FILTER PRODUCTS ================= */

  const filteredProducts = selectedCategory
    ? products.filter(
        p =>
          p.categoryId === selectedCategory.id &&
          p.isActive
      )
    : [];

  /* ================= IMAGE CHANGE ================= */

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);

    setForm(prev => ({
      ...prev,
      image: preview,
      file
    }));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {

    if (!selectedCategory) return;
    if (!form.name || !form.price) return;

    let imageUrl = form.image;

    try {

      /* 🔥 Upload new file if exists */

      if (form.file) {

        const storageRef = ref(
          storage,
          `barProducts/${Date.now()}-${form.file.name}`
        );

        await uploadBytes(storageRef, form.file);

        imageUrl = await getDownloadURL(storageRef);
      }

      if (editingProduct) {

        await updateProduct(editingProduct.id, {
          name: form.name,
          price: Number(form.price),
          image: imageUrl
        });

      } else {

        await addProduct({
          categoryId: selectedCategory.id,
          name: form.name,
          price: Number(form.price),
          image: imageUrl,
          isActive: true
        });

      }

      setForm({
        name: "",
        price: "",
        image: "",
        file: null
      });

      setEditingProduct(null);
      setModalOpen(false);

    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    }
  };

  return (
    <>
      <div className="h-full flex gap-4 p-4 bg-[#0B1120] text-white overflow-hidden">

        {/* CATEGORY */}

        <div className="w-56 bg-[#0e1628] border border-white/10 rounded-2xl overflow-hidden">

          <CategorySidebar
            categories={categories}
            selected={selectedCategory}
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

              setForm({
                name: "",
                price: "",
                image: "",
                file: null
              });

              setModalOpen(true);
            }}

            onEdit={(product) => {

              setEditingProduct(product);

              setForm({
                name: product.name,
                price: product.price,
                image: product.image,
                file: null
              });

              setModalOpen(true);

            }}

            onDelete={deleteProduct}
          />

        </div>

      </div>

      {/* ================= MODAL ================= */}

      {modalOpen && (

        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-[#111827] w-[420px] rounded-2xl border border-white/10 p-6 shadow-xl">

            <h2 className="text-lg font-semibold mb-5">
              {editingProduct ? "Edit Product" : "Create Product"}
              <span className="text-indigo-400 ml-2">
                ({selectedCategory?.name})
              </span>
            </h2>

            {/* IMAGE UPLOAD */}

            <label
              className="
              relative
              w-full
              aspect-square
              border-2
              border-dashed
              border-white/15
              rounded-2xl
              cursor-pointer
              flex
              items-center
              justify-center
              bg-white/[0.02]
              hover:border-indigo-500
              hover:bg-indigo-500/5
              transition
              overflow-hidden
              mb-5
              "
            >

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              {!form.image ? (

                <div className="flex flex-col items-center gap-2 text-center">

                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">

                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4 16l4-4a3 3 0 014 0l4 4"/>
                      <path d="M14 12l1-1a3 3 0 014 0l1 1"/>
                      <path d="M4 20h16"/>
                      <rect x="3" y="4" width="18" height="12" rx="2"/>
                    </svg>

                  </div>

                  <p className="text-indigo-400 text-sm font-medium">
                    Upload photo
                  </p>

                  <p className="text-xs text-gray-500">
                    PNG, JPG up to 5MB
                  </p>

                </div>

              ) : (

                <img
                  src={form.image}
                  alt="preview"
                  className="absolute inset-0 w-full h-full object-cover"
                />

              )}

            </label>

            {/* NAME */}

            <input
              placeholder="Product Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full mb-3 px-3 py-2 rounded-xl bg-white/5 outline-none text-sm"
            />

            {/* PRICE */}

            <input
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
              className="w-full mb-4 px-3 py-2 rounded-xl bg-white/5 outline-none text-sm"
            />

            {/* BUTTONS */}

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
                className="bg-indigo-600 hover:bg-indigo-700 transition px-4 py-2 rounded-xl text-sm font-medium"
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