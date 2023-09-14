
import pandas as pd
from utils.paths import PATH_TO_VIZ_WBM

NEWS_VISUALIZATION = pd.read_csv(
    PATH_TO_VIZ_WBM + 'news.csv', 
    index_col=0
)

USERS_VISUALIZATION = pd.read_csv(
    PATH_TO_VIZ_WBM + 'users.csv', 
    index_col=0
)
