interface CatLabels {
    [key: string]: {
      label: string;
    };
}

const cats: CatLabels = {
  "0": {
    label: "autos"
  },
  "1": {
    label: "entertainment"
  },
  "2": {
    label: "finance"
  },
  "3": {
    label: "foodanddrink"
  },
  "4": {
    label: "health"
  },
  "5": {
    label: "kids"
  },
  "6": {
    label: "lifestyle"
  },
  "7": {
    label: "movies"
  },
  "8": {
    label: "autosenthusiasts"
  },
  "9": {
    label: "music"
  },
  "10": {
    label: "news"
  },
  "11": {
    label: "sports"
  },
  "12": {
    label: "travel"
  },
  "13": {
    label: "tv"
  },
  "14": {
    label: "video"
  },
  "15": {
    label: "weather"
  }
}

export const catsMap = (catString: string) => {
  if (cats[catString]) {
    return cats[catString].label;
  }
  else {
    return "";
  }
}