import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { CheckboxValueType } from 'antd/es/checkbox/Group';

interface IUseDirtyCheckCreateUpdateRulesController {
  setIsDirtyCheckModelVisible: (isDirtyCheckModelVisible: boolean) => void;
  setCheckedProduct: (checkedProduct: CheckboxValueType[]) => void;
  setSelectedProductsCategories: (
    selectedProductsCategories: {
      label: string;
      value: string;
      id?: string;
      toggle?: boolean;
    }[]
  ) => void;
  setSelectedProductSearchRule: (
    selectedProductSearchRule: {
      id: string;
      text: string;
      className?: string;
    }[]
  ) => void;
  setSelectedProductGlobal: (
    selectedProductGlobal: { id: string; text: string; className?: string }[]
  ) => void;
  saveRule: () => void;
}

interface DirtyCheckCreateUpdateRuleParams {
  workspaceId: string;
  subMenu?: string;
}

const useDirtyCheckCreateUpdateRulesController = ({
  setIsDirtyCheckModelVisible,
  setCheckedProduct,
  setSelectedProductsCategories,
  setSelectedProductSearchRule,
  setSelectedProductGlobal,
  saveRule,
}: IUseDirtyCheckCreateUpdateRulesController) => {
  const { t } = useTranslation();
  const history = useHistory();

  const { workspaceId, subMenu } =
    useParams<DirtyCheckCreateUpdateRuleParams>();

  const onCancel = () => {
    setIsDirtyCheckModelVisible(false);
  };

  const discardDirtyCheckModel = () => {
    setIsDirtyCheckModelVisible(false);
    setCheckedProduct([]);
    setSelectedProductsCategories([]);
    setSelectedProductSearchRule([]);
    setSelectedProductGlobal([]);
    history.push(
      `/workspaces/${workspaceId}/discovery/rules/${subMenu}/list-records`
    );
  };

  const onSaveDirtyCheckButton = () => {
    saveRule();
  };

  return { t, onCancel, discardDirtyCheckModel, onSaveDirtyCheckButton };
};

export default useDirtyCheckCreateUpdateRulesController;
