import { IActivity } from './../models/activity';
import axios, { AxiosResponse } from 'axios';
import { history } from '../..';
import { toast } from 'react-toastify';
import { IUser, IAuthFormValues } from '../models/user';

axios.defaults.baseURL = 'http://localhost:5000/api/';

// automatically add jwt token to authorized endpoints
axios.interceptors.request.use((config) => {
    const token = window.localStorage.getItem('jwt');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// http error response interceptor
axios.interceptors.response.use(undefined, error => {
    if (error.message === 'Network Error' && !error.response) {
        toast.error('Network error - make sure API is running!');
    }
    const {status, data, config} = error.response;
    if (status === 404 || (status === 400 && config.method === 'get' && data.errors.hasOwnProperty('id'))) {
        history.push('/notfound'); // can be '/anything'
    }
    if (status === 500) {
        toast.error('Server error - check the terminal for more info!');
    }
    throw error.response;
});

const responseBody = (response: AxiosResponse) => response.data;

const delay = (ms: number) => (response: AxiosResponse) => 
    new Promise<AxiosResponse>(resolve => setTimeout(() => resolve(response), ms));

const delayDuration = 500;

const requests = {
    get: (url: string) => axios.get(url).then(delay(delayDuration)).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(delay(delayDuration)).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(delay(delayDuration)).then(responseBody),
    delete: (url: string) => axios.delete(url).then(delay(delayDuration)).then(responseBody)
};

const Activities = {
    list: (): Promise<IActivity[]> => requests.get('activities'),
    details: (id: string) => requests.get(`activities/${id}`),
    create: (activity: IActivity) => requests.post('activities', activity),
    update: (activity: IActivity) => requests.put(`activities/${activity.id}`, activity),
    delete: (id: string) => requests.delete(`activities/${id}`)
};

const Auth = {
    login: (user: IAuthFormValues): Promise<IUser> => requests.post('auth/login', user),
    register: (user: IAuthFormValues): Promise<IUser> => requests.post('auth/register', user)
};

const User = {
    current: (): Promise<IUser> => requests.get('user')
};


export default {
    Activities,
    Auth,
    User
}