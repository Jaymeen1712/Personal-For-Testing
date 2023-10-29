import { useRouteMatch } from 'react-router-dom';

const useGoogleAnalyticsComponentController = () => {
  const { path } = useRouteMatch();

  return {
    path,
  };
};

export default useGoogleAnalyticsComponentController;
