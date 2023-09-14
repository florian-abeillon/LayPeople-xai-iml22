
import json
from typing import Callable, List

import numpy as np
import pandas as pd
from build.embeddings.news.preprocess import preprocess
from data.embeddings.entities import ENTS_EMBEDDINGS
from utils.constants import EMBEDDING_SIZE
from utils.paths import PATH_TO_DECODERS, PATH_TO_NEWS, PATH_TO_NEWS_EMB


def save_decoder(
    to_save: dict, 
    filename: str
) -> None:

    """ 

    Save decoder into json dict.

    Arguments
        * to_save: Decoding dict to save
        * filename: Name of decoding dict
    
    """

    with open(PATH_TO_DECODERS + f'decoder_{filename}.json', 'w') as f:
        json.dump(to_save, f)


def embed_ents(
    ents: List[str]
) -> np.array:

    """ 
    
    Average entities embeddings.

    Arguments
        * ents: List of entities ids (eg. from a given news)

    Return
        News embedding (average of its entities embeddings)
    
    """

    embedding = np.zeros(EMBEDDING_SIZE)
    # Add embedding of every entity
    for ent in ents:
        embedding += ENTS_EMBEDDINGS[ent]   
    # Divide by nb of entities, to get average
    embedding /= len(ents)

    return embedding


# Function to average rows
avg_cat = lambda df: df.mean()

def embed_cats(
    embeddings: pd.DataFrame, 
    cats: pd.Series, 
    comb_cat: Callable = avg_cat
) -> pd.DataFrame:

    """ 
    
    Create cat/subcat embedding, from existing news embeddings.

    Arguments
        * embeddings: News embeddings (from averaging their entities mebeddings)
        * cats: Series of news cats/subcats
        * comb_cat: Function to use to combine embeddings from a given cat/subcat

    Return
        Concatenation of initial embedding, and combined embedding from all news from same cat/subcat
    
    """
    
    add_embeddings = pd.DataFrame(columns=np.arange(EMBEDDING_SIZE))

    for cat in cats.unique():
        
        # Get nids of news with same cat/subcat
        nids = cats[cats == cat].index
        # Combine (default: average) their embeddings
        cat_embedding = comb_cat(embeddings.loc[nids, :(EMBEDDING_SIZE - 1)])
        
        # Concat to existing embeddings
        cat_embeddings = pd.concat([cat_embedding] * len(nids), axis=1).T
        cat_embeddings.index = nids
        add_embeddings = pd.concat([ add_embeddings, cat_embeddings ])

    add_embeddings.columns = np.arange(embeddings.shape[1], embeddings.shape[1] + add_embeddings.shape[1])
    return embeddings.join(add_embeddings)


def build(
    comb_cat: Callable = avg_cat
) -> None:

    """ 
    
    Main function.
    
    Arguments
        * comb_cat: See embed_cats()

    """

    # Preprocess raw dataset, and get decoder dicts for cats/subcats/entities
    df_news_prep, cat_dec, subcat_dec, eid_dec = preprocess()

    # Save everything
    df_news_prep.to_csv(PATH_TO_NEWS + 'news.csv', sep="\t")
    save_decoder(eid_dec, 'ent')
    save_decoder(cat_dec, 'cat')
    save_decoder(subcat_dec, 'subcat')

    # Prepare news embeddings (average of their entities embeddings)
    embeddings = {  nid: embed_ents(row['ents']) for nid, row in df_news_prep.iterrows() }
    embeddings = pd.DataFrame.from_dict(embeddings, orient='index')
    # To embed cat/subcat, concat the average embedding of the news with the same cat/subcat
    embeddings = embed_cats(embeddings, df_news_prep['cat'], comb_cat=comb_cat)
    embeddings = embed_cats(embeddings, df_news_prep['subcat'], comb_cat=comb_cat)
    
    # Save embeddings
    embeddings.to_csv(
        PATH_TO_NEWS_EMB + 'embedding.vec', 
        header=False,
        sep="\t"
    )
