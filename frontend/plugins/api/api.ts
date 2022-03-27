import { AuthHandler } from './auth';
import { AxiosConnectorService, ConnectionOptions } from './axios';
import axios from 'axios';

export class ApiHandler {
    get service(): AxiosConnectorService {
        return this._service;
    }

    private _service: AxiosConnectorService;

    constructor(private mainUrl: string,
                private authHandler: AuthHandler,
                private options?: {
                    callbacks?: {
                        redirectToLogin?: (_: any) => void,
                        handleSuccessAuth?: (token: string) => void,
                        handleLogout?: () => void,
                    }
                }) {
        const initOptions: ConnectionOptions = {
            baseURL: mainUrl + '/api',
            // request interceptor handler
            reqHandleFunc: async (config) => {
                if (this.authHandler.isTokenExpired()) {
                    try {
                        const data = await axios.post(mainUrl + '/api/auth/refresh-token', {
                            token: this.authHandler.getRefreshToken()
                        });
                        this.authHandler.storeToken(data.data);
                    } catch (e) {
                        if (e.response.status === 401) {
                            this.authHandler.removeToken();
                            return this.options?.callbacks?.redirectToLogin&&  this.options?.callbacks.redirectToLogin(config);
                        }
                    }
                }
                config.headers = {
                    ...config.headers,
                    Authorization: 'Bearer ' + this.authHandler.getAccessToken()
                };

                return config;
            },
            resErrorFunc: (config: any) => {
                const status = config.response?.status
                if (status === 401) {
                    this.options?.callbacks?.redirectToLogin &&  this.options?.callbacks.redirectToLogin(config);
                }
                return Promise.reject(config);
            },
            resHandleFunc: (r) => r,
            validateStatus: function (status) {
                return status < 400; // Resolve only if the status code is less than 500
            }
        };

        this._service = new AxiosConnectorService(initOptions);
    }

    logout() {
        this.authHandler.removeToken();
        this.options?.callbacks?.handleLogout && this.options?.callbacks?.handleLogout();
    }

    async authenticate(user: string, pass: string) {
        try {
            const {data} = await this.service.post('/auth/login', {username: user, password: pass});
            if (data.access_token) {
                this.authHandler.storeToken(data);
                this.options?.callbacks?.handleSuccessAuth && this.options?.callbacks?.handleSuccessAuth(data.access_token);

                return data.access_token;
            }
        } catch (e) {
            console.error(e);
        }
        return false;
    }
}
