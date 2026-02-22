

export default function Home() {
  return (
    <div className="relative isolate min-h-screen bg-gray-900 text-white overflow-hidden">

      {/* Gradient blur background */}
      <div className="absolute inset-0 -z-10 blur-3xl opacity-30">
        <div className="absolute left-1/2 top-1/3 w-[800px] h-[800px] -translate-x-1/2 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-full" />
      </div>

      <div className="mx-auto max-w-3xl px-6 pt-40 text-center">
        <h1 className="text-5xl sm:text-6xl font-bold leading-tight">
  Управляйте фитнес-клубом
  <span className="block text-indigo-400">
    профессионально и эффективно
  </span>
</h1>

<p className="mt-8 text-lg text-gray-400">
  Учет клиентов, абонементов, посещений, шкафчиков и финансов —
  всё в одной современной системе.
</p>

<div className="mt-10 flex justify-center gap-6">
  <button className="rounded-md bg-indigo-600 px-6 py-3 font-semibold hover:bg-indigo-500 transition">
    Попробовать бесплатно 15 дней
  </button>

  <button className="font-semibold text-gray-300 hover:text-white">
    Смотреть демо →
  </button>
</div>
      </div>
    </div>
  )
}