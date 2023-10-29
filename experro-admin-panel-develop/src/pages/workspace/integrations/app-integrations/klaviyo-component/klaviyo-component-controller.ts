import { useRouteMatch } from 'react-router-dom';

const useKlaviyoComponentController = () => {
  const { path } = useRouteMatch();

  return {
    path,
  };
};

export default useKlaviyoComponentController;
