import { useTranslation } from 'react-i18next';

const useIntegationHeaderController = () => {
  const { t } = useTranslation();
  return { t };
};

export default useIntegationHeaderController;
