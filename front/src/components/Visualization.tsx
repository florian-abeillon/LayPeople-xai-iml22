import React, { useEffect, useState, Fragment } from 'react'
import { scaleLinear, scaleOrdinal } from "@visx/scale"
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { Circle } from "@visx/shape"
import { Group } from "@visx/group"
import { ParentSize } from '@visx/responsive';
import { LegendOrdinal } from "@visx/legend"
import { extent } from "d3"
// import {Types} from './types'
import { queryBackend } from '../backend/BackendQueryEngine'
import { DataPoint, Article, Model } from '../types/DataPoint'
import { catsMap } from './cats'

const catColors = [
  "#fde725",
  "#d2e21b",
  "#a5db36",
  "#7ad151",
  "#54c568",
  "#35b779",
  "#22a884",
  "#1f988b",
  "#23888e",
  "#2a788e",
  "#31688e",
  "#39568c",
  "#414487",
  "#472f7d",
  "#481a6c",
  "#440154",
]

interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}
interface ScatterPlotPropsInner {
  width: number,
  articles: Article[] | undefined,
  height: number,
  margin: Margin,
  userEmbedding ?: number[] | undefined,
}
interface ScatterPlotProps {
  margin: Margin,
  articles: Article[] | undefined,
  model: Model,
  userEmbedding: number[] | undefined,
}

interface Type {
  name: 'News' | 'Users',
  value: 'news' | 'users',
}
const types: Type[] = [
  { name: 'News', value: 'news' },
  { name: 'Users', value: 'users' },
]

const Visualization = ({ margin, articles, model, userEmbedding }: ScatterPlotProps) => {
  const [type, setType] = useState<Type>(types[0])
  const [data, setDataPoints] = useState<DataPoint[]>();
  const [loading, setLoading] = useState<boolean>(false);


  useEffect(() => {
    setLoading(true);
    queryBackend(`get-visualization`, [{ name: 'el_type', value: type.value }, { name: 'model_name', value: model.name }])
      .then((response) => response.json())
      .then(d => JSON.parse(d))
      .then(d => d.data as DataPoint[])
      .then((dataPoints) => {
        setDataPoints(dataPoints);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false)
      });
  }, [type, model]);
  return (
    <div className='bg-sky-50 rounded-lg text-slate-800 py-3 w-full flex flex-col px-5' id="visualization">
      <Listbox value={type} onChange={setType}>
        <div className="relative mt-1 max-w-md w-full lg:w-6/12 mx-auto">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-300 sm:text-sm">
            <span className="block truncate">{type.name}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <SelectorIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {types.map((type, typeIdx) => (
                <Listbox.Option
                  key={typeIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-sky-100 text-sky-900' : 'text-gray-900'
                    }`
                  }
                  value={type}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {type.name}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sky-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      <p className="text-base text-center my-5">
        {
          type.value === "news"
          ? `
          Here you can see how different articles from different categories similar to each other.
          Articles highlighted in red are the ones that have been recommended for you.
          `
          : "Here you can see how different users similar to each other. The user highlighted in red is the one used for the recommendations."
        }
      </p>
      {loading &&
        <div className="text-center h-full w-full flex items-center justify-center text-xl font-bold loading">Loading</div>
      }
    {!loading && data &&

      <ParentSize>
        {({ width }) => type.value === 'news' ? (
          <NewsPlot data={data} width={width} height={800} margin={margin} articles={articles} />
        )
        : (
          <UsersPlot data={data} width={width} height={800} margin={margin} articles={articles} userEmbedding={userEmbedding} />
        )
      }
      </ParentSize>
    }
  </div>
  );
}

const NewsPlot = (props: ScatterPlotPropsInner & { data: DataPoint[] }) => {
  const innerWidth = props.width - props.margin.left - props.margin.right
  const innerHeight = props.height - props.margin.top - props.margin.bottom

  let data = props.data;

  if (props.articles) {
    data = data.map(d => {
      const article = props.articles ? props.articles.find(a => a.index === d.index) : undefined
      if (article) {
        return {
          ...d,
          isInRecommendation: true,
        }
      }
      return d
    })
    data.sort(function(x, y) {
      if (!x.isInRecommendation && y.isInRecommendation) {
        return -1;
      }
      if (x.isInRecommendation && !y.isInRecommendation) {
        return 1;
      }
      return 0;
    });
  }

  const x = (d: DataPoint) => d.X1
  const y = (d: DataPoint) => d.X2
  const color = (d: DataPoint) => d.cat
  const xScale = scaleLinear({
    range: [props.margin.left, innerWidth + props.margin.left],
    domain: extent(props.data, x) as [number, number],
  })

  const yScale = scaleLinear({
    range: [innerHeight + props.margin.top, props.margin.top],
    domain: extent(props.data, y) as [number, number],
    nice: true,
  })
  const colorScale = scaleOrdinal({
    range: catColors,
    domain: [...Array.from(new Set(props.data.map(color)))],
  })
  const r = (point: DataPoint) => {
    if (point.isInRecommendation) return 8;
    return 2
  }
  const strokeWidth = (point: DataPoint) => {
    if (point.isInRecommendation) return 3;
    return 0;
  }
  const labelFormat = (input: string) => (catsMap(input))
  return (
    <div className="flex flex-row">
      <div className="flex flex-col">
        <span className="font-bold">News categories</span>
        <LegendOrdinal
          scale={colorScale}
          direction="column"
          shape="circle"
          labelFormat={labelFormat}
          style={{
            marginRight: "2em",
            display: "flex",
            justifyContent: "space-around"
          }}
        />
      </div>
      <svg width={innerWidth} height={innerHeight} className='mx-auto'>
        <Group pointerEvents='none'>
          {data.map((point, i) => (
            <Circle
              key={i}
              cx={xScale(x(point))}
              cy={yScale(y(point))}
              r={r(point)}
              strokeWidth={strokeWidth(point)}
              stroke="#FF0000"
              fill={colorScale(color(point))}
              fillOpacity={0.8}
            />
          ))}
        </Group>
      </svg>
    </div>
  )
}

const UsersPlot = (props: ScatterPlotPropsInner & { data: DataPoint[] }) => {
  const innerWidth = props.width - props.margin.left - props.margin.right
  const innerHeight = props.height - props.margin.top - props.margin.bottom

  const x = (d: DataPoint) => d.X1
  const y = (d: DataPoint) => d.X2
  const xScale = scaleLinear({
    range: [props.margin.left, innerWidth + props.margin.left],
    domain: extent(props.data, x) as [number, number],
  })

  const yScale = scaleLinear({
    range: [innerHeight + props.margin.top, props.margin.top],
    domain: extent(props.data, y) as [number, number],
    nice: true,
  })
  return (
    <div className="flex flex-row">
      <svg width={innerWidth} height={innerHeight} className='mx-auto'>
        <Group pointerEvents='none'>
          {props.data.map((point, i) => (
            <Circle
              key={i}
              cx={xScale(x(point))}
              cy={yScale(y(point))}
              r={2}
              fill="#0c4a6e"
              fillOpacity={0.8}
            />
          ))}
          { props.userEmbedding && (
            <Circle
              key='user'
              cx={xScale(props.userEmbedding[0])}
              cy={yScale(props.userEmbedding[1])}
              r={8}
              strokeWidth={3}
              stroke="#FF0000"
              fill="#0c4a6e"
              fillOpacity={0.8}
            />
          )
          }
        </Group>
      </svg>
    </div>
  )
}


export default Visualization;

