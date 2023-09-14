import { RadioGroup, Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/solid'
import { Profile, Model } from '../types/DataPoint'

export const profiles: Profile[] = [
  {
    title: 'Politician',
    name: 'politician',
    categories: ['World news', 'Politics', 'Economy'],
    logo: (
      <g>
        <path d="M328.4,210.8c6.2,2.2,12.3,3.9,19,3.9h-2.8h5h5h-3.9c29.1-1.1,52.1-24.6,52.1-53.8c0-22.4-13.4-41.4-32.5-49.8
                    c-6.2-2.8-12.9-3.9-20.2-3.9c-29.7,0-53.8,24.1-53.8,53.8C296,183.4,309.4,202.4,328.4,210.8L328.4,210.8z"/>
        <path d="M488.6,309.4H211.4c-5,0-8.4,3.4-8.4,8.4v30.8c0,4.5,3.9,8.4,8.4,8.4l4.5,0h272.7c5,0,8.4-3.4,8.4-8.4v-30.8
                    C497,312.8,493.6,309.4,488.6,309.4L488.6,309.4z"/>
        <path d="M380.5,219.8c-9,5-19.6,7.3-30.2,7.3c-11.2,0-21.3-2.8-30.2-7.3c-31.9,10.6-56.6,37.5-63.8,71.1h188.7
                    C437.1,257.3,412.4,230.4,380.5,219.8L380.5,219.8z"/>
        <path d="M229.9,584.4c0,5,3.4,8.4,8.4,8.4h222.9c5,0,8.4-3.4,8.4-8.4V371.6H229.9L229.9,584.4z M300.4,477.4
                    c4.5-3.9,10.6-3.9,14.6,0l16.2,16.2l56-56c3.9-3.9,10.6-3.9,14.6,0c3.9,3.9,3.9,10.6,0,14.6l-63.3,63.3c-2.2,2.2-5,2.8-7.3,2.8
                    c-1.7,0-5-0.6-7.3-2.8L300.4,492c-2.2-2.2-3.4-4.5-3.4-7.3S298.2,479.6,300.4,477.4L300.4,477.4z"/>
      </g>
    ) as JSX.Element,
  },
  {
    title: 'Athlete',
    name: 'athlete',
    categories: ['Football', 'Soccer', 'Basketball', 'Golf'],
    logo: (
      <g>
        <path d="M526.2,496.9c20.9-25,36.6-54.6,45.4-87.5c15.9-59.2,7.7-121.1-22.9-174.2c-30.7-53.1-80.2-91.1-139.4-106.9
            c-5-1.3-10.1-2.5-15.2-3.5c-0.2,0-0.4-0.1-0.6-0.1c-14.4-2.8-29.1-4.3-43.7-4.3c-98.2,0-185.1,62.9-216.8,154.7
            c-0.3,0.8-0.5,1.6-0.8,2.3c-1.4,4.3-2.8,8.7-4,13.2c-0.8,3-1.5,6-2.2,9.2c-12.7,56.4-3.9,114.6,25.1,165
            c30.7,53.1,80.2,91.1,139.4,107c19.5,5.2,39.5,7.9,59.5,7.9c57.7,0,111.4-21.7,152.4-58.2c0.1-0.1,0.3-0.3,0.4-0.4
            c4-3.5,7.8-7.2,11.5-11c0.3-0.3,0.5-0.5,0.8-0.8c3.8-3.9,7.4-7.9,10.8-12.1C526.1,497.1,526.2,497,526.2,496.9L526.2,496.9z
             M307.4,514.2l-28.2-86.8l24-33.1h93.5l24.6,33.9l-28,86.1H307.4z M286,141.2l58.4,42.4v49.5l-77.9,56.6c-0.1,0.1-0.2,0.3-0.4,0.4
            l-39.6-12.9l-27.6-84.8C223.4,169,253.2,151.3,286,141.2L286,141.2z M501.1,192.4l-27.6,84.9l-39.6,12.9c-0.1-0.1-0.2-0.3-0.4-0.4
            l-77.9-56.6v-49.5l58.3-42.4C447,151.4,476.7,168.9,501.1,192.4L501.1,192.4z M523.6,419.3h-94.9l-23-31.6l27.8-85.7l43-14
            l72.5,52.7L523.6,419.3z M223.4,288l43,14l27.8,85.7l-23.4,32.2l-94.2,0l-25.7-79.1L223.4,288z M560.9,406.5
            c-4.4,16.4-10.6,31.9-18.4,46.4l-9-27.7l25.8-79.5c0.7-0.2,1.5-0.4,2.1-0.9l6.8-4.9C569.1,362.1,566.8,384.5,560.9,406.5
            L560.9,406.5z M131.8,340l6.7,4.9c0.6,0.5,1.4,0.7,2.1,0.9l26.4,81.3l-8.9,27.3C138.9,418.8,129.9,379.5,131.8,340L131.8,340z
             M293.5,560.9c-8.7-2.3-17.2-5.2-25.4-8.6l37.1-27h91.5l36.5,26.5c-25.8,10.6-53.9,16.5-83,16.5C331.1,568.4,312,565.9,293.5,560.9
            L293.5,560.9z"/>
      </g>
    ) as JSX.Element,
  },
  {
    title: 'Health-Guru',
    name: 'health_guru',
    categories: ['Fitness', 'Health', 'Lifestyle'],
    logo: (
      <g>
        <path d="M467.8,116.8c-46.6-0.4-90.2,23.4-115.2,62.8c-0.6,0.9-1.6,1.5-2.7,1.5s-2.1-0.6-2.7-1.5c-25-39.4-68.5-63.1-115.2-62.8
		C151,117.3,92.1,187.3,98.5,268.3c12.1,153.1,191,279.7,239.5,311.3h0c3.6,2.3,7.8,3.6,12.1,3.6s8.5-1.2,12.1-3.6
		c48.5-31.6,227.4-158.2,239.5-311.4C607.9,187.3,549,117.3,467.8,116.8L467.8,116.8z M463.3,392H392v71.3h-84V392h-71.3v-84H308
		v-71.3h84V308h71.3L463.3,392z"/>
      </g>
    ) as JSX.Element,
  },
]

export const models: Model[] = [
  {
    title: 'White box',
    name: 'whitebox',
    description: 'Option to customize targets',
    logo: (
      <g>
        <path d="M299,271.9c3.7,2,7.1,4.4,10.4,6.9l10.8-19.1c-3.9-1.6-7.6-3.6-11.1-5.8L299,271.9z"/>
        <path d="M477.7,406.9c-3.6,2.1-7.3,4-11.2,5.5l19.7,34.7c3.5-2.3,7.1-4.3,11-6L477.7,406.9z"/>
        <path d="M202.9,441.1c3.8,1.7,7.5,3.7,10.9,6l19.7-34.7c-3.9-1.5-7.6-3.4-11.2-5.5L202.9,441.1z"/>
        <path d="M390.8,254c-3.5,2.2-7.2,4.1-11.1,5.8l10.8,19.1c3.3-2.6,6.7-4.9,10.4-6.9L390.8,254z"/>
        <path d="M343.8,265.4v169.2c2.1-0.2,4.1-0.3,6.2-0.3s4.2,0.1,6.2,0.3V265.4c-2.1,0.2-4.1,0.3-6.2,0.3
          C347.9,265.7,345.8,265.5,343.8,265.4L343.8,265.4z"/>
        <path d="M415.2,188c0-36-29.2-65.2-65.2-65.2c-36,0-65.2,29.2-65.2,65.2c0,36,29.2,65.2,65.2,65.2C386,253.2,415.2,224,415.2,188z"
          />
        <path d="M327.2,340.2c0,36-29.2,65.2-65.2,65.2c-36,0-65.2-29.2-65.2-65.2c0-36,29.2-65.2,65.2-65.2
          C298,275,327.2,304.2,327.2,340.2"/>
        <path d="M503.3,340.2c0,36-29.2,65.2-65.2,65.2s-65.2-29.2-65.2-65.2c0-36,29.2-65.2,65.2-65.2S503.3,304.2,503.3,340.2"/>
        <path d="M594,512c0,36-29.2,65.2-65.2,65.2c-36,0-65.2-29.2-65.2-65.2s29.2-65.2,65.2-65.2C564.8,446.8,594,476,594,512"/>
        <path d="M415.2,512c0,36-29.2,65.2-65.2,65.2S284.8,548,284.8,512c0-36,29.2-65.2,65.2-65.2S415.2,476,415.2,512"/>
        <path d="M236.5,512c0,36-29.2,65.2-65.2,65.2c-36,0-65.2-29.2-65.2-65.2s29.2-65.2,65.2-65.2C207.3,446.8,236.5,476,236.5,512"/>
      </g>
    ) as JSX.Element,
  },
  {
    title: 'Black box',
    name: 'blackbox',
    description: 'No option to customize targets',
    logo: (
      <g>
        <path d="M512.4,268.5v178.6l-156.8,89V357.6L512.4,268.5z"/>
        <path d="M503.4,252.8l-150.6,87.4l-157.9-87.4l154-89L503.4,252.8z"/>
        <path d="M338.8,357.6v178.6l-151.2-89V268.5L338.8,357.6z"/>
      </g>
    ) as JSX.Element,
  },
  {
    title: 'Random',
    name: 'random',
    description: 'No option to customize targets',
    logo: (
      <g>
        <path d="M115.4,272.4c44.8,0,88.5,18.5,119.3,51l4.5,4.5l43.7-45.4l-2.2-2.2c-42.6-44.8-103-70.6-164.6-70.6
          c-17.4,0-31.4,14-31.4,31.4C84.1,258.4,98.1,272.4,115.4,272.4L115.4,272.4z"/>
        <path d="M608.8,445.5l-93.5-67.8c-11.8-8.4-28,0-28,14.6v35.8c-43.1-1.1-84-19.6-113.7-50.4l-4.5-5L325.4,418l2.2,2.2
          c41.4,43.7,99.1,68.9,159.6,70v36.4c0,14.6,16.2,23,28,14.6l93.5-67.8C618.3,466.8,618.3,452.2,608.8,445.5L608.8,445.5z"/>
        <path d="M487.3,272.4v35.8c0,14.6,16.2,23,28,14.6l93.5-67.8c9.5-7.3,9.5-21.3,0-28.6l-93.5-67.8c-11.8-8.4-28,0-28,14.6v36.4
          c-59.9,1.1-118.2,26.9-159.6,70l-93,97.4c-30.8,32.5-74.5,51-119.3,51c-17.4,0-31.4,14-31.4,31.4s14,31.4,31.4,31.4
          c61.6,0,122.1-25.8,164.6-70.6l93-97.4C403.3,292,444.1,274.1,487.3,272.4L487.3,272.4z"/>
      </g>
    ) as JSX.Element,
  },
]

interface Props {
  profile: Profile,
  setProfile: (profile: Profile) => void,
  model: Model,
  setModel: (model: Model) => void,
}
export function ProfileModelSelector({ profile, setProfile, model, setModel }: Props) {
  // const [profile, setprofile] = useState(profiles[0])

  return (
    <div className='bg-sky-50 rounded-lg text-slate-800 py-3' id="profile-model-selection">
        <div key={1} className='px-3 py-1'>
          <Disclosure as="div" className="w-full px-4 py-2 text-sm font-medium text-left text-slate-900 bg-sky-50 rounded-lg hover:bg-sky-100 focus:outline-none focus-visible:ring focus-visible:ring-sky-500 focus-visible:ring-opacity-75">
            {({ open }) => (
              <>
                <Disclosure.Button className="w-full flex justify-between text-left">
                  <div>
                      <h2 className='text-lg font-bold'>
                        Profile
                      </h2>
                      <h3 className="text-sm font-semibold align-center">What kinds of articles have you been reading before?</h3>
                  </div>
                  <ChevronUpIcon
                    className={`${
                      open ? 'transform rotate-180' : ''
                    } w-5 h-5 text-sky-500 my-auto`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="pt-5 text-md text-gray-600">
                  <p className="mb-3">
                    The models need to know what articles you have been reading previously in order to serve you recommendations.
                    Below, you can choose from three pre-selected profiles which represent different types of histories.
                  </p>
                  <RadioGroup value={profile} onChange={setProfile}>
                  <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
                  <div className="space-y-2">
                    {profiles.map((profile) => (
                      <RadioGroup.Option
                        key={profile.name}
                        value={profile}
                        className={({ active, checked }) =>
                          `${active
                            ? 'ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300'
                            : ''
                          }
                          ${checked ? 'bg-sky-900 bg-opacity-75 text-white' : 'bg-white'
                          }
                            relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                        }
                      >
                        {({ active, checked }) => (
                          <>
                            <div className="flex w-full items-center justify-between">
                              <div className="flex items-center">
                                <svg
                                  viewBox="0 0 700 700"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className={`h-10 w-10 fill-current ${checked ? 'fill-sky-100' : 'fill-gray-500'}`}
                                  x={0}
                                  y={0}
                                >
                                  {profile.logo}
                                </svg>
                                <div className="text-sm">
                                  <RadioGroup.Label
                                    as="p"
                                    className={`font-medium  ${checked ? 'text-white' : 'text-gray-900'
                                      }`}
                                  >
                                    {profile.title}
                                  </RadioGroup.Label>
                                  <RadioGroup.Description
                                    as="span"
                                    className={`inline ${checked ? 'text-sky-100' : 'text-gray-500'
                                      }`}
                                  >
                                    <span>{profile.categories.join('\t' + String.fromCharCode(183) + '\t')}</span>
                                  </RadioGroup.Description>
                                </div>
                              </div>
                              {checked && (
                                <div className="shrink-0 text-white">
                                  <CheckIcon className="h-6 w-6" />
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
                </Disclosure.Panel>
                
              </>
            )}
          </Disclosure>
        </div>
        <div key={2} className='px-3 py-1'>
          <Disclosure as="div" className="w-full px-4 py-2 text-sm font-medium text-left text-slate-900 bg-sky-50 rounded-lg hover:bg-sky-100 focus:outline-none focus-visible:ring focus-visible:ring-sky-500 focus-visible:ring-opacity-75">
            {({ open }) => (
              <>
                <Disclosure.Button className="w-full flex justify-between text-left">
                  <div>
                      <h2 className='text-lg font-bold'>
                        Model
                      </h2>
                      <h3 className="text-sm font-semibold align-center">What kind of model do you want to create recommendations?</h3>
                  </div>
                  <ChevronUpIcon
                    className={`${
                      open ? 'transform rotate-180' : ''
                    } w-5 h-5 text-sky-500 my-auto`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="pt-5 text-md text-gray-600">
                  <p className="mb-3">Here is some text about how to select between the two models</p>
                  <RadioGroup value={model} onChange={setModel}>
                    <div className="space-y-2">
                      {models.map((model) => (
                        <RadioGroup.Option
                        key={model.name}
                        value={model}
                        className={({ active, checked }) =>
                          `${active
                            ? 'ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300'
                            : ''
                          }
                          ${checked ? 'bg-sky-900 bg-opacity-75 text-white' : 'bg-white'
                          }
                            relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                        }
                      >
                        {({ active, checked }) => (
                          <>
                            <div className="flex w-full items-center justify-between">
                              <div className="flex items-center">
                                <svg
                                  viewBox="0 0 700 700"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className={`h-10 w-10 fill-current ${checked ? 'fill-sky-100' : 'fill-gray-500'}`}
                                  x={0}
                                  y={0}
                                >
                                  {model.logo}
                                </svg>
                                <div className="flex flex-row">
                                  <RadioGroup.Label
                                    as="p"
                                    className={`font-medium  ${checked ? 'text-white' : 'text-gray-900'
                                      }`}
                                  >
                                    {model.title}
                                  </RadioGroup.Label>
                                  <RadioGroup.Description
                                    as="span"
                                    className={`inline ${checked ? 'text-sky-100' : 'text-gray-500'
                                      }`}
                                  >
                                    <span className="pl-3">{model.description}</span>
                                  </RadioGroup.Description>
                                </div>
                              </div>
                              {checked && (
                                <div className="shrink-0 text-white">
                                  <CheckIcon className="h-6 w-6" />
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </RadioGroup.Option>
                      ))}
                    </div>
                  </RadioGroup>
                </Disclosure.Panel>
                
              </>
            )}
          </Disclosure>
        </div>
    </div>
  );
}

function CheckIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
