import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AboutAppComponent from './components/about-app-component';
import useKlaviyoComponentController from './klaviyo-component-controller';

const KlaviyoComponent = () => {
  const { path } = useKlaviyoComponentController();
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

export default KlaviyoComponent;
