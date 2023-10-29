import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import ListNavigation from './list';
import UpdateNavigation from './update';

const Navigation: React.FC = () => {
  const { path } = useRouteMatch();

  return (
    <div className="page-wrapper">
      <Switch>
        <Route exact path={`${path}/`}>
          <ListNavigation />
        </Route>
        <Route exact path={`${path}/:menuId`}>
          <UpdateNavigation />
        </Route>
      </Switch>
    </div>
  );
};

export default Navigation;
