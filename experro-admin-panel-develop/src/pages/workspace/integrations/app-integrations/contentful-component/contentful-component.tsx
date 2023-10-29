import useContentfulComponentController from './contentful-component-controller';
import AppInstalledComponent from './components/app-installed-component';
import AboutAppComponent from './components/about-app-component';
import { Route, Switch } from 'react-router-dom';
import AppIntegrationComponent from './components/integration-component';

const ContentfulComponent = () => {
  const { path } = useContentfulComponentController();
  return (
    <div className="apps-page-main">
      <Switch>
        <Route exact path={`${path}/:id/:categoryId/accept`}>
          <AppIntegrationComponent />
        </Route>

        <Route exact path={`${path}/:id/:categoryId/installed`}>
          <AppInstalledComponent />
        </Route>

        <Route exact path={`${path}/:id/:categoryId`}>
          <AboutAppComponent />
        </Route>
      </Switch>
    </div>
  );
};
export default ContentfulComponent;
