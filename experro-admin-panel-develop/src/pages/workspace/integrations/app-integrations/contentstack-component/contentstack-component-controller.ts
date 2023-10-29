import { useRouteMatch } from 'react-router-dom';

const useContentstackComponentController = () => {
  const { path } = useRouteMatch();

  return {
    path,
  };
};

export default useContentstackComponentController;
