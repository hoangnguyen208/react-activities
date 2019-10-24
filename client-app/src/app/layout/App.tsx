import React, { Fragment, useContext, useEffect } from "react";
import { Container } from "semantic-ui-react";
import NavBar from "../../features/nav/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { observer } from "mobx-react-lite";
import { Route } from "react-router-dom";
import { RouteComponentProps, withRouter, Switch } from "react-router";
import HomePage from "../../features/home/HomePage";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import ActivityForm from "../../features/activities/form/ActivityForm";
import NotFound from "./NotFound";
import {ToastContainer} from 'react-toastify';
import { RootStoreContext } from "../stores/rootStore";
import LoadingComponent from "./LoadingComponent";
import ModalContainer from "../common/modals/ModalContainer";
import Profile from '../../features/profile/Profile';
import PrivateRoute from "./PrivateRoute";

const App: React.FC<RouteComponentProps> = ({ location }) => {
  const rootStore = useContext(RootStoreContext);
  const {setAppLoaded, appLoaded} = rootStore.commonStore;
  const {token, getAuthUser} = rootStore.authStore;

  useEffect(() => {
    if (token) {
      getAuthUser().finally(() => setAppLoaded());
    } else {
      setAppLoaded();
    }
  }, [getAuthUser, setAppLoaded, token])

  if (!appLoaded) {
    return <LoadingComponent />
  }

  return (
    <Fragment>
      <ModalContainer />
      <ToastContainer position='bottom-right' />
      <Route path="/" exact component={HomePage} />
      <Route
        path={"/(.+)"}
        render={() => (
          <Fragment>
            <NavBar />
            <Container style={{ marginTop: "7em" }}>
              <Switch>
                <PrivateRoute path="/activities" exact component={ActivityDashboard} />
                <PrivateRoute path="/activities/:id" component={ActivityDetails} />
                <PrivateRoute
                  key={location.key}
                  path={["/createActivity", "/manage/:id"]}
                  component={ActivityForm}
                />
                <PrivateRoute path='/profile/:username' component={Profile} />
                <Route component={NotFound} />
              </Switch>
            </Container>
          </Fragment>
        )}
      />
    </Fragment>
  );
};

export default withRouter(observer(App));
