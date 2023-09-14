
from typing import Callable, List

import numpy as np
import pandas as pd
from build.embeddings.users.embed import embed_hist
from data.embeddings.news import NEWS_EMBEDDINGS
from data.embeddings.users import USERS_EMBEDDINGS
from data.mind.prep.news import DF_NEWS_PREP
from data.mind.raw import DF_NEWS_TEST
from models.whitebox.content import get_score as content
from models.whitebox.popularity import get_score as popularity
from models.whitebox.users import get_score as users
from sklearn.preprocessing import MinMaxScaler

from utils.constants import LIMIT, SEED
from utils.utils import logit, wei_lgt, wei_uni

rs = np.random.RandomState(SEED)


class WhiteBoxModel():


    def embed_news(self) -> dict:

        """ 
        
        Build news embeddings.

        Return
            News embeddings
        
        """

        return NEWS_EMBEDDINGS


    def embed_users(self) -> dict:

        """ 
        
        Build users embeddings.

        Return
            Users embeddings
        
        """

        return USERS_EMBEDDINGS


    def embed_user(
        self, 
        history: List[str], 
        wei_fct: Callable = wei_uni
    ) -> np.array:

        """ 
        
        Build user embedding.

        Arguments
            * history: See embed_hist()
            * wei_fct: See embed_hist()

        Return
            User embedding
        
        """

        return embed_hist(history, wei_fct=wei_fct)


    @staticmethod
    def get_score(
        fct: Callable, 
        user_embedding: np.array,
        history: List[str],  
        nid_rm: List[str] = []
    ) -> pd.Series:

        """ 
        
        Compute and format score.

        Arguments
            * fct: Recommendation function (eg. content(), popularity(), users())
            * user_embedding: User embedding
            * history: List of nids
            * nid_rm: nids to remove from recommendations
        
        """

        # Get recommendations
        sims = fct(user_embedding)
        # Drop nids to remove (including history)
        sims = sims.drop(history + nid_rm, errors='ignore')

        # Format structure
        scaler = MinMaxScaler()
        sims = pd.DataFrame(
            scaler.fit_transform([ [sim] for sim in sims.values ]), 
            index=sims.index
        )
        sims = sims[0].sort_index()

        return sims


    def get_scores(
        self,
        user_embedding: np.array, 
        history: List[str],  
        wei_mtd: dict,
        cats_rm: List[str] = [],
        subcats_rm: List[str] = []
    ) -> pd.DataFrame:

        """ 
        
        Combine scores from all methods.

        Arguments
            * user_embedding: User embedding
            * history: List of nids
            * wei_mtd: Dict of mix of recommendation methods to follow (keys: 'content', 'popularity' and 'users')
            * cats_rm: Categories to remove from recommendations
            * subcats_rm: Subcategories to remove from recommendations

         Return
            Dataframe of score from each method (pure and weighted), and final score (sum of weighted scores)
        
        """

        if cats_rm or subcats_rm:
            nid_rm = DF_NEWS_PREP[DF_NEWS_PREP['cat'].isin(cats_rm) | DF_NEWS_PREP['subcat'].isin(subcats_rm)].index.tolist()
        else:
            nid_rm = []
            
        score_content = self.get_score(content, user_embedding, history, nid_rm=nid_rm) if wei_mtd['content'] else 0
        score_popularity = self.get_score(popularity, user_embedding, history, nid_rm=nid_rm) if wei_mtd['popularity'] else 0
        score_users = self.get_score(users, user_embedding, history, nid_rm=nid_rm) if wei_mtd['users'] else 0

        cats = DF_NEWS_PREP[[ 'cat', 'subcat' ]]
        cats = cats.drop(history + nid_rm).sort_index()

        df_scores = pd.DataFrame(
            [ 
                score_content, score_popularity, score_users,
                cats['cat'], cats['subcat']
            ], 
            index=[ 'content', 'popularity', 'users', 'cat', 'subcat' ]
        ).T

        df_scores['content_w'] = df_scores['content'] * wei_mtd['content']
        df_scores['popularity_w'] = df_scores['popularity'] * wei_mtd['popularity']
        df_scores['users_w'] = df_scores['users'] * wei_mtd['users']
        df_scores['score'] = df_scores['content_w'] + df_scores['popularity_w'] + df_scores['users_w']

        return df_scores.sort_values('score', ascending=False)


    @staticmethod
    def get_weights(
        exploration: float, 
        lim: int, 
        nb: int
    ) -> np.array:

        """ 
        
        Build probability weights.

        Argument
            * exploration: Exploration coefficient (between 0 and 1)
            * lim: Number of news to recommend
            * nb: Number of news to choose from

        Return

        
        """

        # Compute logit coefficients
        # The bigger exploration, the flatter the curve (hence the more chance to get news with low/high scores)
        inflex = (1 - exploration) * (nb - lim) / nb
        steep = np.exp(3 * (1 - exploration)) - 1

        # Compute logit weights
        x = np.linspace(0, 1, num=nb)
        return logit(x, inflex, steep)


    @staticmethod
    def update_weights(
        weights: List[float], 
        df: pd.DataFrame, 
        idx: int, 
        nid: str, 
        diversity: float
    ) -> list:

        """ 
        
        Update probability weights.
        
        Arguments
            * weights: Probability weights
            * df: News scores dataframe
            * idx: Index of selected news
            * nid: Nid of selected news
            * diversity: Diversity coefficient (between 0 and 1)

        Return
            Updated probability weights

        """

        # Remove idx from probability weights
        weights = np.delete(weights, idx)

        # Find all news with same cat as selected news
        cat = DF_NEWS_PREP.loc[nid]['cat']
        nids_cat = [
            nid 
            for nid in DF_NEWS_PREP[DF_NEWS_PREP['cat'] == cat].index
            if nid in df
        ]
        idx_cat = df.loc[nids_cat].index

        # Weigh their probabilities down
        weights[idx_cat] *= 1 - diversity
        return weights


    def pick_recos(
        self, 
        df: pd.DataFrame, 
        nb_rdm: int, 
        wei_obj: dict,
        limit: int = LIMIT
    ) -> pd.DataFrame:

        """ 
        
        Get recommendations, given objectives.

        Arguments
            * df: News scores dataframe
            * nb_rdm: Number of random recommendations
            * wei_obj: Dict of objectives to follow (keys: 'diversity', 'exploration' and 'surprise')
            * limit: Number of recommendations to make

        Return
            News recommendations
        
        """

        recos = pd.DataFrame()
        # Get probability weights (-> Exploration)
        weights = self.get_weights(wei_obj['exploration'], limit - nb_rdm, len(df))

        for i in range(limit - nb_rdm):

            try:
                # Draw news according to weights 
                idx = rs.choice(
                    np.arange(len(df)), 
                    p=weights / weights.sum()
                )

            except ValueError:
                # If weights are all zeros (eg. if diversity ~ 1)
                weights = self.get_weights(wei_obj['exploration'], limit - nb_rdm - i, len(df))
                idx = rs.choice(
                    np.arange(len(df)), 
                    p=weights / weights.sum()
                )

            row = df.iloc[idx]
            nid = row.name
            # Add to recommendations list
            recos = pd.concat([ recos, row ], axis=1)
            # Remove from news to choose from
            df = df.drop(nid)

            # Update weights according to selected news category (-> Diversity)
            weights = self.update_weights(weights, df, idx, nid, wei_obj['diversity'])
            
        recos = recos.T
        recos['random'] = False
        
        # (-> Surprise)
        for _ in range(nb_rdm):

            # Draw random news
            news = df.sample(random_state=rs)
            # Remove from news to choose from
            df = df.drop(news.index)
            news['random'] = True

            # Draw random spot
            rdm_idx = rs.randint(len(recos)) if len(recos) else 0
            # Add random news to recommendations list
            recos = pd.concat([ recos.iloc[:rdm_idx], news, recos.iloc[rdm_idx:] ])

        return recos


    def get_reco(
        self, 
        user_embedding: np.array, 
        history: List[str],
        wei_mtd: dict, 
        wei_obj: dict,
        cats_rm: List[str] = [],
        subcats_rm: List[str] = [],
        limit: int = LIMIT,
        **kwargs
    ) -> pd.DataFrame:

        """ 
        
        Get customizable recommendations.
        
        Arguments
            * user_embedding: See get_scores()
            * history: See get_scores()
            * wei_mtd: See get_scores()
            * wei_obj: See pick_recos()
            * cats_rm: See get_scores()
            * subcats_rm: See get_scores()
            * limit: See pick_recos()

        Return
            News recommendations, along with their (weighted and not weighted) scores
        
        """

        # Compute news scores
        df_scores = self.get_scores(
            user_embedding, history, wei_mtd, 
            cats_rm=cats_rm, subcats_rm=subcats_rm
        )

        # Pick recommendations, given news scores and objectives
        nb_rdm = round(wei_obj['surprise'] * limit)
        recos = self.pick_recos(df_scores, nb_rdm, wei_obj, limit=limit)

        news = DF_NEWS_TEST.loc[recos.index]
        # Add scores to news
        scores = recos.drop([ 'cat', 'subcat' ], axis=1)
        return pd.concat([ news, scores ], axis=1)
