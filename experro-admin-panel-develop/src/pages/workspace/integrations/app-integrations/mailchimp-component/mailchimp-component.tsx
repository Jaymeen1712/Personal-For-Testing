import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AboutAppComponent from './components/about-app-component';
import useMailchimpComponentController from './mailchimp-component-controller';

const MailchimpComponent = () => {
  const { path } = useMailchimpComponentController();
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

export default MailchimpComponent;
