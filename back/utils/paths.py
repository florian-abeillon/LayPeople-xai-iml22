
PATH_TO_DATA = "data/"

PATH_TO_EMBEDDINGS = PATH_TO_DATA + "embeddings/"
PATH_TO_ENTS_EMB = PATH_TO_EMBEDDINGS + "entities/"
PATH_TO_NEWS_EMB = PATH_TO_EMBEDDINGS + "news/"
PATH_TO_USERS_EMB = PATH_TO_EMBEDDINGS + "users/"

PATH_TO_MIND = PATH_TO_DATA + "mind/"
PATH_TO_PREP = PATH_TO_MIND + "prep/"
PATH_TO_RAW = PATH_TO_MIND + "raw/"

PATH_TO_NEWS = PATH_TO_PREP + "news/"
PATH_TO_USERS = PATH_TO_PREP + "users/"

PATH_TO_TRAIN = PATH_TO_RAW + "train/"
PATH_TO_TEST = PATH_TO_RAW + "test/"
PATH_TO_UTILS = PATH_TO_RAW + "utils/"

PATH_TO_CATS = PATH_TO_DATA + "categories/"
PATH_TO_DECODERS = PATH_TO_DATA + "decoders/"
PATH_TO_PROFILES = PATH_TO_DATA + "profiles/"
PATH_TO_VIZ = PATH_TO_DATA + "visualization/"

PATH_TO_VIZ_BBM = PATH_TO_VIZ + "blackbox/"
PATH_TO_VIZ_RDM = PATH_TO_VIZ + "random/"
PATH_TO_VIZ_WBM = PATH_TO_VIZ + "whitebox/"

MODEL_TO_VIZ = {
    'blackbox': PATH_TO_VIZ_BBM,
    'random': PATH_TO_VIZ_RDM,
    'whitebox': PATH_TO_VIZ_WBM
}
