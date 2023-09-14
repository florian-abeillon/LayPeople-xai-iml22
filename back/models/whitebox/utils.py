
from typing import Callable

import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

# Cosine similarity
cos_sim = lambda embedding, embeddings: cosine_similarity([embedding], embeddings)[0]


def get_similarity(
    embedding: np.array, 
    embeddings: dict, 
    sim_fct: Callable = cos_sim
) -> pd.Series:

    """ 
    
    Get top closest elements.

    Arguments
        * embedding: User embedding
        * embeddings: News/users embeddings, to compare user's with
        * sim_fct: Function to get a "similarity score"

    Return
        Similarity score of user with every news/user
    
    """

    sims = sim_fct(embedding, list(embeddings.values()))
    sims = { el: sim for el, sim in zip(embeddings, sims) }

    sims_sorted = pd.Series({
        el: sims[el] 
        for el in sorted(sims, key=sims.get, reverse=True)
    })
    return sims_sorted
