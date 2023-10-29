import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';

const useBigcommerceComponentController = () => {
  const history = useHistory();
  const location = useLocation();
  const { path } = useRouteMatch();

  const onBackButtonClick = () => {
    console.log('test');
  };
  const onGetThisAppButtonClick = () => {
    history.push(`${location.pathname}?shopifyState=appIntegration`);
  };

  return {
    onBackButtonClick,
    onGetThisAppButtonClick,
    path,
  };
};
export default useBigcommerceComponentController;
