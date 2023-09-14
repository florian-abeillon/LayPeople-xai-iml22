
from typing import List

import pandas as pd
from data.mind.prep.news import DF_NEWS_PREP
from data.mind.raw import DF_USERS_TEST
from scipy.sparse import lil_matrix

pd.set_option('mode.chained_assignment', None)


def get_imprs(
    imprs: str, 
    clicked: bool = False
) -> List[str]:

    """ 
    
    Get the impressions that were clicked.
    
    Arguments
        * imprs: List of nids
        * clicked: Whether to only return nids that were clicked

    Return
        List of nids of impressed/clicked articles

    """
    
    imprs_list = []
    for impr in imprs.split():
        impr, is_clicked = impr.split('-')

        # If we want all articles (both clicked and not clicked), or if we want only clicked articles and it was clicked indeed
        # And this article is in preprocessed dataset
        if ( not clicked or is_clicked == '1' ) and impr in DF_NEWS_PREP.index:
            imprs_list.append(impr)
            
    return imprs_list


def preprocess() -> pd.DataFrame:

    """ 
    
    Preprocess raw users dataset.

    Return
        Preprocessed users dataset
    
    """
    
    # Drop NAs
    df_users = DF_USERS_TEST.dropna()

    # Get history nids
    get_history = lambda history: [ nid for nid in history.split() if nid in DF_NEWS_PREP.index ]
    df_users['history'] = df_users['history'].apply(get_history)
    
    # Get (clicked) impressions nids
    df_users['imprs'] = df_users['impressions'].apply(lambda imprs: get_imprs(imprs))
    df_users['clicked'] = df_users['impressions'].apply(lambda imprs: get_imprs(imprs, clicked=True))
    
    # Drop rows with empty history/impressions/clicked (after news filtering)
    df_users = df_users[ 
        (df_users['history'].str.len() > 0) & 
        (df_users['imprs'].str.len() > 0) & 
        (df_users['clicked'].str.len() > 0) 
    ]
    
    # Filter columns of interest
    df_users.index = df_users['id_user']
    df_users = df_users[[ 'history', 'imprs', 'clicked' ]]
    
    return df_users


def sparsify_histories(
    histories: pd.Series
) -> lil_matrix:

    """ 
    
    Build sparse matrix from all histories.
    
    Arguments
        * histories: Series of histories (list of nids)

    Return
        Sparse matrix ( nid x uid ) representation of histories from preprocessed dataset

    """

    nid2index = { nid: i for i, nid in enumerate(DF_NEWS_PREP.index) }
    # Initialize sparse matrix
    histories_sparse = lil_matrix(( len(nid2index), len(histories) ), dtype=int)
    for i, history in enumerate(histories.values):
        for nid in history:
            # For every combination ( user, news ), replace 0 with 1
            histories_sparse[nid2index[nid], i] = 1
    return histories_sparse
