
from data.mind.load import load_df
from utils.paths import PATH_TO_TEST, PATH_TO_TRAIN

# News datasets
labels_news = [
    'cat', 'subcat', 
    'title', 'abstract', 'url', 
    'title_ent', 'abstract_ent'
]

DF_NEWS_TRAIN = load_df(
    PATH_TO_TRAIN + "news.tsv", 
    labels=labels_news, 
    cols_list=[ 'title_ent', 'abstract_ent' ]
)

DF_NEWS_TEST = load_df(
    PATH_TO_TEST + "news.tsv", 
    labels=labels_news, 
    cols_list=[ 'title_ent', 'abstract_ent' ]
)



# Users datasets
labels_users = [
    'id_user', 'time', 
    'history', 'impressions'
]

DF_USERS_TRAIN = load_df(
    PATH_TO_TRAIN + "behaviors.tsv", 
    labels=labels_users
)

DF_USERS_TEST = load_df(
    PATH_TO_TEST + "behaviors.tsv", 
    labels=labels_users
)
