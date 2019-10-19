export interface IAttendee {
    username: string;
    displayName: string;
    email: string;
    image: string;
    isHost: boolean;
    following?: boolean;
}