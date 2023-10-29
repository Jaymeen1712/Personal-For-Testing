import { useRouteMatch } from 'react-router-dom';

const usePowerreviewComponentController = () => {
  const { path } = useRouteMatch();

  return {
    path,
  };
};

export default usePowerreviewComponentController;
