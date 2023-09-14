
import json

from utils.paths import PATH_TO_DECODERS

with open(PATH_TO_DECODERS + 'decoder_ent.json') as f:
    DECODER_ENT = json.load(f)
with open(PATH_TO_DECODERS + 'decoder_cat.json') as f:
    DECODER_CAT = json.load(f)
with open(PATH_TO_DECODERS + 'decoder_subcat.json') as f:
    DECODER_SUBCAT = json.load(f)
