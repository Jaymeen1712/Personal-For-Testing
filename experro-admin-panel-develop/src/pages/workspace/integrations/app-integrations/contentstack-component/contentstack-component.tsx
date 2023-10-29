import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AboutAppComponent from './components/about-app-component';
import useContentstackComponentController from './contentstack-component-controller';

const ContentstackComponent = () => {
  const { path } = useContentstackComponentController();
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

export default ContentstackComponent;
