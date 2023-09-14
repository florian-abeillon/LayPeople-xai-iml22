# Making Recommendation Systems More Transparent to the Lay User


## Team Members
1. Florian Abeillon
2. Sverrir Arnorsson

## Project Description 
Our objective is to build a white box recommendation system to showcase the importance of intrinsically transparent algorithms in this domain.  
Understanding how they work, and why a given news has been recommended to the user is indeed crucial for the lay user to not *passively* consume recommendations, but rather to *actively* shape them.

More thorough information about the project can be found in `report/report.html`.

### Datasets

We will use the 
[MIcrosoft News Dataset (MIND)](https://www.microsoft.com/en-us/research/publication/mind-a-large-scale-dataset-for-news-recommendation),
a large-scale dataset for news recommendation research.  
At the current project stage, we use the "demo" dataset.  

- - -
## Folder Structure

``` bash
├── .gitignore
├── docker-compose.yml
├── package-lock.json
├── package.json
├── README.md  
├── back/                           ## Back-end
│   ├── app.py                          # Main app
│   ├── build_repo.py                   # Python script to build repository
│   ├── config                          # Utils for FastAPI app
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── build/                          ## Build repository
│   │   ├── categories.py                   # Python script to build news categories/subcategories
│   │   ├── profiles.py                     # Python script to build pre-built profiles
│   │   ├── visualization.py                # Python script to build 2D news/users embeddings used for visualization
│   │   ├── embeddings/                     ## Build embeddings
│   │   │   ├── __init__.py
│   │   │   ├── news/                           ## Build news embeddings
│   │   │   │   ├── embed
│   │   │   │   ├── preprocess
│   │   │   ├── users/                          ## Build users embeddings
│   │   │   │   ├── embed
│   │   │   │   ├── preprocess
│   ├── data/                           ## Data
│   │   ├── cats/                           ## Cat/subcat hierarchy
│   │   │   ├── __init__.py
│   │   ├── decoders/                       ## Ent/cat/subcat decoders
│   │   │   ├── __init__.py
│   │   ├── embeddings/                     ## Embeddings
│   │   │   ├── load.py                         # Utils function to load embeddings
│   │   │   ├── entities/                       ## Entities embeddings
│   │   │   │   ├── __init__.py
│   │   │   ├── news/                           ## News embeddings
│   │   │   │   ├── __init__.py
│   │   │   ├── users/                          ## Users embeddings
│   │   │   │   ├── __init__.py
│   │   ├── mind/                           ## MIND data
│   │   │   ├── load.py                         # Utils function to load datasets
│   │   │   ├── prep/                           ## Preprocessed data
│   │   │   │   ├── news/                           ## News dataset
│   │   │   │   │   ├── __init__.py
│   │   │   │   ├── users/                          ## Users dataset
│   │   │   │   │   ├── __init__.py
│   │   │   ├── raw/                            ## Raw data
│   │   │   │   ├── __init__.py
│   │   │   │   ├── documentation.md                # Information on the MIND dataset
│   │   │   │   ├── test/
│   │   │   │   ├── train/
│   │   │   │   ├── utils/
│   │   ├── profiles/                       ## Pre-built profiles data
│   │   │   ├── __init__.py
│   │   ├── visualization/                  ## News/users visualization data
│   │   │   ├── blackbox/                       ## Blackbox model visualizations
│   │   │   │   ├── __init__.py
│   │   │   ├── random/                         ## Random model visualizations
│   │   │   │   ├── __init__.py
│   │   │   ├── whitebox/                       ## Whitebox model visualizations
│   │   │   │   ├── __init__.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── eval.py                     # Models evaluation function (NOT IMPLEMENTED YET)
│   │   ├── blackbox/                   ## Blackbox model
│   │   │   ├── __init__.py
│   │   │   ├── constants.py
│   │   │   ├── model.py                    # Model definition
│   │   │   ├── weights.h5                  # Dump of blackbox model weights
│   │   ├── random/                     ## Random model
│   │   │   ├── __init__.py
│   │   │   ├── model.py                    # Model definition
│   │   ├── whitebox/                   ## Whitebox model
│   │   │   ├── __init__.py
│   │   │   ├── content.py                  # Content-based recommendations
│   │   │   ├── model.py                    # Model definition
│   │   │   ├── popularity.py               # Popularity-based recommendations
│   │   │   ├── users.py                    # Similar-users-based recommendations
│   │   │   ├── utils.py
│   ├── utils/
│   │   ├── constants.py
│   │   ├── paths.py
│   │   └── utils.py
├── front
│   ├── Dockerfile
│   ├── build
│   │   ├── asset-manifest.json
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   ├── robots.txt
│   │   └── static
│   │       ├── css
│   │       │   ├── main.8b5e5748.css
│   │       │   └── main.8b5e5748.css.map
│   │       └── js
│   │           ├── 787.0f148dca.chunk.js
│   │           ├── 787.0f148dca.chunk.js.map
│   │           ├── main.8dc7f7e3.js
│   │           ├── main.8dc7f7e3.js.LICENSE.txt
│   │           └── main.8dc7f7e3.js.map
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── public
│   │   ├── all-categories.svg
│   │   ├── android-chrome-192x192.png
│   │   ├── android-chrome-512x512.png
│   │   ├── apple-touch-icon.png
│   │   ├── athlete.svg
│   │   ├── blackbox.svg
│   │   ├── browserconfig.xml
│   │   ├── decision-tree.svg
│   │   ├── favicon-16x16.png
│   │   ├── favicon-32x32.png
│   │   ├── favicon.ico
│   │   ├── health.svg
│   │   ├── health2.svg
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   ├── mstile-144x144.png
│   │   ├── mstile-150x150.png
│   │   ├── mstile-310x150.png
│   │   ├── mstile-310x310.png
│   │   ├── mstile-70x70.png
│   │   ├── politician.svg
│   │   ├── random.svg
│   │   ├── robots.txt
│   │   ├── safari-pinned-tab.svg
│   │   └── site.webmanifest
│   ├── src
│   │   ├── App.css
│   │   ├── App.test.tsx
│   │   ├── App.tsx
│   │   ├── Visualization.tsx
│   │   ├── backend
│   │   │   ├── BackendQueryEngine.tsx
│   │   │   └── json-decoder.ts
│   │   ├── components
│   │   │   ├── Button.tsx
│   │   │   ├── DataPointComponent.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Intro.tsx
│   │   │   ├── ModelTargets.tsx
│   │   │   ├── MultiRangeComponent.tsx
│   │   │   ├── NewsFeedComponent.tsx
│   │   │   ├── PieChartComponent.tsx
│   │   │   ├── ProfileModelSelector.tsx
│   │   │   ├── RugComponent.tsx
│   │   │   ├── Statistics.tsx
│   │   │   ├── Visualization.tsx
│   │   │   ├── cats.ts
│   │   │   └── multiRangeSlider.css
│   │   ├── index.css
│   │   ├── index.tsx
│   │   ├── logo.svg
│   │   ├── react-app-env.d.ts
│   │   ├── reportWebVitals.ts
│   │   ├── setupTests.ts
│   │   ├── types
│   │   │   ├── DataArray.ts
│   │   │   ├── DataPoint.ts
│   │   │   └── Margins.ts
│   │   └── utils.ts
│   ├── tailwind.config.js
│   ├── todo.txt
│   └── tsconfig.json
└── report
    ├── imgs
    │   ├── cats.png
    │   ├── header.png
    │   ├── memory.png
    │   ├── pie.png
    │   ├── profiles.png
    │   ├── stats.png
    │   └── visualization.png
    └── report.html
└── requirements.txt
```

## Requirements

Please extracts the weights file of the blackbox model, eg. with `tar -xf back/models/blackbox/weights.tar.xz -C back/models/blackbox/`

Please install Docker, and run `docker-compose build`

Alternatively, you can run `cd back && python build_repo.py` to
* Download data, with the `data` arg
* Train the blackbox model, with the `train` arg
* Build the embeddings (eg. with a different memory weight function), with the `embed` arg
    * Build the *news* embeddings, with the `embed_news` arg
    * Build the *users* embeddings, with the `embed_users` arg
* Build the categories encoding, with the `cats` arg
* Build the pre-built profiles, with the `profiles` args
* Build the visualizations, with the `viz` arg
    * Build the *news* visualizations, with the `viz_news` arg
    * Build the *users* visualizations, with the `viz_users` arg
* Do all of the above, with no arg

## Run the app

Simply run `docker-compose up`

Then go to [http://localhost:3000](http://localhost:3000).

## Weekly Summary

### Week 6 / Submission of April 7th:

We implemented the Hilbert sorting strategy for preparing the motion rug visualization. Currently, there are no trends
visible in the visualization as we still use mock data. Progress on the motion rug visualization is found in the branch
'motion-rug'.
A challenge of applying the motion rug is that we are applying the technique to a different domain: out data is not 
spatial. Instead, we want to visualize the changes in diversity of news recommendations that users are exposed to over 
time by continuously refined recommendations based on the recommendation algorithms. 
In the live dashboard, we want to allow the user to chose in between different optimization hyperparameters, and see the
effect on the diversity of content that they are exposed to.
However, shifting the domains is a challenge in program design.

We have dockerized the app with docker-compose, and set up the UI with TailwindCSS so it is easier to implement new UI elements as we add features along the way.

### Week 7 / Submission of April 14th:

- Added a black-box model based on the Microsoft "Neural Recommendation with Multi-Head Self-Attention (NRMS)" found on [Github](https://github.com/microsoft/recommenders). (on branch elisabeth)
- Started a work in progress on a simple collaborative filtering based surrogate model for the NRMS ((on branch elisabeth))
- Implemented baseline "random" and LSTUR "blackbox" models
- Refacto of whole repo (comments, easier to go through + more user-friendly runs)
- New endpoint for news feed
- New endpoint for explaining news recommendation

### Week 8 / Submission of April 28th:

- Implemented blackbox recommendations, after *finally* understanding how it works

### Week 10 / Submission of May 12th:

- Added scripts to embed articles into 2 dimensions
- Added endpoint to give "articles coordinates" (the 2 dimensions) to the frontend
- Added 3 pre-built profiles

### Week 13 / Submission of June 2nd:
- Built embedding pipe for news/users
- Plugged in visualization on these new embeddings + Added users visualization
- Built whitebox, flexible model
- Added hierarchy of categories, to display for user to (un)select some of them
- Added option to remove specific cats/subcats from recos

### Week 14 / Submission of June 9th:
- Refactored data pipe
- Improved speed of blackbox/whitebox models
