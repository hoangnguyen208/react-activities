import { IAttendee } from './attendee';
import { IComment } from './comment';

export interface IActivitiesEnvelope {
    activities: IActivity[];
    activityCount: number;
}

export interface IActivity {
    id: string;
    title: string;
    description: string;
    category: string;
    date: Date;
    city: string;
    venue: string;
    attendees: IAttendee[];
    isGoing: boolean;
    isHost: boolean;
    comments: IComment[];
}

export interface IActivityFormValues extends Partial<IActivity> { // Partial makes all extend of IActivity properties become optional in IActivityFormValues
    time?: Date;
}

export class ActivityFormValues implements IActivityFormValues {
    id?: string = undefined;
    title: string = '';
    category: string = '';
    description: string = '';
    date?: Date = undefined;
    time?: Date = undefined;
    city: string = '';
    venue: string = '';

    constructor(init?: IActivityFormValues) {
        if (init && init.date) {
            init.time = init.date;
        }
        Object.assign(this, init);
    } 
}