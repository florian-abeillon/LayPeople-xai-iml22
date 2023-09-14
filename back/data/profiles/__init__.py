import csv

from utils.constants import PROFILES
from utils.paths import PATH_TO_PROFILES

PROFILES_HISTORY = {}

for profile in PROFILES:
    with open(PATH_TO_PROFILES + f"{profile}.csv") as f:
        reader = csv.reader(f)
        PROFILES_HISTORY[profile] = next(reader)
