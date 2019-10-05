import { observable, action, computed, configure, runInAction, decorate } from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import { IActivity } from '../models/activity';
import agent from '../api/agent';
import { history } from '../../index';
import { toast } from 'react-toastify';

// enable strict mode of Mobx
configure({enforceActions: 'always'});

export class ActivityStore {
    @observable activity: IActivity | null = null;
    @observable activityRegistry = new Map();
    @observable loadingInitial = false;
    @observable submitting = false;
    @observable target = '';

    @action cancelSelectedActivity = () => {
      this.activity = null;
    };

    @action clearActivity = () => {
      this.activity = null;
    }

    @action createActivity  = async (activity: IActivity) => {
      this.submitting = true;
      try {
        await agent.Activities.create(activity);
        runInAction('creating activity', () => {
          this.activityRegistry.set(activity.id, activity);
          this.submitting = false;
        });
        history.push(`/activities/${activity.id}`);
      } catch (error) {
        runInAction('create activity error', () => {
          this.submitting = false;
        });
        toast.error('Problem submitting data');
        console.log(error.response);
      }
    };

    @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
      this.submitting = true;
      this.target = event.currentTarget.name;
      try {
        await agent.Activities.delete(id);
        runInAction('delete activity', () => {
          this.activityRegistry.delete(id);
          this.submitting = false;
          this.target = '';
        });
      } catch (error) {
        runInAction('delete activity error', () => {
          this.submitting = false;
          this.target = '';
        });
        console.log(error);
      }
    };

    @action editActivity = async (activity: IActivity) => {
      this.submitting = true;
      try {
        await agent.Activities.update(activity);
        runInAction('edit activity', () => {
          this.activityRegistry.set(activity.id, activity);
          this.activity = activity;
          this.submitting = false;
        });
        history.push(`/activities/${activity.id}`);
      } catch (error) {
        runInAction('edit activity error', () => {
          this.submitting = false;
        });
        toast.error('Problem submitting data');
        console.log(error.response);
      }
    };

    @action loadActivities = async () => {
        this.loadingInitial = true;
        try {
          const activities = await agent.Activities.list();
          runInAction('loading activities', () => {
            activities.forEach(activity => {
              activity.date = new Date(activity.date);
              this.activityRegistry.set(activity.id, activity);
            });
            this.loadingInitial = false;
          });
        } catch (error) {
          runInAction('load activities error', () => {
            this.loadingInitial = false;
          });
          console.log(error);
        }

        // This method returns a promise, no need to use async await
        // agent.Activities.list()
        //   .then(activities => {
        //     activities.forEach(activity => {
        //       activity.date = activity.date.split('.')[0];
        //       this.activities.push(activity);
        //     });
        //   })
        //   .catch(error => console.log(error))
        //   .finally(() => this.loadingInitial = false);
    };

    @action loadActivity = async (id: string) => {
      let activity = this.getActivity(id);
      if (activity) {
        this.activity = activity;
        return activity;
      } else {
        this.loadingInitial = true;
        try {
          activity = await agent.Activities.details(id);
          runInAction('getting activity', () => {
            activity.date = new Date(activity.date);
            this.activity = activity;
            this.activityRegistry.set(activity.id, activity);
            this.loadingInitial = false;
          });
          return activity;
        } catch (error) {
          runInAction('get activity error', () => {
            this.loadingInitial = false;
          });
          console.log(error);
        }
      }
    };

    @computed get activitiesByDate() {
      return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
    };

    getActivity = (id: string) => {
      return this.activityRegistry.get(id);
    }

    groupActivitiesByDate (activities: IActivity[]) {
      const sortedActivities = activities.sort(
        (a, b) => a.date.getTime() - b.date.getTime()
      );
      return Object.entries(sortedActivities.reduce((activities, activity) => {
        const date = activity.date.toISOString().split('T')[0];
        activities[date] = activities[date] ? [...activities[date], activity] : [activity];
        return activities;
      }, {} as {[key: string]: IActivity[]}));
    }
}

// If don't wanna use decorators
// decorate(ActivityStore, {
//   activities: observable,
//   activityRegistry: observable,
//   editMode: observable,
//   loadingInitial: observable,
//   selectedActivity: observable,
//   submitting: observable,
//   target: observable,
//   cancelSelectedActivity: action,
//   cancelFormOpen: action,
//   createActivity: action,
//   deleteActivity: action,
//   editActivity: action,
//   loadActivities: action,
//   openCreateForm: action,
//   openEditForm: action,
//   selectActivity: action,
//   activitiesByDate: computed
// });

export default createContext(new ActivityStore());