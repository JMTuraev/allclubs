import {
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline"

const staffs = [
  {
    id: 1,
    name: "Ali Karimov",
    role: "manager",
    phone: "+998 90 123 45 67",
    isActive: true,
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    name: "Bekzod Trainer",
    role: "trainer",
    commission: { type: "percent", value: 30 },
    phone: "+998 90 222 33 44",
    isActive: true,
    image: "https://randomuser.me/api/portraits/men/75.jpg",
  },
  {
    id: 3,
    name: "Dilnoza Coach",
    role: "trainer",
    commission: { type: "fixed", value: 200000 },
    phone: "+998 90 555 66 77",
    isActive: false,
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 4,
    name: "Madina Manager",
    role: "manager",
    phone: "+998 90 777 88 99",
    isActive: true,
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
]

export default function StaffList() {
  return (
    <div className="px-8 py-10">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

        {staffs.map((staff) => (
          <div
            key={staff.id}
            className="
              relative
              rounded-2xl
              bg-gradient-to-b from-gray-800 to-gray-900
              border border-white/10
              p-8
              shadow-xl shadow-black/30
              hover:-translate-y-1 hover:shadow-indigo-600/20
              transition-all duration-300
            "
          >

            {/* 3 dots menu */}
            <button className="absolute top-4 right-4 text-gray-400 hover:text-white transition">
              <EllipsisVerticalIcon className="h-5 w-5" />
            </button>

            {/* Avatar + Online Badge */}
            <div className="flex justify-center mb-6">
              <div className="relative">

                <img
                  src={staff.image}
                  alt={staff.name}
                  className="
                    h-24 w-24
                    rounded-full
                    object-cover
                    border border-white/10
                    shadow-md
                    hover:scale-105
                    transition
                  "
                />

                {/* Online / Offline badge */}
                <span
                  className={`
                    absolute bottom-1 right-1
                    h-4 w-4 rounded-full
                    border-2 border-gray-900
                    ${staff.isActive ? "bg-emerald-500" : "bg-gray-500"}
                  `}
                />

              </div>
            </div>

            {/* Name */}
            <h3 className="text-center text-white font-semibold text-lg">
              {staff.name}
            </h3>

            {/* Role */}
            <div className="mt-3 flex justify-center">
              <span
                className={`
                  px-3 py-1 rounded-full text-xs font-medium
                  ${
                    staff.role === "manager"
                      ? "bg-indigo-500/20 text-indigo-400"
                      : "bg-amber-500/20 text-amber-400"
                  }
                `}
              >
                {staff.role === "manager" ? "Manager" : "Trainer"}
              </span>
            </div>

            {/* Commission (faqat trainer uchun) */}
            {staff.role === "trainer" && (
              <div className="mt-4 text-center">
                <span className="text-sm text-gray-400">
                  💰{" "}
                  {staff.commission.type === "percent"
                    ? `${staff.commission.value}%`
                    : `${staff.commission.value.toLocaleString(
                        "ru-RU"
                      )} сум`}
                </span>
              </div>
            )}

            {/* Phone */}
            <div className="mt-4 text-center text-sm text-gray-400">
              {staff.phone}
            </div>

          </div>
        ))}

      </div>
    </div>
  )
}