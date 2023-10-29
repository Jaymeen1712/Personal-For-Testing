import { useTranslation } from 'react-i18next';

import { useActivitiesAudience } from '../../services';

interface IEventController {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detailsAudience: any;
  startDate?: string;
  endDate?: string;
  workspaceId: string;
  environmentId: string;
}

const useEventController = ({
  detailsAudience,
  startDate,
  endDate,
  workspaceId,
  environmentId,
}: IEventController) => {
  const { t } = useTranslation();

  const activitiesAudience = useActivitiesAudience(
    detailsAudience.device_id,
    workspaceId,
    environmentId,
    startDate,
    endDate
  );

  return {
    t,
    activitiesAudience,
  };
};

export default useEventController;
