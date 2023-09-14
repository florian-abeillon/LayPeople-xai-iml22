
import pandas as pd
from data.mind.prep.news import DF_NEWS_PREP
from models import MODELS
from utils.constants import MODELS_NAMES
from utils.paths import PATH_TO_VIZ
from utils.utils import reduce_dim


def build(
    el_type: str,
    model_name: str
) -> None:

    """ 
    
    Create 2D-coordinates of embeddings.

    Arguments
        * el_type: 'news' or 'users' depending on the visualization to build
        * model_name: 'blackbox', 'random' or 'whitebox' depending on the embedding model to use
    
    """

    assert el_type in [ 'news', 'users' ], f"el_type={el_type} should be within [ 'news', 'users' ]"
    assert model_name in MODELS_NAMES, f"model_name={model_name} should be within {MODELS_NAMES}"

    # Get model
    model = MODELS[model_name]
    # Get embeddings
    embeddings = model.embed_news() if el_type == 'news' else model.embed_users()

    # Reduce embeddings number of dimensions down to 2
    index = embeddings.keys()
    embeddings_2d = reduce_dim(list(embeddings.values()), el_type, model_name)
    embeddings_2d = pd.DataFrame(embeddings_2d, index=index, columns=[ 'X1', 'X2' ])

    # Add cat/subcat (0 for users)
    if el_type == 'news':
        embeddings_2d = embeddings_2d.join(DF_NEWS_PREP[[ 'cat', 'subcat' ]])
    else:
        embeddings_2d[[ 'cat', 'subcat' ]] = 0

    # Save 2D embeddings
    embeddings_2d.to_csv(PATH_TO_VIZ + f"{model_name}/{el_type}.csv")
