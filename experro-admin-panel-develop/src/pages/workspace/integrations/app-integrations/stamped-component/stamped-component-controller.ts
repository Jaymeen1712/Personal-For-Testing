import { useRouteMatch } from 'react-router-dom';

const useStampedComponentController = () => {
  const { path } = useRouteMatch();

  return {
    path,
  };
};

export default useStampedComponentController;
