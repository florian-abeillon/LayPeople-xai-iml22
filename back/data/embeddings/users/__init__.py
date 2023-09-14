
from data.embeddings.load import load_vec
from utils.paths import PATH_TO_USERS_EMB

USERS_EMBEDDINGS = load_vec(PATH_TO_USERS_EMB + "embedding.vec")
