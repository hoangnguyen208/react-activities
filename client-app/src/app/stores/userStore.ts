import { IProfile, IUserActivity } from './../models/user';
import { RootStore } from './rootStore';
import { observable, action, runInAction, computed, reaction } from 'mobx';
import agent from '../api/agent';
import { toast } from 'react-toastify';

export default class UserStore {
    rootStore: RootStore;

    constructor(rootStore: RootStore) {
      this.rootStore = rootStore;

      reaction(
        () => this.activeTab,
        activeTab => {
          if (activeTab === 3 || activeTab === 4) {
            const predicate = activeTab === 3 ? 'followers' : 'following';
            this.loadFollowings(predicate);
          } else {
            this.followings = [];
          }
        }
      )
    }

    @observable profile: IProfile | null = null;
    @observable loadingProfile = true;
    @observable loading = false;
    @observable followings: IProfile[] = [];
    @observable activeTab: number = 0;
    @observable userActivities: IUserActivity[] = [];    
    @observable loadingActivities = false;

    @action follow = async (email: string) => {
      this.loading = true;
      try {
        await agent.User.follow(email);
        runInAction(() => {
          this.profile!.following = true;
          this.profile!.followersCount++;
          this.loading = false;
        })
      } catch (error) {
        console.log(error);
        toast.error('Problem following user');
        runInAction(() => {
          this.loading = false;
        })
      }
    }

    @action loadFollowings = async (predicate: string) => {
      this.loading = true;
      try {
        const profiles = await agent.User.listFollowings(this.profile!.username, predicate);
        runInAction(() => {
          this.followings = profiles;
          this.loading = false;
        })
      } catch (error) {
        console.log(error);
        toast.error('Problem loading followings');
        runInAction(() => {
          this.loading = false;
        })
      }
    }

    @action loadProfile = async (email: string) => {
      this.loadingProfile = true;
      try {
        const profile = await agent.User.profile(email);
        runInAction(() => {
          this.profile = profile;
          this.loadingProfile = false;
        });
      } catch (error) {
        runInAction(() => {
          this.loadingProfile = false;
        });
        console.log(error);
      }
    }

    @action loadUserActivities = async (username: string, predicate?: string) => {
      this.loadingActivities = true;
      try {
        const activities = await agent.User.listActivities(username, predicate!);
        runInAction(() => {
          this.userActivities = activities;
          this.loadingActivities = false;
        });
      } catch (error) {
        console.log(error);
        toast.error('Problem loading activities');
        runInAction(() => {
          this.loadingActivities = false;
        });
      }
    }

    @action setActiveTab = (activeIndex: number) => {
      this.activeTab = activeIndex;
    }

    @action unfollow = async (email: string) => {
      this.loading = true;
      try {
        await agent.User.unfollow(email);
        runInAction(() => {
          this.profile!.following = false;
          this.profile!.followersCount--;
          this.loading = false;
        })
      } catch (error) {
        console.log(error);
        toast.error('Problem unfollowing user');
        runInAction(() => {
          this.loading = false;
        })
      }
    }

    @action updateProfile = async (profile: Partial<IProfile>) => {
      try {
        await agent.User.updateProfile(profile);
        runInAction(() => {
          if (profile.displayName !== this.rootStore.authStore.user!.displayName) {
            this.rootStore.authStore.user!.displayName = profile.displayName!;
          }
          this.profile = {...this.profile!, ...profile};
        })
      } catch (error) {
        toast.error('Problem updating profile');
      }
    }

    @computed get isCurrentUser() {
      if (this.rootStore.authStore.user && this.profile) {
        return this.rootStore.authStore.user.username === this.profile.username;
      } else {
        return false;
      }
    }
}