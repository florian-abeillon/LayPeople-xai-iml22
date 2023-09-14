import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'

interface Props {
  isOpen: boolean,
  setIsOpen: (isOpen: boolean) => void,
}
export default function Intro({ isOpen, setIsOpen }: Props) {

  function closeModal() {
    setIsOpen(false);
    localStorage.setItem("intro", "false");
  }

  return (
    <>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Explainable News Recommendations
                  </Dialog.Title>
                  <div className="mt-2 text-md text-gray-500 space-y-1">
                    <p className="">
                      This is a project in the course <i>Interactive Machine Learning</i> tought by Dr. Menna Elassady in Spring 2022 at ETH Zürich.
                    </p>
                    <p>
                      The goal is to provide a simple and intuitive way to explore how different recommendation models affect news recommendations.
                    </p>
                    <p>
                      We recommend starting out with selecting a profile and model, and then exploring the different model targets.
                      Then you can see how that influences the news feed below.
                    </p>
                    <p>
                      Contact: <a href="mailto:fabeillon@ethz.ch" className="underline">Florian Abeillon</a> and <a href="mailto:sarnorsson@ethz.ch" className="underline">Sverrir Arnórsson</a>
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Got it, thanks!
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}