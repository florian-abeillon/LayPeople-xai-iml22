export interface queryBackendProps {
    route: string;
}

export const BASE_URL = 'http://127.0.0.1:8000';

interface Param {
    name: string;
    value: string;
}

export interface Parameters {
    history?: string[];
    wei_mtd: {
        content: number,
        popularity: number,
        users: number,
    }
    wei_obj?: {
        exploration: number,
        diversity: number,
        surprise: number,
    }
    memory?: boolean,
    inflex?: number,
    steep?: number,
    cats_rm?: string[],
    subcats_rm?: string[],
}

export const defaultParameters: Parameters = {
    history: [],
    wei_mtd: {
        content: 0.3,
        popularity: 0.3,
        users: 0.4,
    },
    wei_obj : {
        exploration: 0.3,
        diversity: 0.3,
        surprise: 0.4,
    },
    memory: false,
    inflex: 1/8,
    steep: 2,
    cats_rm: [],
    subcats_rm: [],
};
export async function queryBackend (route: string, urlParams: Param[] = [], parameters: Parameters = defaultParameters): Promise<Response> {
    var requestURL = new URL(`${BASE_URL}/${route}`);
    urlParams.forEach(urlParam => requestURL.searchParams.append(urlParam.name, urlParam.value));
    return await fetch(requestURL.toString(),
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/x-www-form-urlencoded"
              },
            body: "kwargs=" + encodeURIComponent(JSON.stringify(parameters))
        }
    );
}


