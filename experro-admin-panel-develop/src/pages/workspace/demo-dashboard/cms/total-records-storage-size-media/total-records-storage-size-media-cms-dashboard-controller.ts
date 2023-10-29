import { useMediaManagerCountsDashboard } from '../../services';

const useTotalRecordsStorageSizeMediaCmsDashboardController = ({
  workspaceId,
  startDate,
  endDate,
}: {
  workspaceId: string;
  startDate?: string;
  endDate?: string;
}) => {
  const mediaManagerFileCounts = useMediaManagerCountsDashboard(
    workspaceId,
    startDate,
    endDate
  );

  return { mediaManagerFileCounts };
};

export default useTotalRecordsStorageSizeMediaCmsDashboardController;
