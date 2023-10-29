import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { ContentLibraryContext } from '../../context';

const useWarningUnsavedChangesController = () => {
  const { t } = useTranslation();
  const contentLibraryContext = useContext(ContentLibraryContext);

  const onCancel = () => {
    contentLibraryContext?.changeWarningPopupVisible({
      version: false,
      sidebar: false,
      relation: false,
      refresh: false,
      goBack: false,
    });
  };
  return { t, onCancel };
};
export default useWarningUnsavedChangesController;
