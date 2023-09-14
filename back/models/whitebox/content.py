
from typing import Callable

import numpy as np
import pandas as pd
from data.embeddings.news import NEWS_EMBEDDINGS
from models.whitebox.utils import cos_sim, get_similarity


def get_score(
    user_embedding: np.array, 
    sim_fct: Callable = cos_sim
) -> pd.Series:

    """ 
    
    Assigns a "likelihood score" to every article.

    Arguments
        * user_embedding: User embedding
        * sim_fct: See get_similarity()

    Return
        Similarity score of user embedding to every news embedding
    
    """
    
    # Compute user similarity to news articles
    return get_similarity(user_embedding, NEWS_EMBEDDINGS, sim_fct=sim_fct)
