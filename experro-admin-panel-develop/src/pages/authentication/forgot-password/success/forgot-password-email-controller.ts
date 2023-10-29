import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

const useForgotPasswordEmailController = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const redirectToLogin = () => {
    history.push('/login');
  };

  return {
    t,
    redirectToLogin,
  };
};

export default useForgotPasswordEmailController;
