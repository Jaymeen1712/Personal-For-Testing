import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AboutAppComponent from './components/about-app-component';
import usePowerreviewComponentController from './powerreview-component-controller';

const PowerreviewComponent = () => {
  const { path } = usePowerreviewComponentController();
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

export default PowerreviewComponent;
