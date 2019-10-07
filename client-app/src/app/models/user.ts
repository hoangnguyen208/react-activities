export interface IUser {
    username: string;
    displayName: string;
    token: string;
    image?: string;
}

export interface IAuthFormValues {
    email: string;
    password: string;
    displayName?: string;
    username?: string;
}