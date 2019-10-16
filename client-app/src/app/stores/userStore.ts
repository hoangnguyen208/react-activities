import { IProfile } from './../models/user';
import { RootStore } from './rootStore';
import { observable, action, runInAction, computed } from 'mobx';
import agent from '../api/agent';
import { toast } from 'react-toastify';

export default class UserStore {
    rootStore: RootStore;

    constructor(rootStore: RootStore) {
      this.rootStore = rootStore;
    }

    @observable profile: IProfile | null = null;
    @observable loadingProfile = true;

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