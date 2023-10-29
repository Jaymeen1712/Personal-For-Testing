import { useEffect, useState } from 'react';
import { SIDEBAR_KEYS } from '../../../utills';
import moment from 'moment/moment';
import { useTranslation } from 'react-i18next';

interface IUseAuditLogsController {
  onMainSidebarActiveItem?: (val: string) => void;
}

const useAuditLogsController = ({
  onMainSidebarActiveItem,
}: IUseAuditLogsController) => {
  const { t } = useTranslation();
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    if (onMainSidebarActiveItem) {
      onMainSidebarActiveItem(SIDEBAR_KEYS.GLOBAL.SETTINGS);
    }

    setStartDate(
      moment(new Date(new Date(Date.now()).getTime() - 7 * 24 * 60 * 60 * 1000))
        .utc()
        .format('YYYY-MM-DD')
    );
    setEndDate(
      moment(new Date(new Date(Date.now()).getTime()))
        .utc()
        .format('YYYY-MM-DD')
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onStartDateEndDateChange = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dates: any,
    dateStrings: [string, string]
  ) => {
    if (dates) {
      setStartDate(moment(new Date(dateStrings[0])).format('YYYY-MM-DD'));
      setEndDate(
        // @ts-ignore
        moment(new Date(dateStrings[1]).getTime()).format('YYYY-MM-DD')
      );
    }
  };

  return {
    t,
    startDate,
    endDate,
    onStartDateEndDateChange,
  };
};

export default useAuditLogsController;
