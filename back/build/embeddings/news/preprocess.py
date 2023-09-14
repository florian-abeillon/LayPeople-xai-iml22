
from typing import List, Tuple

import numpy as np
import pandas as pd
from data.embeddings.entities import ENTS_EMBEDDINGS
from data.mind.raw import DF_NEWS_TEST
from sklearn.preprocessing import LabelEncoder

pd.set_option('mode.chained_assignment', None)


def encode_decode(
    s: pd.Series
) -> Tuple[np.array, dict]:

    """ 
    
    Label-encode columns, and keep track of labels of encoded cats/subcats.

    Arguments
        * s: Series of cats/subcats to encode

    Return
        * Encoded column
        * Decoding dict
    
    """

    encoder = LabelEncoder()
    col_enc = encoder.fit_transform(s)

    # Get initial name of every encoding
    decoder = {
        str(enc): encoder.inverse_transform([enc])[0]
        for enc in np.unique(col_enc)
    }
    return col_enc, decoder


def extract_ents(
    row: pd.Series, 
    eid_dec: dict
) -> List[str]:

    """ 
    
    Extract (known) entities. 

    Arguments
        * row: Series of lists of entities (from title/abstract)
        * eid_dec: Entities decoding dict (to be filled)

    Return
        List of entities ids from row
    
    """

    eids = []

    for ents in row.values:
        for ent in ents:
            eid = ent['WikidataId']
            
            if eid in ENTS_EMBEDDINGS:
                # Add every entity of which we have an embedding
                eids.append(eid)
                # Add its label to the decoding dict (if necessary)
                if eid not in eid_dec:
                    eid_dec[eid] = ent['Label']
                
    return eids


def preprocess() -> Tuple[pd.DataFrame, dict, dict]:

    """ 
    
    Preprocess raw news dataset.

    Return
        * Preprocessed news dataset
        * Categories decoding dict
        * Subcategories decoding dict
        * Entities decoding dict
    
    """

    # Drop NAs
    df_news = DF_NEWS_TEST.drop([ 'abstract', 'url' ], axis=1).dropna()
    
    # Encode cat/subcat, and create cat/subcat decoding dicts
    df_news['cat'], cat_dec = encode_decode(df_news['cat'])
    df_news['subcat'], subcat_dec = encode_decode(df_news['subcat'])

    # Extract (known) entities
    eid_dec = {}
    df_news['ents'] = df_news[[ 'title_ent', 'abstract_ent' ]].apply(
        lambda row: extract_ents(row, eid_dec), 
        axis=1
    )
    
    # Filter out rows with no entities
    df_news = df_news[df_news['ents'].str.len() > 0]          
    
    # Filter columns of interest
    df_news = df_news[[ 'cat', 'subcat', 'ents' ]]
        
    return df_news, cat_dec, subcat_dec, eid_dec
