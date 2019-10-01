import { observable, action, computed, configure, runInAction, decorate } from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import { IActivity } from '../models/activity';
import agent from '../api/agent';

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
      } catch (error) {
        runInAction('create activity error', () => {
          console.log(error);
          this.submitting = false;
        });
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
      } catch (error) {
        runInAction('edit activity error', () => {
          console.log(error);
          this.submitting = false;
        });
      }
    };

    @action loadActivities = async () => {
        this.loadingInitial = true;
        try {
          const activities = await agent.Activities.list();
          runInAction('loading activities', () => {
            activities.forEach(activity => {
              activity.date = activity.date.split('.')[0];
              this.activityRegistry.set(activity.id, activity);
            });
            this.loadingInitial = false;
          });
        } catch (error) {
          runInAction('load activities error', () => {
            console.log(error);
            this.loadingInitial = false;
          });
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
      } else {
        this.loadingInitial = true;
        try {
          activity = await agent.Activities.details(id);
          runInAction('getting activity', () => {
            this.activity = activity;
            this.loadingInitial = false;
          });
        } catch (error) {
          console.log(error);
          runInAction('get activity error', () => {
            this.loadingInitial = false;
          });
        }
      }
    };

    getActivity = (id: string) => {
      return this.activityRegistry.get(id);
    }

    @computed get activitiesByDate() {
      return Array.from(this.activityRegistry.values()).sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    };
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