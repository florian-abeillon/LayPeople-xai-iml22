
import pickle
from typing import Callable, List, Union

# import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

from utils.paths import MODEL_TO_VIZ

# Logit function
logit = lambda x, inflex, steep: 1 / (1 + np.exp(-steep * (x - inflex)))

# def plot_logit(n: int, 
#                inflex: Union[int, float] = 1/8, 
#                steep: Union[int, float] = 2) -> None:
#     """ Plot logit with given params """
#     x = np.arange(n) + 1
#     y = logit(x / len(x), inflex, steep)
#     plt.plot(x, y)
#     plt.ylim(0, 1)
#     plt.show()


# Uniform weights
wei_uni = lambda nb: [1] * nb

def wei_lgt(
        nb: int, 
        inflex: Union[int, float] = 1/8, 
        steep: Union[int, float] = 2
) -> np.array:

    """ 
    
    Logit-based weights.

    Arguments
        * nb: Number of points
        * inflex: Inflexion point parameter for logit memory (only used if memory=True)
        * steep: Steepness parameter for logit memory (only used if memory=True)
    
    """

    x = np.arange(nb) + 1
    return logit(x / len(x), inflex, steep)


def save_pkl(
    to_save: Callable, 
    el_type: str,
    model_name: str,
    filename: str
) -> None:

    """ 

    Save Callable into pkl file.

    Arguments
        * to_save: Callable to save
        * el_type: 'news' or 'users' depending on the type of embeddings tackled
        * model_name: Name of the embedding model used
        * filename: Name of Callable instance
    
    """

    with open(MODEL_TO_VIZ[model_name] + f'{el_type}_{filename}.pkl', 'wb') as f:
        pickle.dump(to_save, f)


def reduce_dim(
    embeddings: List[list],
    el_type: str,
    model_name: str
) -> np.array:

    """ 
    
    Scale embeddings, and perform PCA.

    Arguments
        * embeddings: High-dimension embeddings
        * el_type: See save_pkl()
        * model_name: Name of the embedding model used

    Return
        Low-dimension (2) embeddings
    
    """

    # Scale data
    scaler = StandardScaler()
    embeddings = scaler.fit_transform(embeddings)

    # Perform PCA, to reduce dimensions down to 2
    pca = PCA(n_components=2)
    embeddings_2d = pca.fit_transform(embeddings)

    # Save both
    save_pkl(scaler, el_type, model_name, 'scaler')
    save_pkl(pca, el_type, model_name, 'pca')
        
    return embeddings_2d


def load_pkl(
    el_type: str,
    model_name: str,
    filename: str
) -> Callable:

    """ 

    Load saved Callable from pkl file.

    Arguments
        * el_type: 'news' or 'users' depending on the type of embeddings tackled
        * model_name: Name of the embedding model used
        * filename: Name of Callable instance

    Return
        Callable instance
    
    """

    with open(MODEL_TO_VIZ[model_name] + f'{el_type}_{filename}.pkl', 'rb') as f:
        callable = pickle.load(f)
    return callable


def get_viz(
    embedding: List[float],
    el_type: str,
    model_name: str
) -> List[float]:

    """ 
    
    Scale embedding, and perform PCA to get 2D-coordinates for visualization.

    Arguments
        * embedding: High-dimension embedding
        * el_type: See load_pkl()
        * model_name: Name of the embedding model used

    Return
        Low-dimension (2) embedding
    
    """

    # Scale data
    scaler = load_pkl(el_type, model_name, 'scaler')
    embeddings = scaler.transform([embedding])
    # Perform PCA, to reduce dimensions down to 2
    pca = load_pkl(el_type, model_name, 'pca')
    embeddings_2d = pca.transform(embeddings)
        
    return list(embeddings_2d[0])


def get_stats(
    recos: pd.DataFrame
) -> pd.Series:

    """

    Get statistics on recommended articles
    
    Arguments
        * recos: Recommended articles

    Return
        Statistics on recos
    
    """

    return recos['cat'].value_counts()
