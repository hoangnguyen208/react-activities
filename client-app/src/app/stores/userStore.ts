import { RootStore } from './rootStore';

export default class UserStore {
    rootStore: RootStore;

    constructor(rootStore: RootStore) {
      this.rootStore = rootStore;
    }
}