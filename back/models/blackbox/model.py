# Loosely adapted from https://github.com/microsoft/recommenders/blob/main/examples/00_quick_start/lstur_MIND.ipynb

import pickle
from typing import List, Tuple

import numpy as np
import pandas as pd
import tensorflow as tf
from data.mind.prep.news import DF_NEWS_PREP
from data.mind.prep.users import DF_USERS_PREP
from data.mind.raw import DF_NEWS_TEST, DF_USERS_TEST
from models.blackbox.constants import BATCH_SIZE, EPOCHS, PATH_TO_WEIGHTS
from recommenders.models.newsrec.io.mind_iterator import MINDIterator
from recommenders.models.newsrec.models.lstur import LSTURModel
from recommenders.models.newsrec.newsrec_utils import prepare_hparams
from utils.constants import LIMIT, SEED
from utils.paths import PATH_TO_TEST, PATH_TO_TRAIN, PATH_TO_UTILS


class BlackBoxModel(LSTURModel):

    def __init__(
        self,
        load: bool = False,
        epochs: int = EPOCHS
    ) -> None:

        """
        
        Initialize BlackBoxModel instance.

        Arguments
            * load: Whether the instance should load pre-trained weights
            * epochs: Number of epochs to train for
        
        """

        hparams = prepare_hparams(
            PATH_TO_UTILS + "lstur.yaml", 
            wordEmb_file=PATH_TO_UTILS + "embedding.npy",
            wordDict_file=PATH_TO_UTILS + "word_dict.pkl",
            userDict_file=PATH_TO_UTILS + "uid2index.pkl",
            batch_size=BATCH_SIZE,
            epochs=epochs
        )
        iterator = MINDIterator
        super().__init__(hparams, iterator, seed=SEED)

        self.session, self.graph = None, None
        self.news_vecs = []
        self.nid2index, self.news_index = {}, []

        if load:
            self.load()


    def fit_weights(self) -> None:

        """ 
        
        Train LSTUR "blackbox" model. 
        
        """

        self.fit(
            PATH_TO_TRAIN + 'news.tsv',
            PATH_TO_TRAIN + 'behaviors.tsv',
            PATH_TO_TEST + 'news.tsv',
            PATH_TO_TEST + 'behaviors.tsv'
        )


    def save(self) -> None:

        """ 
        
        Save fitted weights.
        
        """

        self.model.save_weights(PATH_TO_WEIGHTS + 'weights.h5')


    def prepare_news(self) -> np.array:

        """ 
        
        Prepare news embeddings for recommendations.

        Return
            News embeddings
        
        """
        
        news_vecs = self.run_news(PATH_TO_TEST + "news.tsv")
        news_vecs = np.stack(news_vecs.values(), axis=0)
        return news_vecs[1:]


    def prepare_tools(self) -> Tuple[dict, np.array]:

        """ 
        
        Get dict of news ids, and list of news titles.

        Return
            * Dict news_id -> news index in the dataset
            * Table of words in titles
        
        """

        # Create dict news_id -> index, and list of news titles
        nid2index = {}
        news_titles = [""]
        for i, ( nid, news ) in enumerate(DF_NEWS_TEST.iterrows()):
            nid2index[nid] = i + 1
            news_titles.append(news['title'])

        # Load word dict
        with open(PATH_TO_UTILS + "word_dict.pkl", "rb") as f:
            word_dict = pickle.load(f)

        model_title_size = self.hparams.title_size
        # Build table of words in titles
        news_index = np.zeros(
            ( len(news_titles), model_title_size ), 
            dtype="int32"
        )
        for i, title in enumerate(news_titles):
            # For every word in title (within a limit of words)
            for word_idx in range(min(model_title_size, len(title))):
                word = title[word_idx]
                # If word is in word_dict
                if word in word_dict:
                    # Add it to the table
                    news_index[i, word_idx] = word_dict[word.lower()]

        return nid2index, news_index


    def load(self) -> None:

        """ 
        
        Load saved weights to model.
        
        """
        
        # Required for Keras model to work with FastAPI
        self.session = tf.compat.v1.keras.backend.get_session()
        self.graph = tf.compat.v1.get_default_graph()

        # Load weights
        self.model.load_weights(PATH_TO_WEIGHTS + 'weights.h5')
        # Prepare other tools needed by the blackbox model to make recommendations
        self.news_vecs = self.prepare_news()
        self.nid2index, self.news_index = self.prepare_tools()


    def embed_news(self) -> dict:

        """ 
        
        Build news embeddings.

        Return
            News embeddings
        
        """
        
        news_embeddings = {}
        # For every news embedding
        for nid, news_embedding in zip(DF_NEWS_TEST.index, self.news_vecs):
            # If its corresponding nid is in preprocessed dataset
            if nid in DF_NEWS_PREP.index:
                # Fill dict with its embedding
                news_embeddings[nid] = news_embedding

        return news_embeddings


    def embed_users(self) -> dict:

        """ 
        
        Build users embeddings.

        Return
            Users embeddings
        
        """
        
        # Build users embeddings
        users_vecs = self.run_user(PATH_TO_TEST + "news.tsv", PATH_TO_TEST + "behaviors.tsv")

        users_embeddings = {}
        # For every user embedding
        for uid, users_embedding in zip(DF_USERS_TEST['id_user'], users_vecs.values()):
            # If its corresponding uid is in preprocessed dataset
            if uid in DF_USERS_PREP.index:
                # Fill dict with its embedding
                users_embeddings[uid] = users_embedding

        return users_embeddings


    def embed_user(self, history: List[str], **kwargs) -> np.array:

        """ 
        
        Build user embedding.
        
        Arguments
            * history: List of nids

        Return
            User embedding
            
        """

        # Encoding history
        model_size = self.hparams.his_size
        history = [ self.nid2index[nid] for nid in history ]
        history = [0] * (model_size - len(history)) + history[:model_size]      # Are more recent articles at the beginning, or at the end of the history?

        # Using model to predict embedding
        user = [
            np.asarray([ self.news_index[history] ], dtype=np.int64),
            np.asarray([0], dtype=np.int32)
        ]

        # Ensure session is the same as the one where model was loaded
        with self.graph.as_default():
            tf.compat.v1.keras.backend.set_session(self.session)
            # Make predictions
            recos = self.userencoder.predict(user)[0]

        return recos
        

    def get_reco(
        self, 
        user_embedding: np.array, 
        limit: int = LIMIT, 
        **kwargs
    ) -> pd.DataFrame:

        """ 
        
        Get top recommended news for user.
        
        Arguments
            * user_emb: User embedding
            * limit: Number of recommendations to make

        Return
            News recommendations

        """

        assert self.news_vecs.any(), "Please fit/load model before querying for recommendations"

        # Get news scores
        preds = np.dot(self.news_vecs, user_embedding)

        # Get best news
        idx_top = np.argpartition(preds, -limit)[-limit:]
        idx_top = idx_top[np.argsort(-preds[idx_top])]
        
        return DF_NEWS_TEST.iloc[idx_top]
