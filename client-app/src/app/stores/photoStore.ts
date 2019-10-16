import { RootStore } from "./rootStore";
import { observable, runInAction, action } from "mobx";
import { IPhoto } from "../models/photo";
import { toast } from "react-toastify";
import agent from "../api/agent";

export default class PhotoStore {
    rootStore: RootStore;

    constructor(rootStore: RootStore) {
      this.rootStore = rootStore;
    }

    @observable uploadingPhoto = false;
    @observable loadingSetMain = false;
    @observable loadingDeletePhoto = false;

    @action deletePhoto = async (photo: IPhoto) => {
        this.loadingDeletePhoto = true;
        try {
          await agent.Photo.deletePhoto(photo.id);
          runInAction(() => {
            this.rootStore.userStore.profile!.photos = this.rootStore.userStore.profile!.photos.filter(x => x.id !== photo.id);
            this.loadingDeletePhoto = false;
          })
        } catch (error) {
          toast.error('Problem deleting the photo');
          runInAction(() => {
            this.loadingDeletePhoto = false;
          })
        }
    }

    @action setMainPhoto = async (photo: IPhoto) => {
        this.loadingSetMain = true;
        try {
          await agent.Photo.setMainPhoto(photo.id);
          runInAction(() => {
            this.rootStore.authStore.user!.image = photo.url;
            this.rootStore.userStore.profile!.photos.find(x => x.isMain)!.isMain = false;
            this.rootStore.userStore.profile!.photos.find(x => x.id === photo.id)!.isMain = true;
            this.rootStore.userStore.profile!.image = photo.url;
            this.loadingSetMain = false;
          })
        } catch (error) {
          console.log(error);
          toast.error('Problem setting photo as main');
          runInAction(() => {
            this.loadingSetMain = false;
          })
        }
    }
  
    @action uploadPhoto = async (file: Blob) => {
        this.uploadingPhoto = true;
        try {
          const photo = await agent.Photo.uploadPhoto(file);
          runInAction(() => {
            if (this.rootStore.userStore.profile) {
                this.rootStore.userStore.profile.photos.push(photo);
              if (photo.isMain && this.rootStore.authStore.user) {
                this.rootStore.authStore.user.image = photo.url;
                this.rootStore.userStore.profile.image = photo.url;
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
}