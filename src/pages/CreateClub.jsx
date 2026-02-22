import { useNavigate } from "react-router-dom"

export default function CreateClub() {
  // Keyin Firebase'dan keladi
  const user = {
    displayName: "Jamshid Karimov",
    email: "jamshid@gmail.com",
  }
const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* LEFT SIDE */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-white">
            Добро пожаловать,
          </h1>
          <p className="mt-2 text-2xl font-semibold text-indigo-400">
            {user.displayName}
          </p>

          <p className="mt-6 text-gray-400 max-w-md">
            Чтобы начать работу с платформой ALLCLUBS,
            создайте ваш фитнес-клуб. После этого вы получите
            доступ к панели управления.
          </p>

          <div className="mt-10 rounded-xl bg-gray-800 p-6">
            <p className="text-sm text-gray-400">Email</p>
            <p className="text-white font-medium">{user.email}</p>
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="bg-gray-800 rounded-2xl p-8 shadow-xl">
          <h2 className="text-xl font-semibold text-white">
            Создание клуба
          </h2>

          <form className="mt-8 space-y-6">

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Название клуба
              </label>
              <input
                type="text"
                placeholder="Например: Iron Fitness"
                className="mt-2 w-full rounded-md bg-gray-900 px-4 py-2 text-white outline outline-1 outline-gray-700 focus:outline-2 focus:outline-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Город
              </label>
              <input
                type="text"
                placeholder="Ташкент"
                className="mt-2 w-full rounded-md bg-gray-900 px-4 py-2 text-white outline outline-1 outline-gray-700 focus:outline-2 focus:outline-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Телефон
              </label>
              <input
                type="text"
                placeholder="+998"
                className="mt-2 w-full rounded-md bg-gray-900 px-4 py-2 text-white outline outline-1 outline-gray-700 focus:outline-2 focus:outline-indigo-500"
              />
            </div>

            <button
              type="button"
               onClick={() => navigate("/app/dashboard")}
              className="w-full rounded-md bg-indigo-600 py-2.5 font-semibold text-white hover:bg-indigo-500 transition"
            >
              Создать клуб
            </button>

          </form>
        </div>

      </div>
    </div>
  )
}