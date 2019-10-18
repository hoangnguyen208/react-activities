import React from 'react';
import { Tab } from 'semantic-ui-react';
import ProfilePhoto from '../profile/ProfilePhoto';
import ProfileDescription from './ProfileDescription';

const panes = [
    { menuItem: 'About', render: () => <ProfileDescription/> },
    { menuItem: 'Photos', render: () => <ProfilePhoto /> },
    { menuItem: 'Activities', render: () => <Tab.Pane>Activities content</Tab.Pane> },
    { menuItem: 'Followers', render: () => <Tab.Pane>Followers content</Tab.Pane> },
    { menuItem: 'Following', render: () => <Tab.Pane>Following content</Tab.Pane> },
];

const ProfileContent = () => {
    return (
        <Tab 
            menu={{fluid: true, vertical: true}}
            menuPosition='left'
            panes={panes}
        />
    );
}

export default ProfileContent
