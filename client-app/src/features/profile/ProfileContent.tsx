import React from 'react';
import { Tab } from 'semantic-ui-react';
import ProfilePhoto from '../profile/ProfilePhoto';
import ProfileDescription from './ProfileDescription';
import ProfileFollowings from './ProfileFollowings';
import ProfileActivities from './ProfileActivities';

const panes = [
    { menuItem: 'About', render: () => <ProfileDescription/> },
    { menuItem: 'Photos', render: () => <ProfilePhoto /> },
    { menuItem: 'Activities', render: () => <ProfileActivities /> },
    { menuItem: 'Followers', render: () => <ProfileFollowings /> },
    { menuItem: 'Following', render: () => <ProfileFollowings /> },
];

interface IProps {
    setActiveTab: (activeIndex: any) => void
}

const ProfileContent: React.FC<IProps> = ({setActiveTab}) => {
    return (
        <Tab 
            menu={{fluid: true, vertical: true}}
            menuPosition='left'
            panes={panes}
            onTabChange={(e, data) => setActiveTab(data.activeIndex)}
        />
    );
}

export default ProfileContent
