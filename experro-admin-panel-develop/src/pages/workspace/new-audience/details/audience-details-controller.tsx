import moment from 'moment-timezone';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';

import useUser from '../../../../hooks/user/user';
import { useDetailsAudience } from '../services';
import useQuery from "../../../../hooks/queryParameter";

interface IAudienceParams {
  audienceId: string;
  workspaceId: string;
  segmentId: string;
  segmentType: string;
}

interface IUseAudienceDetailsController {
  environmentId: string;
}

const useAudienceDetailsController = ({
  environmentId,
}: IUseAudienceDetailsController) => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();

  const { audienceId, workspaceId, segmentType } = useParams<IAudienceParams>();

  const detailsAudience = useDetailsAudience(
    audienceId,
    workspaceId,
    environmentId
  );
  const user = useUser();
  const query = useQuery();

  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();

  const goToAudienceListPage = () => {
    if (location.pathname.split('/').includes('all-details')) {
      history.push(
        `/workspaces/${workspaceId}/audience/all-details?queryType=${query.get(
          'queryType'
        )}`
      );
    } else {
      history.push(
        `/workspaces/${workspaceId}/audience/${segmentType}/query-builder`
      );
    }
  };

  useEffect(() => {
    setStartDate(
      moment(
        new Date(new Date(Date.now()).getTime() - 30 * 24 * 60 * 60 * 1000)
      )
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
    goToAudienceListPage,
    detailsAudience,
    user,
    startDate,
    endDate,
    workspaceId,
    onStartDateEndDateChange,
  };
};

export default useAudienceDetailsController;
