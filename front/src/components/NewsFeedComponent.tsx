import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/solid'
import { Article, Model } from '../types/DataPoint';
import PieChartComponent from './PieChartComponent';

interface Props {
  articles: Article[] | undefined,
  loading: boolean,
  model: Model,
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function truncate(string: string, nCharacters: number) {
  return (string && string.length > nCharacters) ? string.slice(0, nCharacters-1) + '...' : string;
};
export default function NewsFeed({ articles, loading, model }: Props) {
  return (
    <div className='bg-sky-50 rounded-lg text-slate-800 py-3' id="recommendations">
      <div className='h-96 overflow-y-scroll'>
      {loading &&
        <div className="text-center h-full w-full flex items-center justify-center text-xl font-bold loading">Loading</div>
      }
      {!loading && articles && articles.map(article => (
        <div key={article.index} className='px-3 py-1'>
          <Disclosure as="div" className="w-full px-4 py-2 text-sm font-medium text-left text-slate-900 bg-sky-50 rounded-lg hover:bg-sky-100 focus:outline-none focus-visible:ring focus-visible:ring-sky-500 focus-visible:ring-opacity-75">
            {({ open }) => (
              <>
                <Disclosure.Button className="w-full flex justify-between text-left">
                  <div className="w-11/12 h-18">
                      <div className='text-slate-600 text-xs tracking-wider'>{capitalizeFirstLetter(article.cat)} - {capitalizeFirstLetter(article.subcat)}</div>
                      <h2 className='font-bold'>{article.title}</h2>
                      <div className='text-slate-600 w-full'>{truncate(article.abstract, 200)}</div>
                  </div>
                  <ChevronUpIcon
                    className={`${
                      open ? 'transform rotate-180' : ''
                    } w-5 h-5 text-sky-500 my-auto`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="pt-3 text-sm text-gray-500">
                    {model.name === 'whitebox' && (
                      <>
                        <p className='mb-5 italic text-sm'>In the pie chart below, you can see how each method contributed to this article being recommended</p>
                        <PieChartComponent article={article} />
                      </>
                    )
                    }
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
          </div>
        ))
      }
      </div>
    </div>
  );
}
