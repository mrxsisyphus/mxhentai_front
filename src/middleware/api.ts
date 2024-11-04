import axios, {AxiosResponse} from "axios";
import {Response} from "../types/response";
import Auth from "./auth";

export const baseURL = "/api/v1";

export const getBaseURL = () => {
    return baseURL;
};


export const getRemoteTestUrl = () => {
    return "http://tcp.stayhugry.top:10011/api/v1";
};

export const getLocalTestUrl = () => {
    return "http://127.0.0.1:8888/api/v1";
};

export const getLocalNetTestUrl = () => {
    return "http://192.168.2.56:8888/api/v1";
};

class AppError extends Error{
    code: number
    message: string
    stack: string | undefined

    constructor(message: string, code: number) {
        super(message);
        this.code = code;
        this.message = message || "未知错误";
        this.stack = new Error().stack;
    }

}


const API = axios.create({
    baseURL: getBaseURL(),
    withCredentials: true,
});


API.interceptors.response.use(
    function (response: AxiosResponse<Response<any>>) {
        const code = response.data.code
        if (code === 0) {
            return response;
        }
        if (code === 401) {
            Auth.signout()
            window.location.href = "/login"
        }
        throw new AppError(
            response.data.msg,
            response.data.code
        );
    },
    function (error) {
        return Promise.reject(error);
    }
);
// API.defaults.headers.common['Access-Control-Allow-Origin'] = "*"


export default API;
