import React from 'react';
import useB2bNinjaComponentController from './b2b-ninja-component-controller';
import { Route, Switch } from 'react-router-dom';
import AboutAppComponent from './components/about-app-component';

const B2bNinjaComponent = () => {
  const { path } = useB2bNinjaComponentController();
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

export default B2bNinjaComponent;
