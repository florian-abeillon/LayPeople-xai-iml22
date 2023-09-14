
from typing import Callable

import numpy as np
import pandas as pd
from data.mind.prep.news import DF_NEWS_PREP
from data.mind.prep.users import DF_USERS_PREP


def get_popu() -> pd.DataFrame:

    """ 
    
    Add popularity measures.

    Return
        Dataframe with number of clicks and "popularity score" of every news article
        
    """

    # Initialize dicts for number of impressions/clicks
    nb_imprs = { nid: 0 for nid in DF_NEWS_PREP.index }
    nb_clicks = nb_imprs.copy()

    # Fill dicts
    for _, row in DF_USERS_PREP.iterrows():
        for nid in row['history']:
            nb_imprs[nid] += 1
            nb_clicks[nid] += 1
        for nid in row['imprs']:
            nb_imprs[nid] += 1
        for nid in row['clicked']:
            nb_clicks[nid] += 1
            
    # Compute 'popularity score' (ratio of number of clicks per impression)
    popu = { 
        nid: nb / nb_imprs[nid] if nb_imprs[nid] != 0 else 1
        for nid, nb in nb_clicks.items()
    }
    
    df_popu = pd.DataFrame.from_dict({
            'nb_clicks': pd.Series(nb_clicks),
            'popu': pd.Series(popu)
        },
        orient='columns'
    )

    df_popu = df_popu.sort_values([ 'popu', 'nb_clicks' ])
    df_popu['index'] = np.arange(len(df_popu))

    return df_popu

# News popularity dataset
DF_NEWS_POPU = get_popu()



# Use "popularity" ranking, as score
rank_score = lambda row, *args: row['index']
# Use average of "popularity score" and number of clicks, as score
avg_score = lambda row, popu_max, nb_clicks_max: ( row['popu'] / popu_max + row['nb_clicks'] / nb_clicks_max ) / 2

def get_score(_, score_fct: Callable = rank_score) -> pd.Series:

    """ 
    
    Assigns a "likelihood score" for each article.

    Arguments
        * score_fct: Function to score news, given "popularity score" and number of clicks
    
    """

    popu_max = DF_NEWS_POPU['popu'].max()
    nb_clicks_max = DF_NEWS_POPU['nb_clicks'].max()
    score = lambda row: score_fct(row, popu_max, nb_clicks_max)

    return DF_NEWS_POPU.apply(score, axis=1)
