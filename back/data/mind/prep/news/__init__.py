
from data.mind.load import load_df
from utils.paths import PATH_TO_NEWS

DF_NEWS_PREP = load_df(
    PATH_TO_NEWS + "news.csv", 
    cols_list=['ents']
)
