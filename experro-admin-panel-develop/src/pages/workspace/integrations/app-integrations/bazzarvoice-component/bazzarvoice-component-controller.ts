import { useRouteMatch } from 'react-router-dom';

const useBazzarvoiceComponentController = () => {
  const { path } = useRouteMatch();

  return {
    path,
  };
};

export default useBazzarvoiceComponentController;
