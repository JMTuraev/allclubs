import { useState } from "react";
import {
  PlusIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";

export default function CategoriesColumn({
  categories,
  selectedCategory,
  onSelect,
  adminMode = false,
  onAdd,
  onEdit,
  onDelete,
}) {
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const [menuOpenId, setMenuOpenId] = useState(null);

  const handleCreate = () => {
    if (!newName.trim()) return;
    onAdd(newName.trim());
    setNewName("");
    setCreating(false);
  };

  const handleEdit = (id) => {
    if (!editingName.trim()) return;
    onEdit(id, editingName.trim());
    setEditingId(null);
    setEditingName("");
  };

  return (
    <div className="w-60 border-r border-white/10 flex flex-col bg-[#0e1628] p-4">

      {/* ADD BUTTON (ADMIN ONLY) */}
      {adminMode && (
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 transition rounded-xl px-3 py-2 mb-4"
        >
          <PlusIcon className="h-4 w-4" />
          Add Category
        </button>
      )}

      <div className="flex-1 overflow-y-auto space-y-2">

        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`relative p-3 rounded-xl cursor-pointer transition ${
              selectedCategory?.id === cat.id
                ? "bg-indigo-600"
                : "bg-white/5 hover:bg-white/10"
            }`}
            onClick={() => onSelect(cat)}
          >
            {editingId === cat.id ? (
              <input
                autoFocus
                value={editingName}
                onChange={(e) =>
                  setEditingName(e.target.value)
                }
                onBlur={() => handleEdit(cat.id)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  handleEdit(cat.id)
                }
                className="w-full bg-white/10 rounded px-2 py-1 outline-none"
              />
            ) : (
              <div className="flex justify-between items-center">
                <span>{cat.name}</span>

                {adminMode && (
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
                )}
              </div>
            )}

            {/* DROPDOWN */}
            {adminMode && menuOpenId === cat.id && (
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
                    onDelete(cat.id);
                    setMenuOpenId(null);
                  }}
                  className="block w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-white/5"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}

        {/* NEW INPUT */}
        {adminMode && creating && (
          <input
            autoFocus
            value={newName}
            onChange={(e) =>
              setNewName(e.target.value)
            }
            onBlur={handleCreate}
            onKeyDown={(e) =>
              e.key === "Enter" && handleCreate()
            }
            placeholder="New category..."
            className="w-full bg-white/5 rounded-xl px-3 py-2 outline-none border border-indigo-500"
          />
        )}
      </div>
    </div>
  );
}