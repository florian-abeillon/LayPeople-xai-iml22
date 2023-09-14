
import ast
from typing import List

import pandas as pd


def str_to_list(
    l: str
) -> List[str]:

    """ 
    
    Parses stringified list back to list.

    Arguments
        * l: Stringified list

    Return
        Parsed list
    
    """

    try:
        # Un-stringify stringified list
        return ast.literal_eval(l) 
    except ValueError:
        # If l is nan
        return []


def load_df(
    path: str, 
    labels: List[str] = [], 
    cols_list: List[str] = []
) -> pd.DataFrame:

    """ 
    
    Load csv into pd.DataFrame.

    Arguments
        * path: Path to csv to load
        * labels: Optional columns names
        * cols_list: Optional columns with stringified list (because of csv formatting) to un-stringify

    Return
        Ready-to-use dataframe
    
    """
    
    # Load dataframe
    kwargs = { 'names': labels } if labels else {}
    df = pd.read_csv(path, sep='\t', index_col=0, **kwargs)

    # Un-stringify list columns (if necessary)
    for col in cols_list:
        df[col] = df[col].apply(str_to_list)

    return df
