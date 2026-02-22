export default function Contact() {
  return (
    <div className="bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">

        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Свяжитесь с нами
          </h2>
          <p className="mt-6 text-lg text-gray-400">
            Если у вас есть вопросы по подключению или работе системы —
            наша команда готова помочь.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">

          <div className="rounded-2xl bg-gray-800 p-8">
            <h3 className="text-lg font-semibold text-white">
              Отдел продаж
            </h3>
            <p className="mt-4 text-gray-400 text-sm">
              Подключение новых фитнес-клубов и консультация по тарифам.
            </p>
            <div className="mt-6 text-sm space-y-2 text-gray-300">
              <p>Email: sales@allclubs.uz</p>
              <p>Телефон: +998 90 123 45 67</p>
            </div>
          </div>

          <div className="rounded-2xl bg-gray-800 p-8">
            <h3 className="text-lg font-semibold text-white">
              Техническая поддержка
            </h3>
            <p className="mt-4 text-gray-400 text-sm">
              Помощь в работе системы и решение технических вопросов.
            </p>
            <div className="mt-6 text-sm space-y-2 text-gray-300">
              <p>Email: support@allclubs.uz</p>
              <p>Телефон: +998 90 987 65 43</p>
            </div>
          </div>

        </div>

        {/* Company Info */}
        <div className="mt-20 rounded-2xl bg-gray-800 p-10 text-center">
          <h3 className="text-lg font-semibold text-white">
            О компании ALLCLUBS
          </h3>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            ALLCLUBS — современная SaaS-платформа для автоматизации
            фитнес-клубов в Узбекистане. Мы помогаем владельцам
            эффективно управлять бизнесом и увеличивать прибыль.
          </p>
        </div>

      </div>
    </div>
  )
}