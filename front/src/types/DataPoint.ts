export type Profile = {
    title: 'No Profile' | 'Politician' | 'Health-Guru' | 'Athlete',
    name: '' | 'politician' | 'health_guru' | 'athlete',
    categories: string[],
    logo: JSX.Element,
} 

export interface Model {
    title: 'White box' | 'Black box' | 'Random',
    name: 'whitebox' | 'blackbox' | 'random',
    description: string,
    logo: JSX.Element,
}

export interface Statistic {
    index: string,
    cat: number
}

export interface UrlParameter {
    name: string,
    value: string,
}

export interface DataPoint {
    X1: number;
    X2: number;
    cat: string;
    subcat: string;
    index: string;
    isInRecommendation?: boolean;
}
export interface DataCount {
    X: number;
    label: string;
}

export interface RugDataRow {
    frame: number;
    user_id: number;
    news_id: number;
    avg_distance: number;
    category: number;
}
export interface Feature {
    name: string;
    value: number;
    color: string;
}
export interface Article {
    index: string;
    title: string;
    abstract: string;
    cat: string;
    subcat: string;
    features: Feature[];
    url?: string;
    title_ent?: string;
    abstract_ent?: string;
    content_w: number,
    popularity_w: number,
    users_w: number,

}
