const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiRespone<T = any> {
    success: boolean;
    message: string;
    data: T;
    meta?: any;
}


interface RequestOptions {
    headers?: Record<string, string>;
}

class HttpService {
    private getAuthHeader(): Record<string, string> {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer${token}` })
        }
    }

    private getHeaders(auth: boolean = true): Record<string, string> {
        if (auth) {
            return this.getAuthHeader();
        }
        return { 'Content-Type': 'application/json' }
    }

    private async makeRequest<T = any>(
        endPoint: string,
        method: string,
        body?: any,
        auth: boolean = true,
        options?: RequestOptions,
    ): Promise<ApiRespone<T>> {
        try {
            const url = `${BASE_URL}/${endPoint}`;
            const headers = {
                ...this.getHeaders(auth),
                ...options?.headers
            }

            const config: RequestInit = {
                method,
                headers,
                ...(body && { body: JSON.stringify(body) }),
            }

            const response = await fetch(url, config);
            const data: ApiRespone<T> = await response.json()
            if (!response.ok) {
                throw new Error(data.message || `HTTP ${response.status} : ${response.statusText}`)
            }
            return data;
        } catch (error) {
            console.error(`API Error : [${method} ${endPoint}]`, error)
            throw error;
        }
    }

    // Method with authentication 
    async getWithAuth<T = any>(endPoint: string, options?: RequestOptions): Promise<ApiRespone<T>> {
        return this.makeRequest<T>(endPoint, 'GET', null, true, options)
    }

    async postWithAuth<T = any>(endPoint: string, body: any, options?: RequestOptions): Promise<ApiRespone<T>> {
        return this.makeRequest<T>(endPoint, 'POST', body, true, options)
    }

    async putWithAuth<T = any>(endPoint: string, body: any, options?: RequestOptions): Promise<ApiRespone<T>> {
        return this.makeRequest<T>(endPoint, 'PUT', body, true, options)
    }

    async deleteWithAuth<T = any>(endPoint: string, options?: RequestOptions): Promise<ApiRespone<T>> {
        return this.makeRequest<T>(endPoint, 'DELETE', null, true, options)
    }

    async postWithoutAuth<T = any>(endPoint: string, body: any, options?: RequestOptions): Promise<ApiRespone<T>> {
        return this.makeRequest<T>(endPoint, 'POST', body, false, options)
    }

    async getWithoutAuth<T = any>(endPoint: string, options?: RequestOptions): Promise<ApiRespone<T>> {
        return this.makeRequest<T>(endPoint, 'GET', null, false, options)
    }
}


// export the singalton instance
export const httpService = new HttpService();

// bind created the new function where this is permanently set to the instance of HTTPService 
export const getWithAuth = httpService.getWithAuth.bind(httpService)
export const postWithAuth = httpService.postWithAuth.bind(httpService)
export const putWithAuth = httpService.putWithAuth.bind(httpService)
export const deleteWithAuth = httpService.deleteWithAuth.bind(httpService)

export const postWithoutAuth = httpService.postWithoutAuth.bind(httpService)
export const getWithoutAuth = httpService.getWithoutAuth.bind(httpService)