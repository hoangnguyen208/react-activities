import { IPhoto } from "./photo";

export interface IUser {
    username: string;
    displayName: string;
    token: string;
    image?: string;
    email: string;
}

export interface IAuthFormValues {
    email: string;
    password: string;
    displayName?: string;
    username?: string;
}

export interface IProfile {
    displayName: string;
    email: string;
    username: string;
    bio: string;
    image: string;
    photos: IPhoto[];
    following: boolean;
    followersCount: number;
    followingCount: number;
}