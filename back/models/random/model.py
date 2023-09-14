
import numpy as np
import pandas as pd
from data.mind.prep.news import DF_NEWS_PREP
from data.mind.prep.users import DF_USERS_PREP
from data.mind.raw import DF_NEWS_TEST
from utils.constants import LIMIT, SEED

rs = np.random.RandomState(SEED)


class RandomModel():


    def embed_news(self) -> dict:

        """ 
        
        Build (random) news embeddings.

        Return
            News embeddings
        
        """

        return {
            nid: rs.randn(2)
            for nid in DF_NEWS_PREP.index
        }


    def embed_users(self) -> dict:

        """ 
        
        Build (random) users embeddings.

        Return
            Users embeddings
        
        """

        return {
            uid: rs.randn(2)
            for uid in DF_USERS_PREP.index
        }
        

    def embed_user(self, *args, **kwargs) -> np.array:

        """ 
        
        Build (random) user embedding.

        Return
            User embedding

        """

        return rs.randn(2)


    def get_reco(
        self, 
        *args,
        limit: int = LIMIT, 
        **kwargs
    ) -> pd.DataFrame:

        """ 
        
        Get random news.

        Arguments
            * limit: Number of recommendations to make
        
        """
        
        # Randomly select news
        nids = DF_NEWS_PREP.sample(n=limit, random_state=rs).index
        recos = DF_NEWS_TEST.loc[nids]

        # Format recommendations structure
        recos = recos.drop([ 'title_ent', 'abstract_ent' ], axis=1)
        return recos
