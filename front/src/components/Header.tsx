import { Disclosure } from '@headlessui/react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';


function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface Props {
  setIntroIsOpen: (isOpen: boolean) => void;
}
export default function Header({ setIntroIsOpen }: Props) {

  const navigation = [
    {
      name: 'Show Intro', href: '/#',
    },
    {
      name: 'Profile and Model Selection', href: '/#profile-model-selection',
    },
    {
      name: 'Model Targets', href: '/#model-targets',
    },
    {
      name: 'Recommendations', href: '/#recommendations',
    },
    {
      name: 'Visualization', href: '/#visualization',
    },
  ];

  return (
    <Disclosure as="nav" className="bg-sky-800 border-solid border-gray-900 z-[999]">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-sky-50 hover:text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6 text-sky-50" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-center md:items-stretch md:justify-start">
                <div className="flex-shrink-0 flex items-center">
                  <span className="block md:hidden w-auto h-auto text-sky-50 font-bold">
                    {/* <img
                      src="https://www.gstatic.com/images/branding/product/1x/firebase_32dp.png"
                      height={40}
                      width={100}
                      alt="MiND"
                    /> */}
                    Explainable News Recomendations
                  </span>
                  <span className="hidden md:block w-auto h-auto text-sky-50 font-bold">
                    Explainable News Recommendations
                  </span>
                </div>
                <div className="hidden md:block sm:ml-6">
                  <div className="flex space-x-4 text-sm font-medium">
                    {navigation.map((item) => {
                      if (item.name === 'Show Intro') {
                        return (
                          <a
                            href="/#"
                            onClick={() => setIntroIsOpen(true)}
                            className={classNames(
                              'text-sky-50 hover:bg-sky-700 hover:text-sky-50',
                              'px-3 py-2 rounded-md',
                            )}
                          >
                            Show Intro
                          </a>
                        )
                      }
                      return (
                        <a
                          href={item.href}
                          key={item.name}
                          className={classNames(
                            'text-sky-50 hover:bg-sky-700 hover:text-sky-50',
                            'px-3 py-2 rounded-md',
                          )}
                        >
                          {item.name}
                        </a>
                      )
                    }
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    'text-sky-50 hover:bg-sky-700 hover:text-white',
                    'block px-3 py-2 rounded-md text-base font-medium',
                  )}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
