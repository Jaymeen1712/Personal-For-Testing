import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AboutAppComponent from './components/about-app-component';
import useBazzarvoiceComponentController from './bazzarvoice-component-controller';

const BazzarvoiceComponent = () => {
  const { path } = useBazzarvoiceComponentController();
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

export default BazzarvoiceComponent;
