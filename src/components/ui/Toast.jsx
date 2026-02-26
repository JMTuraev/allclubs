import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { Transition } from "@headlessui/react"
import { CheckCircleIcon } from "@heroicons/react/24/outline"
import { XMarkIcon } from "@heroicons/react/20/solid"

export default function Toast({
  message = "Saved successfully",
  duration = 3000,
  onClose,
}) {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false)
      setTimeout(() => {
        if (onClose) onClose()
      }, 200)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return createPortal(
    <div
      aria-live="assertive"
      className="pointer-events-none fixed bottom-6 right-6 z-[9999]"
    >
      <Transition
        show={show}
        enter="transform ease-out duration-300 transition"
        enterFrom="translate-y-4 opacity-0"
        enterTo="translate-y-0 opacity-100"
        leave="transform ease-in duration-200 transition"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="pointer-events-auto w-[320px] rounded-xl bg-[#111827] border border-white/10 shadow-2xl">
          <div className="p-4 flex items-start">
            <CheckCircleIcon className="size-6 text-green-500 shrink-0" />

            <div className="ml-3 flex-1">
              <p className="text-sm font-semibold text-white">
                {message}
              </p>
            </div>

            <button
              onClick={() => setShow(false)}
              className="ml-4 text-gray-400 hover:text-white"
            >
              <XMarkIcon className="size-5" />
            </button>
          </div>
        </div>
      </Transition>
    </div>,
    document.body
  )
}