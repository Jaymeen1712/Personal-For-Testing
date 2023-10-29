import { useTranslation } from 'react-i18next';
import { useState } from 'react';

import { useActivitiesAudience } from '../../../services';

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

  const [activeCollapse, setActiveCollapse] = useState<string[]>([]);

  const activitiesAudience = useActivitiesAudience(
    detailsAudience.device_id,
    workspaceId,
    environmentId,
    startDate,
    endDate
  );

  const onCollapseChange = (eventKey: string) => {
    const tempArr = [...activeCollapse];
    const index = activeCollapse?.findIndex((val) => val === eventKey);
    if (index === -1) {
      tempArr.push(eventKey);
    } else {
      tempArr.splice(index, 1);
    }
    setActiveCollapse(tempArr);
  };

  return {
    t,
    activitiesAudience,
    activeCollapse,
    onCollapseChange,
  };
};

export default useEventController;
