
from typing import Callable

import numpy as np
import pandas as pd
from data.embeddings.news import NEWS_EMBEDDINGS
from data.embeddings.users import USERS_EMBEDDINGS
from data.mind.prep.users import USERS_HISTS
from models.whitebox.utils import cos_sim, get_similarity


def get_score(
    user_embedding: np.array, 
    sim_fct: Callable = cos_sim
) -> pd.Series:

    """ 
    
    Assigns a "likelihood score" for each other user.

    Arguments
        * user_embedding: User embedding
        * sim_fct: See get_similarity()
    
    """

    # Compute user similarity to other users
    neighbors = get_similarity(user_embedding, USERS_EMBEDDINGS, sim_fct=sim_fct)

    # Get similarity score to news articles
    sims = USERS_HISTS.dot(neighbors.values)
    return pd.Series(sims, index=NEWS_EMBEDDINGS.keys())
