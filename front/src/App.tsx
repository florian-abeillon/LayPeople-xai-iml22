import { useEffect, useState } from 'react';
import { queryBackend, Parameters, defaultParameters } from './backend/BackendQueryEngine';
import Header from './components/Header';
import NewsFeed from './components/NewsFeedComponent';
import Visualization from './components/Visualization';
import { ProfileModelSelector, profiles, models } from './components/ProfileModelSelector';
import { Article, Profile, Model, UrlParameter, Statistic } from './types/DataPoint';
import ModelTargets from './components/ModelTargets';
import Statistics from './components/Statistics';
import Intro from './components/Intro';


const App = () => {
  const [model, setModel] = useState<Model>(models[0]);
  // TODO: set this for each request, possibly component-wise
  const [dataIsLoading, setDataIsLoading ] = useState<boolean>(false);
  const [error, setError ] = useState<boolean>(false);

  const [articles, setArticles] = useState<Article[]>();
  const [profile, setProfile] = useState<Profile>(profiles[0]);
  const [parameters, setParameters] = useState<Parameters>(defaultParameters)
  const [userEmbedding, setUserEmbedding] = useState<number[]>();
  const [stats, setStats] = useState<Statistic[]>();

  const introStorage = localStorage.getItem('intro') ? JSON.parse(localStorage.getItem('intro') as string) : true;  
  let [introIsOpen, setIntroIsOpen] = useState<boolean>(introStorage);

  const getData = async () => {
    setDataIsLoading(true);
    setError(false);
    try {
      const queryArray: UrlParameter[] = [{ name: 'model_name', value: model.name }];
      if (profile.name) { queryArray.push({ name: 'profile', value: profile.name }) }
      const data = await queryBackend(`get-news`, queryArray, parameters);
      const d = await data.json();
      const parsedArticles = JSON.parse(d.recos);
      const parsedUserEmbedding = JSON.parse(d.user);
      const parsedStats = JSON.parse(d.stats);
      setArticles(parsedArticles.data);
      setUserEmbedding(parsedUserEmbedding);
      setUserEmbedding(parsedUserEmbedding);
      setStats(parsedStats.data)
      setDataIsLoading(false);
    } catch (e) {
      console.log(e)
      setError(true);
      setDataIsLoading(false);
    }
  }
  useEffect(() => {
    getData();
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model, profile, parameters]);
  return (
    <div className="flex flex-col min-h-screen bg-sky-800 rounded-lg">
      <Intro isOpen={introIsOpen} setIsOpen={setIntroIsOpen} />
      <div className='sticky top-0 bg-sky-800 drop-shadow-lg'>
        <Header setIntroIsOpen={setIntroIsOpen}/>
      </div>
      <main className='container lg:grid lg:grid-cols-2 gap-4 text-gray-100 min-w-full md:px-10 px-3 scrollbar-overlay'>
        <div>
          <h2 className="text-2xl font-bold my-4">1. Profile and Model Selection</h2>
          <ProfileModelSelector profile={profile} setProfile={setProfile} model={model} setModel={setModel} />
        </div>

        <div id="model-targets" className=''>
          <h2 className="text-2xl font-bold my-4">2. Model Targets</h2>
          <ModelTargets setParameters={setParameters} modelType={model.name}/>
        </div>
        <div id="news-feed" className=''>
          <h2 className="text-2xl font-bold my-4">Recommended Articles</h2>
          <NewsFeed articles={articles} loading={dataIsLoading} model={model} />
        </div>
        <div id="news-feed" className=''>
          <h2 className="text-2xl font-bold my-4">Statistics for Recommended Articles</h2>
          <Statistics stats={stats} loading={dataIsLoading} />
        </div>
        <div id="viz" className='col-span-2 mb-10'>
          <h2 className="text-2xl font-bold my-4">Visualization</h2>
          <div className='flex items-center w-full'>
            <Visualization
              margin={{ top: 30, left: 60, right: 40, bottom: 40 }}
              articles={articles}
              model={model}
              userEmbedding={userEmbedding}
              />
          </div>
          {error && <div className="text-center text-red-500">Error loading data</div>}
        </div>
      </main>
    </div>
  )
}

export default App;
