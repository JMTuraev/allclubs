import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  UserIcon,
  PhoneIcon,
  UserCircleIcon,
  DocumentTextIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline"

export default function CreateClient() {
  const navigate = useNavigate()
  const [preview, setPreview] = useState(null)

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    gender: "male",
    note: "",
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (file) setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate("/app/clients")
  }

  return (
    <div className="px-6 pt-4 pb-6">
      <div className="max-w-3xl mx-auto bg-gray-900 border border-white/10 rounded-2xl shadow-lg">

        <form onSubmit={handleSubmit}>

          {/* Avatar */}
          <div className="flex flex-col items-center py-5 border-b border-white/10">
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="h-16 w-16 rounded-full object-cover border border-white/10"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center">
                <PhotoIcon className="h-5 w-5 text-gray-500" />
              </div>
            )}

            <label className="mt-2 text-xs text-indigo-400 cursor-pointer hover:text-indigo-300 transition">
              Upload photo
              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="hidden"
              />
            </label>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* First Name */}
              <div>
                <label className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                  <UserIcon className="h-4 w-4" />
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                  <UserIcon className="h-4 w-4" />
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                  <PhoneIcon className="h-4 w-4" />
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                  <UserCircleIcon className="h-4 w-4" />
                  Gender
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

            </div>

            {/* Note */}
            <div>
              <label className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                <DocumentTextIcon className="h-4 w-4" />
                Note
              </label>
              <textarea
                name="note"
                rows="2"
                value={form.note}
                onChange={handleChange}
                className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-white/10 bg-gray-900/60 rounded-b-2xl">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm font-semibold transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-90 text-sm font-semibold transition shadow-md"
            >
              Save
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}