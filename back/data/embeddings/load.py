
import numpy as np


def load_vec(
    path: str
) -> dict:

    """ 
    
    Load vec file.
    
    Arguments
        * path: Path to vec file to load

    Return
        Dict of embeddings

    """

    vec = {}
    with open(path) as f:
        for line in f:
            # Get all the coefficients of the line
            line = line.split('\t')
            # Pop the first one (the id)
            id = line.pop(0)
            vec[id] = np.array([ float(val) for val in line if val.strip() ])

    return vec
