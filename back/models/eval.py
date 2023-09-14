
# from typing import List, Tuple, Union

# import pandas as pd
# from data.mind.prep import DF_NEWS_PREP
# from sklearn.metrics.pairwise import cosine_similarity

# from data.embeddings.users import USERS_EMBEDDINGS
# from data.embeddings.news import NEWS_EMBEDDINGS


# def eval_reco(hist_embedding: np.array, imprs: List[str], clicked: List[str]) -> Tuple[float, float]:
#     """ Evaluate recommendation """

#     embeddings = [ NEWS_EMBEDDINGS[nid] for nid in imprs ] 
#     sims = cosine_similarity([hist_embedding], embeddings)[0]
    
#     score, rank = [], []
#     for i, ( nid, sim ) in enumerate(sorted(zip(imprs, sims), key=lambda x: x[1], reverse=True)):
#         if nid in clicked:
#             score.append(sim)
#             rank.append(i)
            
#     return np.mean(score), 1 - np.mean(rank) / len(imprs)


# def eval_recos() -> Tuple[float, float]:
#     """ Average evaluation of recommendations """
#     scores, ranks = [], []
#     for hist_embedding, ( _, row ) in zip(USERS_EMBEDDINGS, DF_NEWS_PREP.iterrows()):
#         score, rank = eval_reco(hist_embedding, row['imprs'], row['clicked'])
#         scores.append(score)
#         ranks.append(rank)
#     return np.mean(scores), np.mean(ranks)
