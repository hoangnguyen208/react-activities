import { IProfile } from './../models/user';
import { RootStore } from './rootStore';
import { observable, action, runInAction, computed } from 'mobx';
import agent from '../api/agent';
import { toast } from 'react-toastify';
import { IPhoto } from '../models/photo';

export default class UserStore {
    rootStore: RootStore;

    constructor(rootStore: RootStore) {
      this.rootStore = rootStore;
    }

    @observable profile: IProfile | null = null;
    @observable loadingProfile = true;
    @observable uploadingPhoto = false;
    @observable loading = false;

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

    @action setMainPhoto = async (photo: IPhoto) => {
      this.loading = true;
      try {
        await agent.User.setMainPhoto(photo.id);
        runInAction(() => {
          this.rootStore.authStore.user!.image = photo.url;
          this.profile!.photos.find(x => x.isMain)!.isMain = false;
          this.profile!.photos.find(x => x.id === photo.id)!.isMain = true;
          this.profile!.image = photo.url;
          this.loading = false;
        })
      } catch (error) {
        console.log(error);
        toast.error('Problem setting photo as main');
        runInAction(() => {
          this.loading = false;
        })
      }
    }

    @action uploadPhoto = async (file: Blob) => {
      this.uploadingPhoto = true;
      try {
        const photo = await agent.User.uploadPhoto(file);
        runInAction(() => {
          if (this.profile) {
            this.profile.photos.push(photo);
            if (photo.isMain && this.rootStore.authStore.user) {
              this.rootStore.authStore.user.image = photo.url;
              this.profile.image = photo.url;
            } 
          }
          this.uploadingPhoto = false;
        })
      } catch (error) {
        console.log(error);
        toast.error('Problem loading photo');
        runInAction(() => {
          this.uploadingPhoto = false;
        })
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