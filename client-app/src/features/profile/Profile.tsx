import React, { useContext, useEffect } from 'react'
import { Grid } from 'semantic-ui-react';
import ProfileHeader from './ProfileHeader';
import ProfileContent from './ProfileContent';
import { RootStoreContext } from '../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../app/layout/LoadingComponent';
import { RouteComponentProps } from 'react-router';

interface RouteParams {
    username: string
}

interface IProps extends RouteComponentProps<RouteParams> {}

const Profile: React.FC<IProps> = ({match}) => {
    const rootStore = useContext(RootStoreContext);
    const {loadingProfile, profile, loadProfile} = rootStore.userStore;

    useEffect(() => {
        loadProfile(match.params.username)
    }, [loadProfile, match])

    if (loadingProfile) return <LoadingComponent content='Loading...' />;

    return (
        <Grid>
            <Grid.Column width={16}>
                <ProfileHeader profile={profile!} />
                <ProfileContent />
            </Grid.Column>
        </Grid>
    )
}

export default observer(Profile)
