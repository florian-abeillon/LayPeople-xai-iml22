import { Parameters } from '../backend/BackendQueryEngine';
import { Disclosure, Transition } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/solid'
import MultiRangeSlider from './MultiRangeComponent';
import { useEffect, useState } from 'react';
import { LineChart, Label, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import Button from './Button';

function makeArr(startValue: number, stopValue: number, cardinality: number) {
  var arr = [];
  var step = (stopValue - startValue) / (cardinality - 1);
  for (var i = 0; i < cardinality; i++) {
    arr.push(startValue + (step * i));
  }
  return arr;
}

interface Props {
  setParameters: (parameters: Parameters) => void;
  modelType: 'blackbox' | 'whitebox' | 'random'
}

export default function ModelTargets({ setParameters, modelType }: Props) {

  // Methods
  const [minVal, setMinVal] = useState(34);
  const [maxVal, setMaxVal] = useState(64);
  const methods = {
    'popularity': minVal / 100,
    'content': (maxVal - minVal) / 100,
    'users': (100 - maxVal) / 100,
  }

  // History
  const [inflex, setInflex] = useState(1/8);
  const [steep, setSteep] = useState(2);

  const logistic_func = (x: number) => (1 / (1 + Math.exp(- steep * (x - inflex))));
  const Xs = makeArr(1, 10, 10);
  const labelMap = (x: number) => x === 10 ? 'Most recent article' : x === 2 ? 'Least recent article' : '';
  const data = Xs.map(x => (
    { "name": labelMap(x), "data": logistic_func(x / Xs.length) }
    )
  );

  // Objective
  const [exploration, setExploration] = useState(0.3);
  const [diversity, setDiversity] = useState(0.3);
  const [surprise, setSurprise] = useState(0.4);

  const [freshSettings, setFreshSettings] = useState(false);

  const [ initialLoad, setInitialLoad ] = useState<boolean>(true);

  useEffect(
    () => {
      if (!initialLoad) {
        setFreshSettings(true);
      } else {
        setInitialLoad(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      minVal,
      maxVal,
      inflex,
      steep,
      exploration,
      diversity,
      surprise,
    ]
  );
  
  const handleClick = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    setParameters({
      history: [],
      wei_mtd: methods,
      wei_obj: {
        exploration,
        diversity,
        surprise,
      },
      memory: true,
      inflex: inflex,
      steep: steep,
      cats_rm: [],
      subcats_rm: [],
    });
    setFreshSettings(false);
  }

  const ChangeButton = (
    <div className="flex justify-center">
      <Transition
        show={freshSettings}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <form onSubmit={handleClick}>
            <Button type="submit" disabled={false}>
              Changes detected - click to generate predictions
            </Button>
        </form>
      </Transition>
    </div>
  )
  return (
    <div className='bg-sky-50 rounded-lg text-slate-800 py-3' id="model-targets">
      <div className='relative'>
      {modelType !== 'whitebox' && (
        <div className="absolute inset-0 flex justify-center items-center z-10 bg-sky-50/[.95]">
          <p className="text-xl font-semibold text-center px-3">Choose the white box model in order to change model targets</p>
        </div>
      )}
        <div key={1} className='px-3 py-1'>
          <Disclosure as="div" className="w-full px-4 py-2 text-sm font-medium text-left text-slate-900 bg-sky-50 rounded-lg hover:bg-sky-100 focus:outline-none focus-visible:ring focus-visible:ring-sky-500 focus-visible:ring-opacity-75">
            {({ open }) => (
              <>
                <Disclosure.Button className="w-full flex justify-between text-left">
                  <div>
                      <h2 className='text-lg font-bold'>
                        Method
                      </h2>
                      <h3 className="text-sm font-semibold align-center">What methods the model uses to recommend articles</h3>
                  </div>
                  <ChevronUpIcon
                    className={`${
                      open ? 'transform rotate-180' : ''
                    } w-5 h-5 text-sky-500 my-auto`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="pt-5 text-md text-gray-600">
                  <div className="flex justify-center mb-5">
                      <MultiRangeSlider
                        min={0}
                        max={100}
                        maxVal={maxVal}
                        minVal={minVal}
                        setMaxVal={setMaxVal}
                        setMinVal={setMinVal}
                      />
                  </div>
                  <p className="mb-3 font-semibold">
                    You can choose between three methods that contribute to how the model recommends articles. Choose each methods' weight to your liking.
                  </p>
                  <ul className="mb-3 ml-4 list-disc">
                    <li><strong>Popularity</strong> - the model recommends the most popular articles among all users</li>
                    <li><strong>Content similarity</strong> - the model recommends content that is similar to the content you have looked at before</li>
                    <li><strong>User similarity</strong> - the model finds users that are similar to you, and recommends articles that they have read</li>
                  </ul>
                  {ChangeButton}
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
                      {/* <div className='text-slate-600 text-xs tracking-wider'>{capitalizeFirstLetter(article.cat)} - {capitalizeFirstLetter(article.subcat)}</div> */}
                      <h2 className='text-lg font-bold'>Memory</h2>
                      <h3 className="text-sm font-semibold align-center">How the model considers previous articles</h3>
                      {/* <div className='text-slate-600 max-w-prose'>{article.abstract}</div> */}
                  </div>
                  <ChevronUpIcon
                    className={`${
                      open ? 'transform rotate-180' : ''
                    } w-5 h-5 text-sky-500 my-auto`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="pt-5 text-md text-gray-600">
                  <p className="mb-3 font-semibold">
                    You can set what emphasis the model puts on past articles. Tweak the parameters to your liking.
                  </p>
        
                  <div className='w-full px-6 flex flex-row items-center'>
                    <label htmlFor="minmax-range" className="block mb-2 text-sm font-semibold w-80 text-gray-900">Inflection point: {inflex}</label>
                    <input
                      id="minmax-range"
                      type="range"
                      min={0}
                      max={100}
                      value={inflex * 100}
                      onChange={({ target: { value: inflex } }) => {
                        setInflex(parseInt(inflex)/100);
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"></input>
                  </div>
                  <div className='w-full px-6 flex flex-row items-center'>
                    <label htmlFor="minmax-range" className="block mb-2 text-sm font-semibold w-80 text-gray-900">Steepness: {steep}</label>
                    <input
                      id="minmax-range"
                      type="range"
                      min={1}
                      max={1000}
                      value={steep * 100}
                      onChange={({ target: { value: steep } }) => {
                        setSteep(parseInt(steep) / 100 );
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"></input>
                  </div>
                  <div className="flex justify-center">
                  <ResponsiveContainer width="95%" height={300}>
                    <LineChart
                      data={data}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <YAxis domain={[0, 1]} tickCount={6} ticks={[0, 0.2, 0.4, 0.6, 0.8, 1]}>
                      <Label
                        position={'left'}
                        style={{
                            textAnchor: "middle",
                            fontSize: "100%",
                            fill: "#AAAEB0",
                        }}
                        offset={-10}
                        angle={270}
                        value={"Weight of article"} />
                      </YAxis>
                      <XAxis dataKey="name" ticks={['Least recent article', 'Most recent article']} />
                      <Line type="monotone" dot={false} dataKey="data" stroke="#0c4a6e" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                  </div>
                  {ChangeButton}
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
        <div key={3} className='px-3 py-1'>
          <Disclosure as="div" className="w-full px-4 py-2 text-sm font-medium text-left text-slate-900 bg-sky-50 rounded-lg hover:bg-sky-100 focus:outline-none focus-visible:ring focus-visible:ring-sky-500 focus-visible:ring-opacity-75">
            {({ open }) => (
              <>
                <Disclosure.Button className="w-full flex justify-between text-left">
                  <div>
                      {/* <div className='text-slate-600 text-xs tracking-wider'>{capitalizeFirstLetter(article.cat)} - {capitalizeFirstLetter(article.subcat)}</div> */}
                      <h2 className='text-lg font-bold'>Objective</h2>
                      <h3 className="text-sm font-semibold align-center">What the model prioritizes when creating recomendations</h3>
                      {/* <div className='text-slate-600 max-w-prose'>{article.abstract}</div> */}
                  </div>
                  <ChevronUpIcon
                    className={`${
                      open ? 'transform rotate-180' : ''
                    } w-5 h-5 text-sky-500 my-auto`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="pt-5 text-md text-gray-600">
                <p className="mb-3 font-semibold">
                    You can choose between three methods that contribute to how the model recommends articles. Choose each methods' weight to your liking.
                  </p>
        
                  <div className='w-full px-6 flex flex-row items-center'>
                    <label htmlFor="minmax-range" className="block mb-2 text-sm font-semibold w-80 text-gray-900">Exploration: {Math.round(exploration * 100)}%</label>
                    <input
                      id="minmax-range"
                      type="range"
                      min={0}
                      max={100}
                      value={exploration * 100}
                      onChange={({ target: { value: exploration } }) => {
                        setExploration(parseInt(exploration)/100);
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"></input>
                  </div>
                  <div className='w-full px-6 flex flex-row items-center'>
                    <label htmlFor="minmax-range" className="block mb-2 text-sm font-semibold w-80 text-gray-900">Diversity: {Math.round(diversity * 100)}%</label>
                    <input
                      id="minmax-range"
                      type="range"
                      min={1}
                      max={100}
                      value={diversity * 100}
                      onChange={({ target: { value: diversity } }) => {
                        setDiversity(parseInt(diversity) / 100 );
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"></input>
                  </div>
                  <div className='w-full px-6 flex flex-row items-center'>
                    <label htmlFor="minmax-range" className="block mb-2 text-sm font-semibold w-80 text-gray-900">Surprise: {Math.round(surprise * 100)}%</label>
                    <input
                      id="minmax-range"
                      type="range"
                      min={1}
                      max={1000}
                      value={surprise * 1000}
                      onChange={({ target: { value: surprise } }) => {
                        setSurprise(parseInt(surprise) / 1000 );
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"></input>
                  </div>
                  <ul className="mb-3 ml-4 list-disc">
                    <li>
                      <strong>Exploration / exploitation </strong>
                      - when set to 100%, the model doesn't consider the history and tends to explore, but when set closer to 0%,
                      the model tries to exploit what it already knows about your previous history.
                      </li>
                      <li>
                        <strong>Diversity </strong>
                        - how much the model tries to serve you different categories of articles.
                      </li>
                    <li>
                      <strong>Surprise </strong>
                      - the proportion of articles that are sampled at random and not based on model predictions.
                    </li>
                  </ul>
                  {ChangeButton}
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
      </div>
    </div>
  );
}
