import { observable, action, computed, configure, runInAction } from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import { IActivity } from '../models/activity';
import agent from '../api/agent';

configure({enforceActions: 'always'});

export class ActivityStore {
    @observable activities: IActivity[] = [];
    @observable activityRegistry = new Map();
    @observable editMode = false;
    @observable loadingInitial = false;
    @observable selectedActivity: IActivity | undefined;
    @observable submitting = false;
    @observable target = '';

    @action cancelSelectedActivity = () => {
      this.selectedActivity = undefined;
    }

    @action cancelFormOpen = () => {
      this.editMode = false;
    }

    @action createActivity = async (activity: IActivity) => {
      this.submitting = true;
      try {
        await agent.Activities.create(activity);
        runInAction('creating activity', () => {
          this.activityRegistry.set(activity.id, activity);
          this.editMode = false;
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
    }

    @action editActivity = async (activity: IActivity) => {
      this.submitting = true;
      try {
        await agent.Activities.update(activity);
        runInAction('edit activity', () => {
          this.activityRegistry.set(activity.id, activity);
          this.selectedActivity = activity;
          this.editMode = false;
          this.submitting = false;
        });
      } catch (error) {
        runInAction('edit activity error', () => {
          console.log(error);
          this.submitting = false;
        });
      }
    }

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

    @action openCreateForm = () => {
      this.editMode = true;
      this.selectedActivity = undefined;
    };

    @action openEditForm = (id: string) => {
      this.selectedActivity = this.activityRegistry.get(id);
      this.editMode = true;
    }

    @action selectActivity = (id: string) => {
        this.selectedActivity = this.activityRegistry.get(id);
        this.editMode = false;
    };

    @computed get activitiesByDate() {
      return Array.from(this.activityRegistry.values()).sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    }
}

export default createContext(new ActivityStore());