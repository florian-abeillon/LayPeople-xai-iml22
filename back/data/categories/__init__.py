
import json

from utils.paths import PATH_TO_CATS

with open(PATH_TO_CATS + 'categories.json') as f:
    CATEGORIES = json.load(f)
