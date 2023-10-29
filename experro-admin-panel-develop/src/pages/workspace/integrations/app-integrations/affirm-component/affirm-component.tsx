import AppInstalledComponent from './components/app-installed-component';
import AboutAppComponent from './components/about-app-component';
import { Route, Switch } from 'react-router-dom';
import AppIntegrationComponent from './components/integration-component';
import useAffirmComponentController from './affirm-component-controller';

const AffirmComponent = () => {
  const { path } = useAffirmComponentController();
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
export default AffirmComponent;
