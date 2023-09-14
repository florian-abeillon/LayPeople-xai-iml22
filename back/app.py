
import json

import uvicorn
from fastapi import Form

from config import *
from data.categories import CATEGORIES
from data.profiles import PROFILES_HISTORY
from data.visualization.blackbox import NEWS_VISUALIZATION as news_bbm
from data.visualization.blackbox import USERS_VISUALIZATION as users_bbm
from data.visualization.random import NEWS_VISUALIZATION as news_rdm
from data.visualization.random import USERS_VISUALIZATION as users_rdm
from data.visualization.whitebox import NEWS_VISUALIZATION as news_wbm
from data.visualization.whitebox import USERS_VISUALIZATION as users_wbm
from models import MODELS
from utils.constants import LIMIT, MODELS_NAMES
from utils.utils import get_stats, get_viz, wei_lgt, wei_uni

VISUALIZATIONS = {
    'blackbox': { 'news': news_bbm, 'users': users_bbm },
    'random': { 'news': news_rdm, 'users': users_rdm },
    'whitebox': { 'news': news_wbm, 'users': users_wbm }
}



@app.post("/get-news")
def get_news(
    model_name: str, 
    profile: str = "", 
    limit: int = LIMIT,
    kwargs: Item = Form(...)
) -> dict:

    """ 
    
    Get recommended news given user history.

    Arguments
        * model_name: 'blackbox', 'random' or 'whitebox' depending on the embedding model to use
        * profile: Optional default profile (eg. 'athlete', 'health_guru', or 'politician')
        * limit: Number of recommendations to make
        * kwargs
            * history: List of nids
            * wei_mtd: Dict of mix of recommendation methods to follow (keys: 'content', 'popularity' and 'users')
            * wei_obj: Dict of objectives to follow (keys: 'diversity', 'exploration' and 'surprise')
            * memory: Whether to weigh news from history differently
            * inflex: Inflexion point parameter for logit memory (only used if memory=True)
            * steep: Steepness parameter for logit memory (only used if memory=True)
            * cats_rm: Categories to remove from recommendations
            * subcats_rm: Subcategories to remove from recommendations

    Return
        * User embedding
        * News recommendations
        * Statistics on news recommendations
    
    """

    assert model_name in MODELS_NAMES, f"model_name={model_name} should be within {MODELS_NAMES}"
    assert limit > 0

    kwargs = kwargs.dict()

    if profile:
        try:
            # Load profile
            kwargs['history'] = PROFILES_HISTORY[profile]
        except KeyError:
            raise ValueError

    model = MODELS[model_name]

    # Embed user
    wei_fct = ( lambda nb: wei_lgt(nb, kwargs['inflex'], kwargs['steep']) ) if kwargs['memory'] else wei_uni
    user_emb = model.embed_user(kwargs['history'], wei_fct=wei_fct)

    # Generate recommendations for the user
    recos = model.get_reco(user_emb, limit=limit, **kwargs)
    # Format recommendations to have same structure
    if 'score' not in recos:
        recos[[ 'content', 'popularity', 'users', 'content_w', 'popularity_w', 'users_w', 'score', 'random' ]] = 0
    
    return {
        'user': json.dumps(get_viz(user_emb, 'users', model_name)),
        'recos': recos.to_json(orient='table'),
        'stats': get_stats(recos).to_json(orient='table')
    }



@app.post("/get-visualization")
def get_visualization(
    el_type: str,
    model_name: str
) -> dict:

    """ 
    
    Get coordinates for dataset visualization.
    
    Arguments
        * el_type: 'news' or 'users' depending on the visualization to return
        * model_name: 'blackbox', 'random' or 'whitebox' depending on the embedding model to use
        
    Return
        News/users 2D-coordinates
        
    """

    assert el_type in [ 'news', 'users' ], f"el_type={el_type} should be within [ 'news', 'users' ]"
    assert model_name in MODELS_NAMES, f"model_name={model_name} should be within MODELS_NAMES"
    
    viz = VISUALIZATIONS[model_name][el_type]
    return viz.to_json(orient='table')



@app.post("/get-categories")
def get_categories() -> dict:

    """ 
    
    Return cat-subcat hierarchy.
    
    Return
        Cat-subcat hierarchy

    """

    return CATEGORIES



if __name__ == "__main__":
    uvicorn.run(app, port=PORT)
