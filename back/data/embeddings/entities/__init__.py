
from data.embeddings.load import load_vec
from utils.paths import PATH_TO_TEST

ENTS_EMBEDDINGS = load_vec(PATH_TO_TEST + "entity_embedding.vec")
