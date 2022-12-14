// nicked from https://www.newline.co/@bespoyasov/how-to-use-fetch-with-typescript--a81ac257
import Toast from 'react-native-toast-message';

export async function request<TResponse>(
    url: string,
    config: RequestInit,
): Promise<TResponse> {
    try {
        const response = await fetch(url, config);
        if (!response.ok) {
            const responseBody = await response.json();
            throw Error(JSON.stringify(responseBody));
        }
        return await response.json();
    } catch (error) {
        Toast.show({
            type: 'error',
            text1: `Network error: please try later`,
            position: 'bottom',
            visibilityTime: 5000,
        });
        return {} as TResponse;
    }
}
