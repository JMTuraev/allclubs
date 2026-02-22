import { useState } from "react";
import { useProducts } from "../context/ProductContext";
import ProductGrid from "../components/pos/ProductGrid";
import {
  PlusIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import { v4 as uuid } from "uuid";

export default function NewProductPage() {
  const { products, setProducts } = useProducts();

  /* ================= CATEGORIES ================= */

  const [categories, setCategories] = useState([
    { id: "cat_1", name: "Drinks" },
    { id: "cat_2", name: "Snacks" },
  ]);

  const [selectedCategory, setSelectedCategory] = useState(null);

  const [creatingCategory, setCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const [menuOpenId, setMenuOpenId] = useState(null);

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) return;

    const newCat = {
      id: uuid(),
      name: newCategoryName.trim(),
    };

    setCategories((prev) => [...prev, newCat]);
    setSelectedCategory(newCat);

    setNewCategoryName("");
    setCreatingCategory(false);
  };

  const handleDeleteCategory = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));

    if (selectedCategory?.id === id) {
      setSelectedCategory(null);
    }

    setMenuOpenId(null);
  };

  const handleEditCategory = (id) => {
    if (!editingName.trim()) return;

    setCategories((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, name: editingName } : c
      )
    );

    setEditingId(null);
    setEditingName("");
  };

  /* ================= PRODUCTS ================= */

  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
  });

  const handleCreateProduct = () => {
    if (!selectedCategory) return;
    if (!form.name || !form.price) return;

    const newProduct = {
      id: uuid(),
      categoryId: selectedCategory.id,
      name: form.name,
      price: Number(form.price),
      image: form.image || "/images/1.jpeg",
      isActive: true,
    };

    setProducts((prev) => [...prev, newProduct]);

    setForm({ name: "", price: "", image: "" });
    setModalOpen(false);
  };

  const filteredProducts = selectedCategory
    ? products.filter(
        (p) =>
          p.categoryId === selectedCategory.id &&
          p.isActive
      )
    : [];

  return (
    <div className="h-screen bg-[#0b1220] p-4 text-white">
      <div className="flex h-full border border-white/10 rounded-2xl overflow-hidden bg-[#0e1628]">

        {/* ===== LEFT CATEGORY COLUMN ===== */}
        <div className="w-60 border-r border-white/10 p-4 flex flex-col">

          {/* ADD CATEGORY */}
          <button
            onClick={() => setCreatingCategory(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 transition rounded-xl px-3 py-2 mb-4"
          >
            <PlusIcon className="h-4 w-4" />
            Add Category
          </button>

          <div className="flex-1 overflow-y-auto space-y-2">

            {categories.map((cat) => (
              <div
                key={cat.id}
                className={`relative group p-3 rounded-xl cursor-pointer transition ${
                  selectedCategory?.id === cat.id
                    ? "bg-indigo-600"
                    : "bg-white/5 hover:bg-white/10"
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {/* EDIT MODE */}
                {editingId === cat.id ? (
                  <input
                    autoFocus
                    value={editingName}
                    onChange={(e) =>
                      setEditingName(e.target.value)
                    }
                    onBlur={() => handleEditCategory(cat.id)}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      handleEditCategory(cat.id)
                    }
                    className="w-full bg-white/10 rounded px-2 py-1 outline-none"
                  />
                ) : (
                  <div className="flex justify-between items-center">
                    <span>{cat.name}</span>

                    {/* 3 DOT MENU */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenId(
                          menuOpenId === cat.id
                            ? null
                            : cat.id
                        );
                      }}
                      className="p-1 rounded hover:bg-white/10"
                    >
                      <EllipsisVerticalIcon className="h-4 w-4 opacity-70" />
                    </div>
                  </div>
                )}

                {/* DROPDOWN */}
                {menuOpenId === cat.id && (
                  <div className="absolute right-2 top-10 bg-[#111827] border border-white/10 rounded-lg shadow-lg z-50 w-28">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(cat.id);
                        setEditingName(cat.name);
                        setMenuOpenId(null);
                      }}
                      className="block w-full text-left px-3 py-2 text-sm hover:bg-white/5"
                    >
                      Edit
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(cat.id);
                      }}
                      className="block w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-white/5"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* NEW CATEGORY INPUT */}
            {creatingCategory && (
              <input
                autoFocus
                value={newCategoryName}
                onChange={(e) =>
                  setNewCategoryName(e.target.value)
                }
                onBlur={handleCreateCategory}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  handleCreateCategory()
                }
                placeholder="New category..."
                className="w-full bg-white/5 rounded-xl px-3 py-2 outline-none border border-indigo-500"
              />
            )}
          </div>
        </div>

        {/* ===== PRODUCT GRID ===== */}
        <ProductGrid
          products={filteredProducts}
          selectedClient={{ name: "Owner Mode" }}
          cart={[]}
          showAddCard={true}
          addDisabled={!selectedCategory}
          onAddClick={() => {
            if (!selectedCategory) return;
            setModalOpen(true);
          }}
        />

      </div>

      {/* ===== PRODUCT MODAL ===== */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-[#111827] p-6 rounded-2xl w-[400px]">
            <h2 className="text-lg font-semibold mb-4">
              Create Product ({selectedCategory?.name})
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
                onClick={handleCreateProduct}
                className="bg-indigo-600 px-4 py-2 rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}