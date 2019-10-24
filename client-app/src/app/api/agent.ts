import { IProfile } from '../models/user';
import { IActivity, IActivitiesEnvelope } from './../models/activity';
import axios, { AxiosResponse } from 'axios';
import { history } from '../..';
import { toast } from 'react-toastify';
import { IUser, IAuthFormValues } from '../models/user';
import { IPhoto } from '../models/photo';

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
    const {status, data, config, headers} = error.response;
    if (status === 404 || (status === 400 && config.method === 'get' && data.errors.hasOwnProperty('id'))) {
        history.push('/notfound'); // can be '/anything'
    }
    if (status === 500) {
        toast.error('Server error - check the terminal for more info!');
    }
    if (status === 401 && headers["www-authenticate"] === 'Bearer error="invalid_token", error_description="The token is expired"') {
        console.log(error.response);
        window.localStorage.removeItem('jwt');
        history.push('/');
        toast.info('Your session has expired, please login again');
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
    delete: (url: string) => axios.delete(url).then(delay(delayDuration)).then(responseBody),
    postForm: (url: string, file: Blob) => {
        let formData = new FormData();
        formData.append('File', file);
        return axios.post(url, formData, {
            headers: {'Content-type': 'multipart/form-data'}
        }).then(responseBody);
    }
};

const Activities = {
    list: (params: URLSearchParams): Promise<IActivitiesEnvelope> => axios.get('activities', {params: params}).then(delay(delayDuration)).then((responseBody)),
    details: (id: string) => requests.get(`activities/${id}`),
    create: (activity: IActivity) => requests.post('activities', activity),
    update: (activity: IActivity) => requests.put(`activities/${activity.id}`, activity),
    delete: (id: string) => requests.delete(`activities/${id}`),
    attend: (id: string) => requests.post(`activities/${id}/attend`, {}),
    unattend: (id: string) => requests.delete(`activities/${id}/unattend`)
};

const Auth = {
    login: (user: IAuthFormValues): Promise<IUser> => requests.post('auth/login', user),
    register: (user: IAuthFormValues): Promise<IUser> => requests.post('auth/register', user)
};

const Photo = {
    uploadPhoto: (photo: Blob): Promise<IPhoto> => requests.postForm(`photo`, photo),
    setMainPhoto: (id: string) => requests.post(`photo/${id}/setMain`, {}),
    deletePhoto: (id: string) => requests.delete(`photo/${id}`)
}

const User = {
    current: (): Promise<IUser> => requests.get('user'),
    profile: (email: string): Promise<IProfile> => requests.get(`user/${email}`),
    updateProfile: (profile: Partial<IProfile>) => requests.put(`user`, profile),
    follow: (email: string) => requests.post(`profile/${email}/follow`, {}),
    unfollow: (email: string) => requests.delete(`profile/${email}/follow`),
    listFollowings: (username: string, predicate: string) => requests.get(`profile/${username}/follow?predicate=${predicate}`),
    listActivities: (username: string, predicate: string) => requests.get(`user/${username}/activities?predicate=${predicate}`)
};


export default {
    Activities,
    Auth,
    User,
    Photo
}