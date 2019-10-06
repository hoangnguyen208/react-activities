import { observable, computed, action, runInAction, reaction } from 'mobx';
import { IUser, IUserFormValues } from '../models/user';
import agent from '../api/agent';
import { RootStore } from './rootStore';
import { history } from '../..';

export default class AuthStore {
    rootStore: RootStore;

    constructor(rootStore: RootStore) {
      this.rootStore = rootStore;

      reaction(
            () => this.token,
            token => {
                if (token) {
                    window.localStorage.setItem('jwt', token);
                } else {
                    window.localStorage.removeItem('jwt');
                }
            }
        )
    }
    
    @observable token: string | null = window.localStorage.getItem('jwt');
    @observable user: IUser | null = null;

    @action getAuthUser = async () => {
      try {
        const user = await agent.User.current();
        runInAction(() => {
          this.user = user;
        })
      } catch (error) {
        console.log(error);
      }
    };

    @action login = async (values: IUserFormValues) => {
        try {
            const user = await agent.Auth.login(values);
            runInAction(() => {
                this.user = user;
            });
            this.setToken(user.token);
            history.push('/activities');
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    @action logout = () => {
        this.setToken(null);
        this.user = null;
        history.push('/');
    }

    @action setToken = (token: string | null) => {
        this.token = token;
    }

    @computed get isLoggedIn() {
        // !! means return this.user !== null ? true : false;
        return !!this.user;
    }
}