import axios, { AxiosInstance, AxiosInterceptorManager, AxiosRequestConfig } from 'axios';

export type ConnectionOptions = AxiosRequestConfig
    & Partial<{
    reqHandleFunc: Parameters<AxiosInterceptorManager<AxiosRequestConfig>['use']>[0]
    resErrorFunc: (_) => any
    resHandleFunc: Parameters<AxiosInterceptorManager<AxiosRequestConfig>['use']>[0]
}>;

export class AxiosConnectorService {
    get service(): AxiosInstance {
        return this._service;
    }

    private _service: AxiosInstance;

    constructor({reqHandleFunc, resHandleFunc, resErrorFunc, ...options}: ConnectionOptions) {
        const _service = axios.create(options);
        const {interceptors} = _service;
        interceptors.request.use(
            reqHandleFunc,
        );
        interceptors.response.use(
            resHandleFunc, resErrorFunc
        )
        this._service = _service;
    }

    public get(url: string, data?: any, options?: any) {
        const axiosOpt = {
            ...options,
            ...{
                method: 'get',
                url,
                params: data
            }
        };
        return this._service(axiosOpt);
    }

    public post(url: string, data?: any, options?: any) {
        const axiosOpt = {
            ...options,
            ...{
                method: 'post',
                url
            }
        };
        if (data) {
            axiosOpt.data = data;
        }
        return this._service(axiosOpt);
    }

    public put(url: string, data?: any, options?: any) {
        const axiosOpt = {
            ...options,
            ...{
                method: 'put',
                url
            }
        };
        if (data) {
            axiosOpt.data = data;
        }
        return this._service(axiosOpt);
    }

    public delete(url: string, data?: any, options?: any) {
        const axiosOpt = {
            ...options,
            ...{
                method: 'delete',
                url,
                data
            }
        };
        return this._service(axiosOpt);
    }
}
