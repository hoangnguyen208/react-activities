import ActivityStore from './activityStore';
import UserStore from './userStore';
import AuthStore from './authStore';
import CommonStore from './commonStore';
import ModalStore from './modalStorage';
import { createContext } from 'react';
import { configure } from 'mobx';
import PhotoStore from './photoStore';

// enable strict mode of Mobx
configure({enforceActions: 'always'});

export class RootStore {
    activityStore: ActivityStore;
    userStore: UserStore;
    authStore: AuthStore;
    commonStore: CommonStore;
    modalStore: ModalStore;
    photoStore: PhotoStore;

    constructor() {
        this.activityStore = new ActivityStore(this);
        this.userStore = new UserStore(this);
        this.authStore = new AuthStore(this);
        this.commonStore = new CommonStore(this);
        this.modalStore = new ModalStore(this);
        this.photoStore = new PhotoStore(this);
    }
}

export const RootStoreContext = createContext(new RootStore());