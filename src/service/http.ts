const cache = new Map<string, Promise<unknown>>();

export const LATENCY = 260;

export function loadDataset<T>(name: string): Promise<T> {
    const cached = cache.get(name);

    if (cached) {
        return cached as Promise<T>;
    }

    const request = fetch(`${import.meta.env.BASE_URL}demo/data/${name}.json`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Unable to load ${name} (${response.status})`);
            }

            return response.json() as Promise<T>;
        })
        .then((value) => new Promise<T>((resolve) => setTimeout(() => resolve(value), LATENCY)))
        .catch((cause: unknown) => {
            cache.delete(name);
            throw cause;
        });

    cache.set(name, request);

    return request;
}
