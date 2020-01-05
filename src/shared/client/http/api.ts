import * as Axios from "axios";
import {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";

type reqMiddleWare = (conf: AxiosRequestConfig) => AxiosRequestConfig
type resMiddleWare = (conf: AxiosResponse) => AxiosResponse
type errFilter = (conf: AxiosError) => AxiosError

const apiFactory = (opt: AxiosRequestConfig = {}, middleWares?: { req: [reqMiddleWare], res: [resMiddleWare], err: [errFilter] }): AxiosInstance => {

    // @ts-ignore
    const api: AxiosInstance = Axios.create(opt)
    if (middleWares) {
        const {req, res, err} = middleWares;
        const masterResMiddleWare: resMiddleWare = (_conf: AxiosResponse) => {
            let conf = _conf;
            res.forEach((i) => {
                let newConf = i(conf);
                conf = newConf;
                return conf;
            })
            return conf;
        }
        const errorFilter: errFilter = (_err: AxiosError) => {
            let error = _err;
            err.forEach((i) => {
                let newConf = i(error);
                error = newConf;
                return error;
            })
            return error;
        }
        const masterReqMiddleWare: reqMiddleWare = (_conf: AxiosRequestConfig) => {
            let conf = _conf;
            req.forEach((i) => {
                let newConf = i(conf);
                conf = newConf;
                return conf;
            })
            return conf;
        }

        api.interceptors.request.use(masterReqMiddleWare, errorFilter)
        api.interceptors.response.use(masterResMiddleWare, errorFilter)
    }

    return api;
}
export default apiFactory;
