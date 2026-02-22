import { Link, useLocation } from "react-router-dom"

export default function Navbar() {
  const location = useLocation()

  const navItems = [
    { name: "Главная", path: "/" },
    { name: "Тарифы", path: "/pricing" },
    { name: "Контакты", path: "/contacts" },
  ]

  return (
    <header className="relative z-50 bg-gray-900 border-b border-gray-800">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="text-xl font-bold text-white">
          ALLCLUBS
        </div>

        <div className="hidden md:flex gap-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`text-sm font-medium transition ${
                location.pathname === item.path
                  ? "text-indigo-400"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <Link
          to="/login"
          className="text-sm font-semibold text-indigo-400 hover:text-indigo-300"
        >
          Вход →
        </Link>
      </nav>
    </header>
  )
}