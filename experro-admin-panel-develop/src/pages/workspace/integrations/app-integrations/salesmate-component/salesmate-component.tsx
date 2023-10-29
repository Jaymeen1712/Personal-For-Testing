import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AboutAppComponent from './components/about-app-component';
import useSalesmateComponentController from './salesmate-component-controller';

const SalesmateComponent = () => {
  const { path } = useSalesmateComponentController();
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

export default SalesmateComponent;
