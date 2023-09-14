
from data.embeddings.load import load_vec
from utils.paths import PATH_TO_NEWS_EMB

NEWS_EMBEDDINGS = load_vec(PATH_TO_NEWS_EMB + "embedding.vec")
