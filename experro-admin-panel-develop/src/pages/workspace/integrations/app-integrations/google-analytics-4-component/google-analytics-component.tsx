import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AboutAppComponent from './components/about-app-component';
import useGoogleAnalyticsComponentController from './google-analytics-component-controller';

const GoogleAnalyticsComponent = () => {
  const { path } = useGoogleAnalyticsComponentController();
  return (
    <div className="apps-page-main">
      <Switch>
        <Route exact path={`${path}/:id/:categoryId`}>
          <AboutAppComponent />
        </Route>
      </Switch>
    </div>
  );
};

export default GoogleAnalyticsComponent;
