import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';

const useContentfulComponentController = () => {
  const history = useHistory();
  const location = useLocation();
  const { path } = useRouteMatch();

  const onBackButtonClick = () => {
    console.log('test');
  };
  const onGetThisAppButtonClick = () => {
    history.push(`${location.pathname}?contentfulState=appIntegration`);
  };

  return {
    onBackButtonClick,
    onGetThisAppButtonClick,
    path,
  };
};
export default useContentfulComponentController;
