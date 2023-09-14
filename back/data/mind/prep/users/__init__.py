
from data.mind.load import load_df
from scipy import io
from utils.paths import PATH_TO_USERS

DF_USERS_PREP = load_df(
    PATH_TO_USERS + "behaviors.csv", 
    cols_list=[ 'history', 'imprs', 'clicked' ]
)

# Sparse matrix
USERS_HISTS = io.mmread(
    PATH_TO_USERS + "histories.mtx"
)
