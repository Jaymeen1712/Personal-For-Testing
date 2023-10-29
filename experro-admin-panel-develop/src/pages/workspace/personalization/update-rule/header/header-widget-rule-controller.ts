import { useEffect } from 'react';
import { convertCurrentTimeZoneToUtc } from '../../../../../utills';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';

interface IUseHeaderController {
  //eslint-disable-next-line
  ruleData: any;
  isSuccess: boolean;
  startDate?: string;
  endDate?: string;
  selectedWidget: { id: string; type?: string | undefined } | undefined;
  //eslint-disable-next-line
  onSetRuleData: (data: any) => void;
  onAddEditRuleModalVisible: (val: boolean) => void;
  onSetEditRule: (val: boolean) => void;
  onSetStartDate: (val: string) => void;
  onSetEndDate: (val: string) => void;
}

const useHeaderWidgetRuleController = ({
  ruleData,
  isSuccess,
  startDate,
  endDate,
  selectedWidget,
  onSetRuleData,
  onAddEditRuleModalVisible,
  onSetEditRule,
  onSetEndDate,
  onSetStartDate,
}: IUseHeaderController) => {
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const { workspaceId } = useParams<{
    workspaceId: string;
  }>();
  const environment = location.pathname.split('/')[10];
  const onEditRule = () => {
    onSetEditRule(true);
    onAddEditRuleModalVisible(true);
  };

  const onCancel = () => {
    history.push(
      `/workspaces/${workspaceId}/personalization/${selectedWidget?.type}/${selectedWidget?.id}/list-records`
    );
  };

  const onCancelRuleModalVisible = (val: boolean) => {
    onAddEditRuleModalVisible(val);
  };

  const onStartDateEndDateChange = (
    //eslint-disable-next-line
    dates: any,
    dateStrings: [string, string]
  ) => {
    const newRuleList = ruleData;

    if (dates) {
      const startDate = convertCurrentTimeZoneToUtc(dates[0]);
      const endDate = convertCurrentTimeZoneToUtc(dates[1]);

      if (newRuleList?.contentModelFieldData) {
        onSetStartDate(startDate);
        onSetEndDate(endDate);

        newRuleList.contentModelFieldData.startDateEdti = startDate;
        newRuleList.contentModelFieldData.endDateEdti = endDate;
      }
      onSetRuleData(newRuleList);
    }
  };

  useEffect(() => {
    onSetStartDate(ruleData?.contentModelFieldData.startDateEdti);
    onSetEndDate(ruleData?.contentModelFieldData.endDateEdti);
    //eslint-disable-next-line
  }, [ruleData]);

  useEffect(() => {
    if (
      ruleData?.contentModelFieldData.startDateEdti === undefined &&
      ruleData?.contentModelFieldData.endDateEdti === undefined
    ) {
      const tempDate = new Date(Date.now());

      const startDate = new Date(
        tempDate.getTime() - 24 * 60 * 60 * 1000
      ).toUTCString();

      const endDate = new Date(
        tempDate.getTime() + 7 * 24 * 60 * 60 * 1000
      ).toUTCString();

      onSetStartDate(startDate);
      onSetEndDate(endDate);
    }
    // eslint-disable-next-line
  }, [ruleData, isSuccess]);

  return {
    t,
    onEditRule,
    environment,
    startDate,
    endDate,
    onCancel,
    onStartDateEndDateChange,
    onCancelRuleModalVisible,
  };
};

export default useHeaderWidgetRuleController;
