
from typing import Callable, List

import numpy as np
import pandas as pd
from build.embeddings.users.preprocess import preprocess, sparsify_histories
from data.embeddings.news import NEWS_EMBEDDINGS
from scipy import io
from utils.paths import PATH_TO_USERS, PATH_TO_USERS_EMB
from utils.utils import wei_lgt, wei_uni


def embed_hist(
    history: List[str], 
    wei_fct: Callable = wei_uni
) -> np.array:

    """ 
    
    Average entities embeddings.

    Arguments
        * history: List of nids (defines a user)
        * wei_fct: "Memory" function to use to weigh nids depending on how recent they are

    Return
        User embedding (average of their history news embeddings)
    
    """

    nb_features = next(iter(NEWS_EMBEDDINGS.values()))
    # If no history, return empty embedding
    if not history:
        return np.array([0.] * nb_features)

    # Get embeddings of all news in history
    news_embeddings = [ NEWS_EMBEDDINGS[nid] for nid in history ]

    nb_embeddings = len(news_embeddings)
    weights = wei_fct(nb_embeddings)
    
    embedding = np.array([0.] * nb_features)
    # Weigh every embedding (according to "memory")
    for news_embedding, weight in zip(news_embeddings, weights):
        embedding += news_embedding * weight 
    embedding /= nb_embeddings

    return embedding


def build(
    wei_fct: Callable = wei_uni
) -> None:

    """ 
    
    Main function.
    
    Arguments
        * wei_fct: See embed_hist()
        
    """

    # Preprocess raw dataset
    df_users = preprocess()
    # Save preprocessed dataset
    df_users.to_csv(PATH_TO_USERS + 'behaviors.csv', sep="\t")

    # Embed all the different users (defined only by their histories)
    histories = df_users[~df_users.index.duplicated()]['history']
    embeddings = { 
        uid: embed_hist(history, wei_fct=wei_fct) 
        for uid, history in histories.iteritems() 
    }
    embeddings = pd.DataFrame.from_dict(embeddings, orient='index')

    # Save users embeddings
    embeddings.to_csv(
        PATH_TO_USERS_EMB + 'embedding.vec', 
        header=False,
        sep="\t"
    )

    # Save another version, in the form of a sparse matrix (for quicker live recommendations)
    histories_sparse = sparsify_histories(histories)
    io.mmwrite(PATH_TO_USERS + "histories.mtx", histories_sparse)
