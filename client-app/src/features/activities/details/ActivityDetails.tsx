import React, { useContext, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import ActivityDetailedChat from '../details/ActivityDetailedChat';
import ActivityDetailedHeader from '../details/ActivityDetailedHeader';
import ActivityDetailedInfo from '../details/ActivityDetailedInfo';
import ActivityDetailedSidebar from '../details/ActivityDetailedSidebar';
import { RootStoreContext } from "../../../app/stores/rootStore";

interface DetailParams {
  id: string
}

const ActivityDetails: React.FC<RouteComponentProps<DetailParams>> = ({ match, history }) => {
  const rootStore = useContext(RootStoreContext);
  const {activity, loadActivity, loadingInitial} = rootStore.activityStore;

  useEffect(() => {
    loadActivity(match.params.id)
  }, [match.params.id, loadActivity, history]);

  if (loadingInitial) return <LoadingComponent />;

  if (!activity)
    return <h2>Activity not found</h2>

  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityDetailedHeader activity={activity} />
        <ActivityDetailedInfo activity={activity} />
        <ActivityDetailedChat />
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityDetailedSidebar attendees={activity.attendees} />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDetails);
