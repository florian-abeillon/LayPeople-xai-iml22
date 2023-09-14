
import json

from data.decoders import DECODER_CAT, DECODER_SUBCAT
from data.mind.prep.news import DF_NEWS_PREP
from utils.paths import PATH_TO_CATS


def build():

    """ 
    
    Build cat-subcat hierarchy.
    
    """
    
    cats_hierarchy = {}
    for cat in DF_NEWS_PREP['cat'].unique():

        # Get all subcats of a given cat
        subcats = DF_NEWS_PREP[DF_NEWS_PREP['cat'] == cat]['subcat'].unique()
        cat = str(cat)

        # List them in dict
        cats_hierarchy[cat] = {
            str(subcat): { 'label': DECODER_SUBCAT[str(subcat)] }
            for subcat in subcats
        }
        cats_hierarchy[cat]['label'] = DECODER_CAT[cat]

    # Save cat-subcat hierarchy
    with open(PATH_TO_CATS + 'categories.json', 'w') as f:
        json.dump(cats_hierarchy, f)
