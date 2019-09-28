import React, { SyntheticEvent } from "react";
import { Grid } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import ActivityList from './ActivityList';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';

interface IProps {
    activities: IActivity[];
    editMode: boolean;
    selectedActivity: IActivity | null;
    submitting: boolean;
    target: string;
    createActivity: (activity: IActivity) => void;
    deleteActivity: (e: SyntheticEvent<HTMLButtonElement>,id: string) => void;
    editActivity: (activity: IActivity) => void;
    selectActivity: (id: string) => void;
    setEditMode: (editMode: boolean) => void;
    setSelectedActivity: (activity: IActivity | null) => void;
}

const ActivityDashboard: React.FC<IProps> = ({ 
  activities,
  createActivity,
  deleteActivity,
  editActivity,
  editMode,
  selectActivity,
  selectedActivity, 
  setEditMode,
  setSelectedActivity, 
  submitting,
  target 
}) => {
  return (
    <Grid>
      <Grid.Column width={10}>
          <ActivityList activities={activities} selectActivity={selectActivity} deleteActivity={deleteActivity} submitting={submitting} target={target} />
      </Grid.Column>
      <Grid.Column width={6}>
        {selectedActivity && !editMode && (<ActivityDetails activity={selectedActivity} setEditMode={setEditMode} setSelectedActivity={setSelectedActivity} />)}
        {editMode && 
          <ActivityForm  
            activity={selectedActivity}
            createActivity={createActivity}
            editActivity={editActivity}
            key={(selectedActivity && selectedActivity.id) || 0}
            setEditMode={setEditMode}   
            submitting={submitting}
          />
        }
      </Grid.Column>
    </Grid>
  );
};

export default ActivityDashboard;
