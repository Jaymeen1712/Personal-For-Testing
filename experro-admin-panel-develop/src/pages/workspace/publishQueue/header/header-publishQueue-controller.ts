import { useTranslation } from 'react-i18next';
import moment from 'moment/moment';

interface IUseHeaderPublishQueueController {
  setCurrentPageNumber: (currentPageNumber: number) => void;
  setSkip: (skip: number) => void;
  setStartDate: (startDate?: string) => void;
  setEndDate: (endDate?: string) => void;
}

const useHeaderPublishQueueController = ({
  setCurrentPageNumber,
  setSkip,
  setStartDate,
  setEndDate,
}: IUseHeaderPublishQueueController) => {
  const { t } = useTranslation();

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
    setCurrentPageNumber(1);
    setSkip(1);
  };

  return { t, onStartDateEndDateChange };
};

export default useHeaderPublishQueueController;
