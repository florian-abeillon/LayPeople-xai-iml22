
import csv

import numpy as np
from data.mind.prep.news import DF_NEWS_PREP
from data.mind.raw import DF_NEWS_TEST
from utils.constants import LIMIT, PROFILES, SEED
from utils.paths import PATH_TO_PROFILES

np.random.seed(SEED)


def build(
    limit: int = LIMIT
) -> None:

    """ 
    
    Create random history, given profiles interests.

    Arguments
        * limit: Number of articles to put in their history
    
    """

    for profile, subcats in PROFILES.items():

        # Get all news from those subcategories
        nids = DF_NEWS_TEST[DF_NEWS_TEST['subcat'].isin(subcats)].index
        nids = nids.intersection(DF_NEWS_PREP.index)
        # Randomly select some of them
        nids = np.random.choice(nids, size=limit)

        # Save profile history
        with open(PATH_TO_PROFILES + f"{profile}.csv", "w") as f:
            writer = csv.writer(f)
            writer.writerow(nids)
